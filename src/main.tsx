
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SupabaseAuthProvider } from './hooks/useSupabaseAuth'

createRoot(document.getElementById("root")!).render(
  <SupabaseAuthProvider>
    <App />
  </SupabaseAuthProvider>
);
