// Local storage backed store for downloaded custom courses and lesson notes.
// These stay on the device: notes are private to the learner, and a downloaded
// course must keep working offline.

const COURSES_KEY = 'tradeiq_custom_courses';
const NOTES_KEY = 'tradeiq_lesson_notes';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

import { notifyDataChanged } from "@/lib/sync";

function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  notifyDataChanged();
}

export function listCustomCourses(filter = {}) {
  const all = read(COURSES_KEY, []);
  const keys = Object.keys(filter);
  if (keys.length === 0) return all;
  return all.filter((rec) => keys.every((k) => rec[k] === filter[k]));
}

export function createCustomCourse(record) {
  const all = read(COURSES_KEY, []);
  const created = {
    ...record,
    id: `cc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    created_date: new Date().toISOString(),
  };
  all.push(created);
  write(COURSES_KEY, all);
  return created;
}

export function deleteCustomCourse(id) {
  const all = read(COURSES_KEY, []);
  write(COURSES_KEY, all.filter((rec) => rec.id !== id));
}

// --- Lesson notes ---
//
// Notes are keyed "<courseId>::<topicId>". They used to be keyed by the bare
// topic id, which silently merged the notes of any two courses sharing a topic
// id — and topic ids are only unique WITHIN a course, so an uploaded course
// using "m1t1" collided with the built-in IFRS curriculum.
//
// Legacy bare-id entries are read but never written to and never migrated. A
// bare key is genuinely ambiguous — there is no way to know which course its
// notes belonged to — so moving it to the first course that happens to open
// that topic would misattribute someone's notes. Reading both means nothing is
// lost and behaviour for old notes is unchanged, while every new note is
// written to the scoped key.
export function lessonNoteKey(courseId, topicId) {
  return courseId ? `${courseId}::${topicId}` : topicId;
}

function legacyKeyFor(lessonId) {
  const sep = lessonId.indexOf('::');
  return sep === -1 ? null : lessonId.slice(sep + 2);
}

export function listNotes(lessonId) {
  const all = read(NOTES_KEY, {});
  const legacy = legacyKeyFor(lessonId);
  const scoped = all[lessonId] || [];
  if (!legacy || !all[legacy]) return scoped;
  return [...all[legacy], ...scoped];
}

export function addNote(lessonId, text) {
  const all = read(NOTES_KEY, {});
  const note = {
    id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    text,
    created_date: new Date().toISOString(),
  };
  all[lessonId] = [...(all[lessonId] || []), note];
  write(NOTES_KEY, all);
  return note;
}

export function deleteNote(lessonId, noteId) {
  const all = read(NOTES_KEY, {});
  all[lessonId] = (all[lessonId] || []).filter((n) => n.id !== noteId);
  // The note may live under the legacy bare-id key rather than the scoped one.
  const legacy = legacyKeyFor(lessonId);
  if (legacy && all[legacy]) {
    all[legacy] = all[legacy].filter((n) => n.id !== noteId);
    if (all[legacy].length === 0) delete all[legacy];
  }
  write(NOTES_KEY, all);
}
