import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DocumentEditor from './pages/DocumentEditor';
import Documents from './pages/Documents';
import UserProfile from './pages/UserProfile';
import UserPermissionsPanel from './pages/UserPermissionsPanel';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { MultipleTabsProvider } from './components/MultipleTabsProvider';
import { DocumentsMultipleTabsProvider } from './components/DocumentsMultipleTabsProvider';
import Support from './pages/Support';
import Pricing from './pages/Pricing';
import { usePing } from './hooks/usePing';
import './App.css';

function App() {
  // Iniciar o ping automático a cada 40 segundos devido ao render
  usePing(40000);

  return (
    <AuthProvider>
      <MultipleTabsProvider>
        <Router>
          <div className="min-h-screen bg-dark-custom text-white font-inter">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/documents" 
                element={
                  <ProtectedRoute>
                    <DocumentsMultipleTabsProvider>
                      <Documents />
                    </DocumentsMultipleTabsProvider>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/permissions" 
                element={
                  <ProtectedRoute>
                    <UserPermissionsPanel />
                  </ProtectedRoute>
                } 
              />
            <Route 
              path="/editor/:documentId" 
              element={
                <ProtectedRoute>
                  <DocumentsMultipleTabsProvider>
                    <DocumentEditor />
                  </DocumentsMultipleTabsProvider>
                </ProtectedRoute>
              } 
            />
              <Route path="/support" element={<Support />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster 
              position="top-left"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1a1a2e',
                  color: '#fff',
                  border: '1px solid #374151',
                  marginTop: '80px',
                },
              }}
            />
          </div>
        </Router>
      </MultipleTabsProvider>
    </AuthProvider>
  );
}

export default App;