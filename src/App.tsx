
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSupabaseAuth } from './hooks/useSupabaseAuth';
import { Toaster } from './components/ui/toaster';
import LoginForm from './components/LoginForm';
import Index from './pages/Index';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Billing from './pages/Billing';
import Bills from './pages/Bills';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';
import PWAInstallPrompt from './components/PWAInstallPrompt';

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
      <>
        <LoginForm />
        <Toaster />
      </>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
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
        <PWAInstallPrompt />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
