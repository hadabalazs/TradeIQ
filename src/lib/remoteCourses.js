// Remote course catalog backed by Supabase.
// - Built-in courses ship in the app bundle (always offline).
// - Additional courses are published by admins to the `courses` table and
//   downloaded on demand by users into local storage (then fully offline).

import { supabase } from '@/lib/supabaseClient';
import { listCustomCourses, createCustomCourse, deleteCustomCourse } from '@/lib/localStore';

const CATALOG_CACHE_KEY = 'tradeiq_remote_catalog';

// ---- User-facing: catalog + downloads ----

// Lightweight metadata only — course_data is fetched on download.
export async function fetchCatalog() {
  const { data, error } = await supabase
    .from('courses')
    .select('course_id, title, subtitle, description, category, level, icon, gradient, modules_count, topics_count')
    .eq('is_published', true)
    .order('created_at', { ascending: true });
  if (error) throw error;
  try {
    localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify({ fetched_at: new Date().toISOString(), items: data }));
  } catch { /* ignore */ }
  return data;
}

export function cachedCatalog() {
  try {
    const raw = localStorage.getItem(CATALOG_CACHE_KEY);
    return raw ? JSON.parse(raw).items : [];
  } catch {
    return [];
  }
}

export async function downloadCourse(courseId) {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('course_id', courseId)
    .eq('is_published', true)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('Course not found');
  // Replace any previous download of the same course
  const existing = listCustomCourses({ course_id: courseId });
  for (const rec of existing) deleteCustomCourse(rec.id);
  createCustomCourse({
    course_id: data.course_id,
    title: data.title,
    subtitle: data.subtitle || '',
    description: data.description || '',
    category: data.category || 'General',
    level: data.level || 'Intermediate',
    certificate_text: data.certificate_text || data.title,
    icon: data.icon || 'BookOpen',
    gradient: data.gradient || 'from-blue-500/10 to-indigo-500/5',
    course_data: data.course_data,
    is_published: true,
    remote: true,
  });
  return data.course_id;
}

export function removeDownloadedCourse(courseId) {
  const existing = listCustomCourses({ course_id: courseId });
  for (const rec of existing) deleteCustomCourse(rec.id);
}

export function downloadedCourseIds() {
  return new Set(listCustomCourses().map((rec) => rec.course_id));
}

// ---- Admin: publish & manage (writes are enforced server-side by RLS) ----

export async function adminListCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select('id, course_id, title, category, level, is_published, modules_count, topics_count, created_at')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function adminPublishCourse(record) {
  const { error } = await supabase.from('courses').insert(record);
  if (error) throw error;
}

export async function adminDeleteCourse(id) {
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) throw error;
}

export async function courseIdExists(courseId) {
  const { data, error } = await supabase
    .from('courses')
    .select('course_id')
    .eq('course_id', courseId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}
