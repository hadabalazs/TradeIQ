// Certificate issuance and verification.
//
// SECURITY — two problems this file used to have, both fixed in migration 007.
//
// 1. /verify/:certId rendered "Certificate Verified" for any string, because it
//    performed no lookup. A credential could be fabricated by inventing an id.
//
// 2. Issuance was a plain table write guarded only by `auth.uid() = user_id`,
//    with the client supplying the course, the score and the id. Any free
//    account could therefore write itself a 100% pass for any course without
//    opening a lesson, and verification would then confirm it.
//
// Both paths now go through security-definer functions. `verify_certificate`
// returns at most one row, matched by exact id — there is no query shape that
// asks it for every certificate. `issue_certificate` reads the caller's own
// stored progress to decide whether a certificate is owed and what score it
// carries; nothing about the outcome comes from the request.

import { supabase } from '@/lib/supabaseClient';
import { pushToCloud } from '@/lib/sync';

// True once we know the certificate functions exist. Until migration 007 is
// run, issuance is a no-op and verification reports "cannot verify" rather than
// claiming validity.
//
// Only a positive result is cached. Caching a failure would mean a single
// offline check disabled certificates for the rest of the session, long after
// the connection came back.
let _available = null;

export async function certificatesAvailable() {
  if (_available === true) return true;
  const { error } = await supabase.rpc('verify_certificate', { p_cert_id: '__probe__' });
  if (error) return false;
  _available = true;
  return true;
}

// Issue (or refresh) the signed-in learner's certificate for a course. Returns
// the certificate id, or null when it cannot be issued — guest, offline, the
// migration not yet run, or the course genuinely not earned. Callers must treat
// null as "no verifiable certificate" rather than falling back to a made-up id.
//
// No score argument: the server takes it from stored progress. Passing one
// would be the vulnerability this replaced.
export async function issueCertificate({ userId, courseId, courseTitle, learnerName }) {
  if (!userId || !courseId) return null;

  // The server decides from the CLOUD copy of progress, which the local device
  // may be ahead of — certification is written locally and pushed on a debounce,
  // so issuing immediately after passing could otherwise be refused for a
  // learner who genuinely earned it. Flushing first removes that race.
  try {
    await pushToCloud();
  } catch {
    // Offline. The RPC below will fail too, and returns null.
  }

  const { data, error } = await supabase.rpc('issue_certificate', {
    p_course_id: courseId,
    p_course_title: courseTitle || courseId,
    p_learner_name: learnerName || 'Learner',
  });
  if (error) return null;
  _available = true;
  return data || null;
}

export async function getCertificateForCourse(userId, courseId) {
  if (!userId || !courseId) return null;
  // Readable under the "read own" policy — scoped to the caller's own rows.
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
  const { data, error } = await supabase.rpc('verify_certificate', { p_cert_id: certId });
  if (error) return { status: 'unavailable' };
  // A set-returning function comes back as an array; empty means no such id.
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return { status: 'invalid' };
  return { status: 'valid', certificate: row };
}
