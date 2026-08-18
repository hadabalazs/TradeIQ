import { Toaster } from "@/components/ui/toaster"
import ErrorBoundary from '@/components/ErrorBoundary';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import { ProgressProvider } from '@/lib/ProgressContext';
import { CoursesProvider } from '@/lib/CoursesContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import AppShell from '@/components/tradeiq/AppShell';
import CourseCatalog from '@/pages/CourseCatalog';
import Dashboard from '@/pages/Dashboard';
import Learn from '@/pages/Learn';
import FinalExam from '@/pages/FinalExam';
import Practice from '@/pages/Practice';
import Daily from '@/pages/Daily';
import ModuleQuiz from '@/pages/ModuleQuiz';
import ModuleOverview from '@/pages/ModuleOverview';
import Achievements from '@/pages/Achievements';
import KnowledgeCheck from '@/pages/KnowledgeCheck';
import Admin from '@/pages/Admin';
import AdminCourseEditor from '@/pages/AdminCourseEditor';
import Verify from '@/pages/Verify';
import Login from '@/pages/Login';

function App() {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <ThemeProvider>
          <ProgressProvider>
          <CoursesProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/verify/:certId" element={<Verify />} />

              {/* App routes — accessible to guests and authenticated users */}
              <Route element={<AppShell />}>
                <Route path="/" element={<CourseCatalog />} />
                <Route path="/course/:courseId" element={<Dashboard />} />
                <Route path="/course/:courseId/learn/:topicId" element={<Learn />} />
                <Route path="/course/:courseId/final" element={<FinalExam />} />
                <Route path="/course/:courseId/practice" element={<Practice />} />
                <Route path="/course/:courseId/module/:moduleId" element={<ModuleOverview />} />
                <Route path="/course/:courseId/quiz/:moduleId" element={<ModuleQuiz />} />
                <Route path="/daily" element={<Daily />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/knowledge-check" element={<KnowledgeCheck />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/editor" element={<AdminCourseEditor />} />
                <Route path="/admin/course/:courseId" element={<AdminCourseEditor />} />
              </Route>

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </CoursesProvider>
          </ProgressProvider>
          </ThemeProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
    </ErrorBoundary>
  )
}

export default App