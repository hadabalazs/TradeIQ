import React, { useState, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import Header from "@/components/tradeiq/Header";
import Sidebar from "@/components/tradeiq/Sidebar";
import GlossaryPanel from "@/components/tradeiq/GlossaryPanel";
import { useProgress } from "@/lib/ProgressContext";
import { getCourse } from "@/lib/courses";
import { useCourses } from "@/lib/CoursesContext";

export default function AppShell() {
  const { progress, loading } = useProgress();
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const { ensureCourse, resolvingCourse } = useCourses();

  // Determine the active course from the URL
  const courseMatch = location.pathname.match(/\/course\/([^/]+)/);
  const courseId = courseMatch ? courseMatch[1] : null;
  const course = courseId ? getCourse(courseId) : null;

  // Every course screen hangs off this layout, so resolving the course here
  // fixes all of them at once — dashboard, lesson, module quiz, final exam and
  // practice — rather than each page repeating the same fetch.
  useEffect(() => {
    if (courseId && !course) ensureCourse(courseId);
  }, [courseId, course, ensureCourse]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-tiq-navy flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-tiq-mintLight border-t-tiq-mint rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-tiq-navy overflow-hidden">
      <Header
        course={course}
        onOpenGlossary={() => setGlossaryOpen((v) => !v)}
        glossaryOpen={glossaryOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - desktop */}
        <div className="hidden lg:block w-64 bg-white border-r border-tiq-border shrink-0 overflow-hidden">
          <Sidebar course={course} />
        </div>
        {/* Sidebar - mobile drawer */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="w-64 bg-white border-r border-tiq-border shrink-0">
              <Sidebar course={course} />
            </div>
            <div className="flex-1 bg-black/20" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto tiq-scroll bg-tiq-navy">
          <div className="p-5 sm:p-8">
            {courseId && !course && resolvingCourse ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-4 border-tiq-mintLight border-t-tiq-mint rounded-full animate-spin" />
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>

        <GlossaryPanel open={glossaryOpen} onClose={() => setGlossaryOpen(false)} course={course} />
      </div>
    </div>
  );
}