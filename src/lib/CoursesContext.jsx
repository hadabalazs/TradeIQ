import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { COURSES, syncCustomCourses, applyQuestionOverrides } from '@/lib/courses';
import { fetchOverrides } from '@/lib/questionOverrides';
import { generateFinalAssessment } from '@/lib/courseUtils';
import { listCustomCourses } from '@/lib/localStore';
import { fetchCatalog, cachedCatalog, downloadCourse, removeDownloadedCourse, downloadedCourseIds } from '@/lib/remoteCourses';

const CoursesContext = createContext(null);

function entityToCourse(entity) {
  const data = entity.course_data || {};
  return {
    id: entity.course_id,
    title: entity.title,
    subtitle: entity.subtitle || '',
    description: entity.description || '',
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
  }, [loadDownloaded]);

  // Re-read overrides after an admin changes one, so the correction is live
  // without a reload.
  const refreshOverrides = useCallback(async () => {
    const rows = await fetchOverrides();
    if (!rows) return;
    applyQuestionOverrides(rows);
    forceRender((n) => n + 1);
  }, []);

  const download = useCallback(async (courseId) => {
    await downloadCourse(courseId);
    loadDownloaded();
  }, [loadDownloaded]);

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
      removeDownload,
      refreshOverrides,
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
