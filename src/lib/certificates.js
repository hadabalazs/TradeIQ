// Certificate issuance and verification.
//
// SECURITY: /verify/:certId used to render "Certificate Verified" for any string
// it was given — it performed no lookup whatsoever, so a credential could be
// fabricated by inventing an id. Verification now resolves the id against the
// certificates table and reports honestly when nothing is found.
//
// Ids were also derived from a 32-bit hash of name + score + date, which is
// guessable and collision-prone. Issued ids are random tokens, so they cannot be
// derived from a learner's details or enumerated.

import { supabase } from '@/lib/supabaseClient';

export function newCertificateId() {
  const raw =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, '')
      : Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return `TIQ-${raw.slice(0, 16).toUpperCase()}`;
}

// True once we know the table exists. Until the migration is run, issuance is a
// no-op and verification reports "cannot verify" rather than claiming validity.
let _available = null;

export async function certificatesAvailable() {
  if (_available !== null) return _available;
  const { error } = await supabase.from('certificates').select('cert_id').limit(1);
  _available = !error;
  return _available;
}

// Issue (or refresh) the signed-in learner's certificate for a course. Returns
// the certificate id, or null when it can't be issued — guest, offline, or the
// migration not yet run. Callers must treat null as "no verifiable certificate"
// rather than falling back to a made-up id.
export async function issueCertificate({ userId, courseId, courseTitle, learnerName, score }) {
  if (!userId || !courseId) return null;
  if (!(await certificatesAvailable())) return null;

  // Re-passing a course keeps the original id so previously shared links stay
  // valid; only the score and issue date move.
  const existing = await getCertificateForCourse(userId, courseId);
  const certId = existing?.cert_id || newCertificateId();

  const { error } = await supabase.from('certificates').upsert(
    {
      cert_id: certId,
      user_id: userId,
      course_id: courseId,
      course_title: courseTitle || courseId,
      learner_name: learnerName || 'Learner',
      score: Math.max(0, Math.min(100, Math.round(score || 0))),
      issued_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,course_id' }
  );
  if (error) return null;
  return certId;
}

export async function getCertificateForCourse(userId, courseId) {
  if (!userId || !courseId) return null;
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle();
  if (error) return null;
  return data;
}

// Verification result is explicit about the three outcomes, so the UI can never
// present "unknown" as "valid".
export async function verifyCertificate(certId) {
  if (!certId) return { status: 'invalid' };
  const { data, error } = await supabase
    .from('certificates')
    .select('cert_id, course_title, learner_name, score, issued_at')
    .eq('cert_id', certId)
    .maybeSingle();
  if (error) return { status: 'unavailable' };
  if (!data) return { status: 'invalid' };
  return { status: 'valid', certificate: data };
}
