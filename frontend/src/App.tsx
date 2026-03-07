import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import AdminLayout from './components/layout/AdminLayout';

import AdminDashboard from './pages/admin/Dashboard';
import AnamnesisPage from './pages/admin/Anamnesis';
import SchoolsPage from './pages/admin/Schools';
import StaffPage from './pages/admin/Staff';
import StudentsPage from './pages/admin/Students';
import ActivitiesPage from './pages/admin/Activities';
import ReportsPage from './pages/admin/Reports';
import SettingsPage from './pages/admin/Settings';
import TutorHistoryPage from './pages/admin/TutorHistory';
import CheckinsPage from './pages/admin/Checkins';
import BnccPage from './pages/admin/Bncc';
import AnamnesisSpheresPage from './pages/admin/AnamnesisSpheres';
import AnamnesisQuestionsPage from './pages/admin/AnamnesisQuestions';
import KinshipPage from './pages/admin/Kinship';
import ClassesPage from './pages/admin/Classes';
import SubjectsPage from './pages/admin/Subjects';
import ChaptersPage from './pages/admin/Chapters';

const SchoolDashboard = () => <div>School Dashboard</div>;
const TutorDashboard = () => <div>Tutor Dashboard</div>;

const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles?: string[] }) => {
  const { user, token, isLoading } = useAuth();

  if (isLoading) return <div className="flex justify-center p-12">Loading...</div>;
  if (!token || !user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;

  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        user ? (
          <Navigate to={`/${user.role}/dashboard`} />
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/anamnesis" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AnamnesisPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/schools" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><SchoolsPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/staff" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><StaffPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><StudentsPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/activities" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><ActivitiesPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><ReportsPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><SettingsPage /></AdminLayout></ProtectedRoute>} />

      {/* Novas rotas de conformidade de escopo */}
      <Route path="/admin/tutor-history" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><TutorHistoryPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/checkins" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><CheckinsPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/classes" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><ClassesPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/subjects" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><SubjectsPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/chapters" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><ChaptersPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/bncc" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><BnccPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/anamnesis-spheres" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AnamnesisSpheresPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/anamnesis-questions" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AnamnesisQuestionsPage /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/kinship" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><KinshipPage /></AdminLayout></ProtectedRoute>} />

      <Route path="/school/dashboard" element={<ProtectedRoute allowedRoles={['school']}><SchoolDashboard /></ProtectedRoute>} />
      <Route path="/tutor/dashboard" element={<ProtectedRoute allowedRoles={['tutor']}><TutorDashboard /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
