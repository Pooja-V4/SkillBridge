import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Navbar } from './components/layout/Navbar';

// Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { JobBrowsePage } from './pages/jobs/JobBrowsePage';
import { InternshipBrowsePage } from './pages/internships/InternshipBrowsePage';
import { ApplicationTrackerPage } from './pages/applications/ApplicationTrackerPage';
import { RecruiterApplicantsPage } from './pages/applications/RecruiterApplicantsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public & Exploratory Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/jobs" element={<JobBrowsePage />} />
              <Route path="/internships" element={<InternshipBrowsePage />} />

              {/* Student Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/applications" element={<ApplicationTrackerPage />} />
              </Route>

              {/* Recruiter Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['RECRUITER']} />}>
                <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
                <Route path="/recruiter/applicants" element={<RecruiterApplicantsPage />} />
              </Route>

              {/* Faculty Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['FACULTY']} />}>
                <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
