import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import TutorDashboard from './pages/tutor/Dashboard';
import ParentDashboard from './pages/parent/Dashboard';
import MyStudentsPage from './pages/tutor/MyStudents';
import FamilyReportsPage from './pages/parent/Reports';
import AppLayout from './components/layout/AppLayout';
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
import GuardiansPage from './pages/admin/Guardians';
import ImagesPage from './pages/admin/Images';
import StudentProfilePage from './pages/StudentProfile';

// School Pages
import SchoolDashboard from './pages/school/Dashboard';
import SchoolStudentsPage from './pages/school/Students';
import SchoolTutorsPage from './pages/school/Tutors';
import SchoolClassesPage from './pages/school/Classes';
import SchoolAnamnesisPage from './pages/school/Anamnesis';
import SchoolActivitiesPage from './pages/school/Activities';
import SchoolReportsPage from './pages/school/Reports';
import SchoolGuardiansPage from './pages/school/Guardians';
import SchoolSondagemPage from './pages/school/Sondagem';
import SondagemListPage from './pages/SondagemList';
import VideoAulasPage from './pages/VideoAulas';
import VideoPlayerPage from './pages/VideoPlayer';

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

      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><AdminDashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/anamnesis" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><AnamnesisPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/schools" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><SchoolsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/staff" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><StaffPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><StudentsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/sondagem" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><SondagemListPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/students/:studentId/sondagem" element={<ProtectedRoute allowedRoles={['admin']}><SchoolSondagemPage /></ProtectedRoute>} />
      <Route path="/admin/students/:id/profile" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><StudentProfilePage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/activities" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><ActivitiesPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><ReportsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/images" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><ImagesPage /></AppLayout></ProtectedRoute>} />

      {/* Novas rotas de conformidade de escopo */}
      <Route path="/admin/guardians" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><GuardiansPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/tutor-history" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><TutorHistoryPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/checkins" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><CheckinsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/classes" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><ClassesPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/subjects" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><SubjectsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/chapters" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><ChaptersPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/bncc" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><BnccPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/anamnesis-spheres" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><AnamnesisSpheresPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/anamnesis-questions" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><AnamnesisQuestionsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/kinship" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><KinshipPage /></AppLayout></ProtectedRoute>} />

      <Route path="/school/dashboard" element={<ProtectedRoute allowedRoles={['school']}><AppLayout><SchoolDashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/school/students" element={<ProtectedRoute allowedRoles={['school']}><AppLayout><SchoolStudentsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/school/students/:id/profile" element={<ProtectedRoute allowedRoles={['school']}><AppLayout><StudentProfilePage /></AppLayout></ProtectedRoute>} />
      <Route path="/school/students/:studentId/sondagem" element={<ProtectedRoute allowedRoles={['school']}><SchoolSondagemPage /></ProtectedRoute>} />
      <Route path="/school/tutors" element={<ProtectedRoute allowedRoles={['school']}><AppLayout><SchoolTutorsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/school/classes" element={<ProtectedRoute allowedRoles={['school']}><AppLayout><SchoolClassesPage /></AppLayout></ProtectedRoute>} />
      <Route path="/school/sondagem" element={<ProtectedRoute allowedRoles={['school']}><AppLayout><SondagemListPage /></AppLayout></ProtectedRoute>} />
      <Route path="/school/anamnesis" element={<ProtectedRoute allowedRoles={['school']}><AppLayout><SchoolAnamnesisPage /></AppLayout></ProtectedRoute>} />
      <Route path="/school/activities" element={<ProtectedRoute allowedRoles={['school']}><AppLayout><SchoolActivitiesPage /></AppLayout></ProtectedRoute>} />
      <Route path="/school/reports" element={<ProtectedRoute allowedRoles={['school']}><AppLayout><SchoolReportsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/school/guardians" element={<ProtectedRoute allowedRoles={['school']}><AppLayout><SchoolGuardiansPage /></AppLayout></ProtectedRoute>} />

      <Route path="/tutor/dashboard" element={<ProtectedRoute allowedRoles={['tutor']}><AppLayout><TutorDashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/tutor/students" element={<ProtectedRoute allowedRoles={['tutor']}><AppLayout><MyStudentsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/tutor/students/:id/profile" element={<ProtectedRoute allowedRoles={['tutor']}><AppLayout><StudentProfilePage /></AppLayout></ProtectedRoute>} />
      <Route path="/tutor/activities" element={<ProtectedRoute allowedRoles={['tutor']}><AppLayout><ActivitiesPage /></AppLayout></ProtectedRoute>} />
      <Route path="/tutor/reports" element={<ProtectedRoute allowedRoles={['tutor']}><AppLayout><ReportsPage /></AppLayout></ProtectedRoute>} />

      <Route path="/parent/dashboard" element={<ProtectedRoute allowedRoles={['parent']}><AppLayout><ParentDashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/parent/reports" element={<ProtectedRoute allowedRoles={['parent']}><AppLayout><FamilyReportsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/parent/activities" element={<ProtectedRoute allowedRoles={['parent']}><AppLayout><ActivitiesPage /></AppLayout></ProtectedRoute>} />

      {/* Video-Aulas — disponível para todos os perfis */}
      <Route path="/admin/video-aulas" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><VideoAulasPage /></AppLayout></ProtectedRoute>} />
      <Route path="/admin/video-aulas/:playlistId" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><VideoPlayerPage /></AppLayout></ProtectedRoute>} />
      <Route path="/school/video-aulas" element={<ProtectedRoute allowedRoles={['school']}><AppLayout><VideoAulasPage /></AppLayout></ProtectedRoute>} />
      <Route path="/school/video-aulas/:playlistId" element={<ProtectedRoute allowedRoles={['school']}><AppLayout><VideoPlayerPage /></AppLayout></ProtectedRoute>} />
      <Route path="/tutor/video-aulas" element={<ProtectedRoute allowedRoles={['tutor']}><AppLayout><VideoAulasPage /></AppLayout></ProtectedRoute>} />
      <Route path="/tutor/video-aulas/:playlistId" element={<ProtectedRoute allowedRoles={['tutor']}><AppLayout><VideoPlayerPage /></AppLayout></ProtectedRoute>} />

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
