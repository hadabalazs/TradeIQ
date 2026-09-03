// A minimal QR encoder, producing a data-URI SVG.
//
// Replaces a call to api.qrserver.com, which meant every certificate render
// disclosed the certificate id and the site's domain to a third party, and made
// PDF export depend on that service being reachable. Neither is acceptable for
// a credential.
//
// Scope is deliberately narrow: byte mode, error-correction level M, versions
// 1-6 (up to 108 bytes). A verification URL is around 53 characters, so that is
// roughly double the headroom needed. Anything longer throws rather than
// silently producing an unreadable code.
//
// The cap is at 6 because versions 7 and above additionally carry an 18-bit
// version-information block near two of the finders, which this does not emit —
// a version 7 code produced without it scans as nothing. Rather than ship that
// path untested for capacity no certificate needs, every version here is
// round-trip verified by decoding its own output.

// Total data codewords available at level M, indexed by version (1-6).
const DATA_CODEWORDS_M = [null, 16, 28, 44, 64, 86, 108];

// EC codewords per block, and block layout, at level M for versions 1-6.
// [ec codewords per block, group1 blocks, group1 data codewords, group2 blocks, group2 data codewords]
const EC_BLOCKS_M = [
  null,
  [10, 1, 16, 0, 0],
  [16, 1, 28, 0, 0],
  [26, 1, 44, 0, 0],
  [18, 2, 32, 0, 0],
  [24, 2, 43, 0, 0],
  [16, 4, 27, 0, 0],
];

// Alignment pattern centres per version.
const ALIGN_POS = [
  null, [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
];

// --- Galois field (GF(256)) arithmetic for Reed-Solomon ---------------------
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();

const mul = (a, b) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]);

function rsGeneratorPoly(degree) {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    const next = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= mul(poly[j], EXP[i]);
      next[j + 1] ^= poly[j];
    }
    poly = next;
  }
  // Built lowest-degree-first above; rsEncode indexes it highest-degree-first
  // with the leading coefficient at [0], so hand it back in that order.
  return poly.reverse();
}

function rsEncode(data, ecLen) {
  const gen = rsGeneratorPoly(ecLen);
  const res = new Array(ecLen).fill(0);
  for (const byte of data) {
    const factor = byte ^ res[0];
    res.shift();
    res.push(0);
    for (let i = 0; i < ecLen; i++) res[i] ^= mul(gen[i + 1], factor);
  }
  return res;
}

// --- Bit stream -------------------------------------------------------------
class Bits {
  constructor() { this.bits = []; }
  push(value, length) {
    for (let i = length - 1; i >= 0; i--) this.bits.push((value >>> i) & 1);
  }
  get length() { return this.bits.length; }
}

const MAX_VERSION = 6;

function chooseVersion(byteLen) {
  for (let v = 1; v <= MAX_VERSION; v++) {
    // 4 bits mode + 8-bit length field + data, all in bits. The length field is
    // 8 bits for every version up to 9, so it is constant across this range.
    if (DATA_CODEWORDS_M[v] * 8 >= 4 + 8 + byteLen * 8) return v;
  }
  throw new Error('qrcode: content too long (max ~106 bytes at version 6, EC level M)');
}

// --- Matrix construction ----------------------------------------------------
function buildMatrix(version, codewords) {
  const size = version * 4 + 17;
  const m = Array.from({ length: size }, () => new Array(size).fill(null));
  const reserved = Array.from({ length: size }, () => new Array(size).fill(false));

  const setFn = (r, c, v) => { m[r][c] = v; reserved[r][c] = true; };

  // Finder patterns plus separators.
  const finder = (row, col) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = row + r, cc = col + c;
        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
        const inRing = (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
                       (c >= 0 && c <= 6 && (r === 0 || r === 6));
        const inCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        setFn(rr, cc, inRing || inCore ? 1 : 0);
      }
    }
  };
  finder(0, 0); finder(0, size - 7); finder(size - 7, 0);

  // Timing patterns.
  for (let i = 8; i < size - 8; i++) {
    setFn(6, i, i % 2 === 0 ? 1 : 0);
    setFn(i, 6, i % 2 === 0 ? 1 : 0);
  }

  // Alignment patterns, skipping those that collide with finders.
  const centres = ALIGN_POS[version];
  for (const r of centres) {
    for (const c of centres) {
      if ((r <= 8 && c <= 8) || (r <= 8 && c >= size - 9) || (r >= size - 9 && c <= 8)) continue;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const ring = Math.max(Math.abs(dr), Math.abs(dc));
          setFn(r + dr, c + dc, ring === 1 ? 0 : 1);
        }
      }
    }
  }

  // Dark module, and reserve the format-information areas.
  setFn(size - 8, 8, 1);
  for (let i = 0; i < 9; i++) {
    if (m[8][i] === null) { m[8][i] = 0; reserved[8][i] = true; }
    if (m[i][8] === null) { m[i][8] = 0; reserved[i][8] = true; }
  }
  for (let i = 0; i < 8; i++) {
    if (m[8][size - 1 - i] === null) { m[8][size - 1 - i] = 0; reserved[8][size - 1 - i] = true; }
    if (m[size - 1 - i][8] === null) { m[size - 1 - i][8] = 0; reserved[size - 1 - i][8] = true; }
  }

  // Place data in the two-column zigzag, bottom-right to top-left.
  let bitIndex = 0;
  const totalBits = codewords.length * 8;
  const bitAt = (i) => (i < totalBits ? (codewords[i >> 3] >> (7 - (i & 7))) & 1 : 0);

  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--; // The vertical timing pattern is skipped entirely.
    for (let i = 0; i < size; i++) {
      const upward = ((col + 1) & 2) === 0;
      const row = upward ? size - 1 - i : i;
      for (const c of [col, col - 1]) {
        if (reserved[row][c]) continue;
        m[row][c] = bitAt(bitIndex++);
      }
    }
  }

  return { m, reserved, size };
}

const MASKS = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (r, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
];

// Format information, including its BCH error correction and the fixed XOR.
function formatBits(maskIndex) {
  // Level M is 0b00 in the format-information encoding.
  const data = (0b00 << 3) | maskIndex;
  let rem = data;
  for (let i = 0; i < 10; i++) {
    rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  }
  return ((data << 10) | rem) ^ 0b101010000010010;
}

function applyFormat(m, size, maskIndex) {
  const bits = formatBits(maskIndex);
  const bit = (i) => (bits >> i) & 1;

  // First copy, around the top-left finder: bits 0-8 run DOWN column 8, then
  // bits 9-14 run LEFT along row 8. Getting these two axes the wrong way round
  // produces a code that looks plausible and decodes as nothing.
  for (let i = 0; i <= 5; i++) m[i][8] = bit(i);
  m[7][8] = bit(6);
  m[8][8] = bit(7);
  m[8][7] = bit(8);
  for (let i = 9; i < 15; i++) m[8][14 - i] = bit(i);

  // Second copy: bits 0-7 up the bottom-left, bits 8-14 along the top-right.
  for (let i = 0; i < 8; i++) m[size - 1 - i][8] = bit(i);
  for (let i = 8; i < 15; i++) m[8][size - 15 + i] = bit(i);

  // The dark module sits inside the range the first loop just wrote over, so it
  // is re-asserted here rather than in buildMatrix.
  m[size - 8][8] = 1;
}

// Penalty scoring, used to pick the mask that reads most reliably.
function penalty(m, size) {
  let score = 0;
  // Rule 1: runs of five or more identical modules.
  for (let i = 0; i < size; i++) {
    for (const line of [m[i], m.map((row) => row[i])]) {
      let run = 1;
      for (let j = 1; j < size; j++) {
        if (line[j] === line[j - 1]) { run++; }
        else { if (run >= 5) score += 3 + (run - 5); run = 1; }
      }
      if (run >= 5) score += 3 + (run - 5);
    }
  }
  // Rule 2: 2x2 blocks of one colour.
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = m[r][c];
      if (v === m[r][c + 1] && v === m[r + 1][c] && v === m[r + 1][c + 1]) score += 3;
    }
  }
  // Rule 3: finder-like patterns.
  const pat1 = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
  const pat2 = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
  const match = (line, start, pat) => pat.every((p, k) => line[start + k] === p);
  for (let i = 0; i < size; i++) {
    const row = m[i];
    const col = m.map((r) => r[i]);
    for (const line of [row, col]) {
      for (let j = 0; j + 11 <= size; j++) {
        if (match(line, j, pat1) || match(line, j, pat2)) score += 40;
      }
    }
  }
  // Rule 4: overall balance of dark modules.
  let dark = 0;
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) dark += m[r][c];
  const pct = (dark * 100) / (size * size);
  score += Math.floor(Math.abs(pct - 50) / 5) * 10;
  return score;
}

// Interleave data and error-correction codewords per the block layout.
function buildCodewords(version, dataBytes) {
  const [ecLen, g1, g1Len, g2, g2Len] = EC_BLOCKS_M[version];
  const blocks = [];
  let pos = 0;
  for (let i = 0; i < g1; i++) { blocks.push(dataBytes.slice(pos, pos + g1Len)); pos += g1Len; }
  for (let i = 0; i < g2; i++) { blocks.push(dataBytes.slice(pos, pos + g2Len)); pos += g2Len; }

  const ecBlocks = blocks.map((b) => rsEncode(b, ecLen));

  const out = [];
  const maxData = Math.max(...blocks.map((b) => b.length));
  for (let i = 0; i < maxData; i++) {
    for (const b of blocks) if (i < b.length) out.push(b[i]);
  }
  for (let i = 0; i < ecLen; i++) {
    for (const b of ecBlocks) out.push(b[i]);
  }
  return out;
}

function encodeToMatrix(text) {
  const bytes = new TextEncoder().encode(text);
  const version = chooseVersion(bytes.length);
  const capacity = DATA_CODEWORDS_M[version];

  const bits = new Bits();
  bits.push(0b0100, 4);       // byte mode
  bits.push(bytes.length, 8); // length field, 8 bits for versions 1-9
  for (const b of bytes) bits.push(b, 8);

  // Terminator, then pad to a byte boundary, then the alternating pad bytes.
  const capacityBits = capacity * 8;
  bits.push(0, Math.min(4, capacityBits - bits.length));
  while (bits.length % 8 !== 0) bits.bits.push(0);

  const dataBytes = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bits.bits[i + j];
    dataBytes.push(byte);
  }
  const PAD = [0xec, 0x11];
  let padIndex = 0;
  while (dataBytes.length < capacity) dataBytes.push(PAD[padIndex++ % 2]);

  const codewords = buildCodewords(version, dataBytes);
  const { m, reserved, size } = buildMatrix(version, codewords);

  // Try every mask and keep the lowest-penalty result.
  let best = null;
  for (let maskIndex = 0; maskIndex < 8; maskIndex++) {
    const cand = m.map((row) => row.slice());
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!reserved[r][c] && MASKS[maskIndex](r, c)) cand[r][c] ^= 1;
      }
    }
    applyFormat(cand, size, maskIndex);
    const score = penalty(cand, size);
    if (!best || score < best.score) best = { score, matrix: cand };
  }
  return { matrix: best.matrix, size };
}

// Render as an SVG data URI. SVG rather than canvas so it stays crisp at print
// resolution in the PDF export, and needs no DOM to produce.
export function qrDataUri(text, { dark = '#1A2B1E', light = '#F5EDD8', margin = 2 } = {}) {
  const { matrix, size } = encodeToMatrix(text);
  const dim = size + margin * 2;

  let path = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c]) path += `M${c + margin} ${r + margin}h1v1h-1z`;
    }
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dim} ${dim}" shape-rendering="crispEdges">` +
    `<rect width="${dim}" height="${dim}" fill="${light}"/>` +
    `<path d="${path}" fill="${dark}"/>` +
    `</svg>`;

  // encodeURIComponent rather than base64: no btoa unicode pitfalls, and the
  // result is smaller for this kind of markup.
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export { encodeToMatrix };
