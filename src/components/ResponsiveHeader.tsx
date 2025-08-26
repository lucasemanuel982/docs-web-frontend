import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MobileMenu from './MobileMenu';
import { User, Shield, FileText, Settings, LogOut} from 'lucide-react';

interface ResponsiveHeaderProps {
  onLogout?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  pageTitle?: string;
}

const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({
  onLogout,
  onBack,
  showBackButton = false,
  pageTitle
}) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  
  // Verificar se está na página atual para ocultar botões
  const isOnDocumentsPage = location.pathname === '/documents';
  const isOnLoginPage = location.pathname === '/login';
  const isOnRegisterPage = location.pathname === '/register';
  const isOnPermissionsPage = location.pathname === '/permissions';

  return (
    <>
      {/* Header Desktop */}
      <nav className="border-b border-custom bg-dark-custom px-10 py-3 hidden md:block">
        
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="logo-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold m-0">Docs Web</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={`${user.name}`}
                      className="w-8 h-8 rounded-full object-cover border border-custom"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-custom rounded-full flex items-center justify-center">
                      <User size={16} className="text-custom-muted" />
                    </div>
                  )}
                  <span className="text-custom-muted">Olá, {user?.name}!</span>
                </div>
                {!isOnDocumentsPage && (
                  <Link to="/documents" className="btn btn-secondary flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Meus Documentos
                  </Link>
                )}
                {user?.tipoUsuario === 'principal' && !isOnPermissionsPage && (
                  <Link to="/permissions" className="btn btn-secondary flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Permissões
                  </Link>
                )}
                <Link to="/profile" className="btn btn-secondary flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Perfil
                </Link>
                {onLogout && (
                  <button onClick={onLogout} className="btn btn-secondary flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="flex gap-4">
                  <a href="/" className="nav-link flex items-center gap-1">
                    Início
                  </a>
                  <Link to="/pricing" className="nav-link flex items-center gap-1">
                    Preços
                  </Link>
                  <Link to="/support" className="nav-link flex items-center gap-1">
                    Suporte
                  </Link>
                </div>
                <div className="flex gap-2">
                  {!isOnLoginPage && (
                    <Link to="/login" className="btn btn-primary">Entrar</Link>
                  )}
                  {!isOnRegisterPage && (
                    <Link to="/register" className="btn btn-secondary">Experimente grátis</Link>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Header Mobile */}
      <MobileMenu
        onLogout={onLogout}
        onBack={onBack}
        showBackButton={showBackButton}
        pageTitle={pageTitle}
      />
    </>
  );
};

export default ResponsiveHeader; 