import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { COURSES, syncCustomCourses, addViewedCourse, applyQuestionOverrides, applyCourseTextOverrides, applyContentTextOverrides } from '@/lib/courses';
import { fetchOverrides } from '@/lib/questionOverrides';
import { fetchCourseOverrides } from '@/lib/courseOverrides';
import { fetchContentOverrides } from '@/lib/contentOverrides';
import { generateFinalAssessment } from '@/lib/courseUtils';
import { listCustomCourses } from '@/lib/localStore';
import { fetchCatalog, cachedCatalog, downloadCourse, fetchCourseById, removeDownloadedCourse, downloadedCourseIds } from '@/lib/remoteCourses';

const CoursesContext = createContext(null);

function entityToCourse(entity) {
  const data = entity.course_data || {};
  return {
    id: entity.course_id,
    title: entity.title,
    subtitle: entity.subtitle || '',
    description: entity.description || '',
    // The intro lives in course_data rather than its own column, so it has to be
    // lifted out here. Without this an uploaded course's intro was dropped and
    // the course page fell back to the one-line catalog description.
    intro: data.intro || '',
    category: entity.category || 'General',
    level: entity.level || 'Intermediate',
    certificateText: entity.certificate_text || entity.title,
    icon: entity.icon || 'BookOpen',
    gradient: entity.gradient || 'from-blue-500/10 to-indigo-500/5',
    modules: data.modules || [],
    finalAssessment: (data.finalAssessment && data.finalAssessment.length > 0)
      ? data.finalAssessment
      : generateFinalAssessment(data),
    glossary: data.glossary || [],
    expertQuestions: data.expertQuestions ||
      (data.modules || []).flatMap(m => m.topics || []).flatMap(t => t.quiz || []).slice(0, 20),
    dilemmas: data.dilemmas || [],
    diagrams: data.diagrams || {},
    difficultyLevels: data.difficultyLevels || [
      { id: 'beginner', label: 'Beginner', moduleRange: [0, 2] },
      { id: 'intermediate', label: 'Intermediate', moduleRange: [0, 5] },
      { id: 'expert', label: 'Expert', moduleRange: null },
    ],
  };
}

export function CoursesProvider({ children }) {
  const [loaded, setLoaded] = useState(false);
  const [catalog, setCatalog] = useState(cachedCatalog());
  const [downloadedIds, setDownloadedIds] = useState(() => downloadedCourseIds());
  const [, forceRender] = useState(0);

  const loadDownloaded = useCallback(() => {
    try {
      const list = listCustomCourses({ is_published: true });
      syncCustomCourses(list.map(entityToCourse));
      setDownloadedIds(downloadedCourseIds());
      forceRender((n) => n + 1);
    } catch (err) {
      console.error('Failed to load downloaded courses:', err);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadDownloaded();
    // Refresh the remote catalog in the background (best effort — offline is fine)
    fetchCatalog().then(setCatalog).catch(() => {});
    // Admin question corrections. Read for everyone including guests — a
    // suppressed question must stay hidden regardless of who is looking. Failure
    // (offline, or the migration not yet run) leaves courses exactly as shipped.
    fetchOverrides()
      .then((rows) => {
        if (!rows) return;
        applyQuestionOverrides(rows);
        forceRender((n) => n + 1);
      })
      .catch(() => {});
    // Admin-edited course text. Same reasoning: read for everyone, since a
    // renamed course must read the same for guests as for signed-in users.
    fetchCourseOverrides()
      .then((rows) => {
        if (!rows) return;
        applyCourseTextOverrides(rows);
        forceRender((n) => n + 1);
      })
      .catch(() => {});
    fetchContentOverrides()
      .then((rows) => {
        if (!rows) return;
        applyContentTextOverrides(rows);
        forceRender((n) => n + 1);
      })
      .catch(() => {});
  }, [loadDownloaded]);

  // Re-read overrides after an admin changes one, so the correction is live
  // without a reload.
  const refreshOverrides = useCallback(async () => {
    const rows = await fetchOverrides();
    if (!rows) return;
    applyQuestionOverrides(rows);
    forceRender((n) => n + 1);
  }, []);

  // Re-read course text after an admin edit, so a rename is live without a reload.
  const refreshContent = useCallback(async () => {
    const rows = await fetchContentOverrides();
    if (!rows) return;
    applyContentTextOverrides(rows);
    forceRender((n) => n + 1);
  }, []);

  const refreshCourseText = useCallback(async () => {
    const rows = await fetchCourseOverrides();
    if (!rows) return;
    applyCourseTextOverrides(rows);
    forceRender((n) => n + 1);
  }, []);

  const download = useCallback(async (courseId) => {
    await downloadCourse(courseId);
    loadDownloaded();
  }, [loadDownloaded]);

  // Resolve a course that is not in the local registry by fetching it.
  //
  // Uploaded courses only entered the registry once downloaded, so any link to
  // one — exactly the links that get shared — rendered "Course not found" for
  // everyone who had not already downloaded it. Built-in courses are compiled
  // into the bundle and so never showed the problem, which is why it survived
  // this long.
  //
  // Returns true when the course is available afterwards. Each id is attempted
  // once: a genuinely missing course must not re-request on every render.
  const attempted = useRef(new Set());
  const [resolving, setResolving] = useState(false);

  const ensureCourse = useCallback(async (courseId) => {
    if (!courseId) return false;
    if (COURSES.some((c) => c.id === courseId)) return true;
    if (attempted.current.has(courseId)) return false;
    attempted.current.add(courseId);

    setResolving(true);
    try {
      const row = await fetchCourseById(courseId);
      if (!row) return false;
      addViewedCourse(entityToCourse(row));
      forceRender((n) => n + 1);
      return true;
    } catch {
      // Offline, or the row is not readable. The page falls back to not-found.
      return false;
    } finally {
      setResolving(false);
    }
  }, []);

  const removeDownload = useCallback((courseId) => {
    removeDownloadedCourse(courseId);
    loadDownloaded();
  }, [loadDownloaded]);

  const allCourses = [...COURSES];

  const getCourse = useCallback((courseId) => {
    return allCourses.find(c => c.id === courseId) || null;
  }, [allCourses]);

  // Remote catalog entries not yet downloaded and not shadowing a built-in id
  const builtinIds = new Set(allCourses.map((c) => c.id));
  const available = catalog.filter((c) => !downloadedIds.has(c.course_id) && !builtinIds.has(c.course_id));

  return (
    <CoursesContext.Provider value={{
      courses: allCourses,
      getCourse,
      loaded,
      reloadCourses: loadDownloaded,
      availableCourses: available,
      downloadedIds,
      downloadCourse: download,
      ensureCourse,
      resolvingCourse: resolving,
      removeDownload,
      refreshOverrides,
      refreshCourseText,
      refreshContent,
    }}>
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  const ctx = useContext(CoursesContext);
  if (!ctx) throw new Error('useCourses must be used within CoursesProvider');
  return ctx;
}
