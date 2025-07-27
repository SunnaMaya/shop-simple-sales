
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useSupabaseAuth } from './hooks/useSupabaseAuth';
import { Toaster } from './components/ui/toaster';
import LoginForm from './components/LoginForm';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load route components for code splitting
const Index = lazy(() => import('./pages/Index'));
const Products = lazy(() => import('./pages/Products'));
const Customers = lazy(() => import('./pages/Customers'));
const Billing = lazy(() => import('./pages/Billing'));
const Bills = lazy(() => import('./pages/Bills'));
const Expenses = lazy(() => import('./pages/Expenses'));
const Reports = lazy(() => import('./pages/Reports'));
const NotFound = lazy(() => import('./pages/NotFound'));
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  const { user, loading } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <LanguageProvider>
        <LoginForm />
        <Toaster />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/bills" element={<Bills />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Suspense>
            <PWAInstallPrompt />
            <Toaster />
          </div>
        </Router>
      </ErrorBoundary>
    </LanguageProvider>
  );
}

export default App;
