import { useState, useEffect, useCallback } from 'react';
import { Trash2, BookOpen, Loader2, AlertTriangle } from 'lucide-react';
import { adminListCourses, adminDeleteCourse } from '@/lib/remoteCourses';
import { useToast } from '@/components/ui/use-toast';
import { useCourses } from '@/lib/CoursesContext';

export default function CourseManager() {
  const [customCourses, setCustomCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const { toast } = useToast();
  const { reloadCourses } = useCourses();

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const list = await adminListCourses();
      setCustomCourses(list);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Failed to load courses',
        description: err.message || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleDelete = async (course) => {
    setDeleting(course.id);
    try {
      await adminDeleteCourse(course.id);
      await reloadCourses();
      setCustomCourses((prev) => prev.filter((c) => c.id !== course.id));
      toast({
        title: 'Course deleted',
        description: `"${course.title}" has been removed.`,
      });
      setConfirmId(null);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Failed to delete course',
        description: err.message || 'An error occurred',
      });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="mb-6 rounded-xl bg-white border border-tiq-border p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
          <Trash2 className="w-4 h-4 text-red-500" />
        </div>
        <h2 className="font-slab text-lg text-tiq-ink font-semibold">Manage Courses</h2>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        Manage published courses. Deleting removes a course from the catalog for all users.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 text-tiq-mint animate-spin" />
        </div>
      ) : customCourses.length === 0 ? (
        <div className="py-8 text-center">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No custom courses uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {customCourses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between gap-3 p-3 rounded-lg border border-tiq-border bg-tiq-mintLight/20"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-tiq-ink truncate">{course.title}</p>
                <p className="text-xs text-slate-500 truncate">
                  {course.category || 'General'} · {course.source === 'ai_generated' ? 'AI Generated' : 'Structured Upload'} · {course.course_data?.dilemmas?.length || 0} dilemmas
                </p>
              </div>

              {confirmId === course.id ? (
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Delete?</span>
                  </div>
                  <button
                    onClick={() => setConfirmId(null)}
                    disabled={deleting === course.id}
                    className="px-3 py-1.5 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight text-xs font-medium disabled:opacity-40"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(course)}
                    disabled={deleting === course.id}
                    className="px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 text-xs font-semibold disabled:opacity-40"
                  >
                    {deleting === course.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Delete'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(course.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}