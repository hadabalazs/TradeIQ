// Stable content hash for a question, so identical questions share one SRS card
// everywhere and can be referenced by admin overrides.
//
// Lives in its own module (rather than in srs.js, where it started) to keep the
// import graph acyclic: courses.js → questionOverrides.js → questionId.js, with
// nothing importing back into courses.js.
//
// NOTE: this is derived from CONTENT. Editing a question's text or correct
// answer changes its id. Anything that needs identity to survive an edit — SRS
// history, override bookkeeping — must record the old and new ids explicitly
// rather than assuming the hash is stable across a correction.
export function questionId(q) {
  const basis = `${q.q || q.front || q.title || ""}|${q.answerText || (q.options ? q.options[q.answer] : "") || ""}`;
  let h = 0;
  for (let i = 0; i < basis.length; i++) {
    h = ((h << 5) - h + basis.charCodeAt(i)) | 0;
  }
  return `q${(h >>> 0).toString(36)}`;
}
