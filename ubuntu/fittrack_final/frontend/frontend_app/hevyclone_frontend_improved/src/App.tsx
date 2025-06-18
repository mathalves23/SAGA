import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProfileProvider } from './context/ProfileContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/ui/LoadingSpinner';
import MainLayout from './components/layout/MainLayout';

// Lazy load pages for better performance
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const FeedPage = React.lazy(() => import('./pages/feed/FeedPage'));
const WorkoutsPage = React.lazy(() => import('./pages/workouts/WorkoutsPage'));
const ExercisesPage = React.lazy(() => import('./pages/exercises/ExercisesPage'));
const ExerciseDetailPage = React.lazy(() => import('./pages/exercises/ExerciseDetailPage'));
const ProgressPage = React.lazy(() => import('./pages/progress/ProgressPage'));
const RoutinesPage = React.lazy(() => import('./pages/routines/RoutinesPage'));
const ProfilePage = React.lazy(() => import('./pages/profile/ProfilePage'));

// New pages from sidebar
const GoalsPage = React.lazy(() => import('./pages/goals/GoalsPage'));
const SocialPage = React.lazy(() => import('./pages/social/SocialPage'));
const AchievementsPage = React.lazy(() => import('./pages/achievements/AchievementsPage'));
const FavoritesPage = React.lazy(() => import('./pages/favorites/FavoritesPage'));
const SettingsPage = React.lazy(() => import('./pages/settings/SettingsPage'));

// AI and Analytics pages
const AnalyticsPage = React.lazy(() => import('./pages/analytics/AnalyticsPage'));
const AnalyticsDashboard = React.lazy(() => import('./pages/analytics/AnalyticsDashboard'));
const CoachPage = React.lazy(() => import('./pages/coach/CoachPage'));
const AIPage = React.lazy(() => import('./pages/ai/AIPage'));
const AICoachPage = React.lazy(() => import('./pages/ai/AICoachPage'));
const RewardsPage = React.lazy(() => import('./pages/rewards/RewardsPage'));
const GamificationPage = React.lazy(() => import('./pages/gamification/GamificationPage'));
const NutritionPage = React.lazy(() => import('./pages/nutrition/NutritionPage'));
const NotificationsPage = React.lazy(() => import('./pages/notifications/NotificationsPage'));

// Loading component
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center h-screen">
    <LoadingSpinner />
    <span className="ml-2">Carregando...</span>
  </div>
);

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <PageLoader />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route component (for auth pages when user is logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <PageLoader />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/feed" replace />;
  }
  
  return <>{children}</>;
};

// App Routes Component - Now inside Router context
const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />
        
        {/* Protected Routes with MainLayout */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          } 
        >
          {/* Nested routes inside MainLayout */}
          <Route path="feed" element={<FeedPage />} />
          <Route path="workouts" element={<WorkoutsPage />} />
          <Route path="exercises" element={<ExercisesPage />} />
          <Route path="exercises/:id" element={<ExerciseDetailPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="routines" element={<RoutinesPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="social" element={<SocialPage />} />
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="analytics/dashboard" element={<AnalyticsDashboard />} />
          <Route path="coach" element={<CoachPage />} />
          <Route path="ai" element={<AIPage />} />
          <Route path="ai/coach" element={<AICoachPage />} />
          <Route path="rewards" element={<RewardsPage />} />
          <Route path="gamification" element={<GamificationPage />} />
          <Route path="nutrition" element={<NutritionPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route index element={<Navigate to="/feed" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

// Main App Component with correct provider order
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <ProfileProvider>
              <AppRoutes />
            </ProfileProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App; 