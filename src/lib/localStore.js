// Local storage backed store for custom courses and lesson notes.
// Replaces the Base44 CustomCourse entity and communityNotes function.

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

export function listNotes(lessonId) {
  const all = read(NOTES_KEY, {});
  return all[lessonId] || [];
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
  write(NOTES_KEY, all);
}
