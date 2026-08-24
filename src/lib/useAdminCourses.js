import { useState, useEffect, useCallback } from "react";
import { useCourses } from "@/lib/CoursesContext";
import { adminListCourses } from "@/lib/remoteCourses";

// Every published course, for admin screens.
//
// The local registry only holds built-in courses plus the ones this device has
// downloaded, so an admin who had not personally downloaded a course could not
// see it — a course could be live for every learner and missing from the admin
// list on the machine of the person who published it.
//
// This merges the registry with the published rows in the database. Rows with no
// local copy come back as stubs: enough to list, search, filter and open, with
// `full: false` marking that the modules and questions have not been loaded.
// Opening one in the content editor resolves it, because AppShell fetches any
// course named in the URL.
export function useAdminCourses() {
  const { courses } = useCourses();
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await adminListCourses());
      setError(null);
    } catch (err) {
      // Offline, or not an admin. Fall back to whatever is local rather than
      // showing nothing.
      setRows([]);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const local = courses || [];
  const localIds = new Set(local.map((c) => c.id));
  const remoteIds = new Set((rows || []).map((r) => r.course_id));

  const stubs = (rows || [])
    .filter((r) => !localIds.has(r.course_id))
    .map((r) => ({
      id: r.course_id,
      title: r.title,
      subtitle: "",
      description: "",
      category: r.category || "General",
      level: r.level || "Intermediate",
      modules: [],
      // Counts come from the row so the list can still describe the course
      // without downloading it.
      modulesCount: r.modules_count ?? 0,
      topicsCount: r.topics_count ?? 0,
      isPublished: r.is_published,
      full: false,
    }));

  const all = [
    ...local.map((c) => ({
      ...c,
      modulesCount: (c.modules || []).length,
      topicsCount: (c.modules || []).reduce((s, m) => s + (m.topics || []).length, 0),
      isPublished: true,
      full: true,
    })),
    ...stubs,
  ];

  return {
    courses: all,
    // Which ids came from the database, so built-ins can be marked undeletable.
    remoteIds,
    loading,
    error,
    reload: load,
  };
}

export default useAdminCourses;
