import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Shield, FileText, Settings, LogOut, Home, ArrowLeft } from 'lucide-react';

interface MobileMenuProps {
  onLogout?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  pageTitle?: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  onLogout, 
  onBack, 
  showBackButton = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  
  // Verificar se está na página atual para ocultar botões
  const isOnDocumentsPage = location.pathname === '/documents';
  const isOnLoginPage = location.pathname === '/login';
  const isOnRegisterPage = location.pathname === '/register';
  const isOnPermissionsPage = location.pathname === '/permissions';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Header Mobile */}
      <nav className="border-b border-custom bg-dark-custom px-4 py-3 md:hidden">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="logo-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold m-0">Docs Web</h2>
          </div>
          
          <div className="flex items-center gap-2">
            {showBackButton && onBack && (
              <button onClick={onBack} className="btn btn-secondary text-sm px-3 py-1 flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </button>
            )}
            <button
              onClick={toggleMenu}
              className="p-2 text-white hover:bg-custom rounded-md transition-colors"
              aria-label="Abrir menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Mobile Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="fixed top-0 right-0 h-full w-64 bg-dark-custom border-l border-custom shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Menu</h3>
                                 <button
                   onClick={closeMenu}
                   className="p-2 text-white hover:bg-custom rounded-md transition-colors"
                   aria-label="Fechar menu"
                 >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      {user?.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={`${user.name}`}
                          className="w-10 h-10 rounded-full object-cover border border-custom"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-custom rounded-full flex items-center justify-center">
                          <User size={20} className="text-custom-muted" />
                        </div>
                      )}
                      <div className="text-custom-muted text-sm">
                        Olá, {user?.name}!
                      </div>
                    </div>
                    
                    {!isOnDocumentsPage && (
                      <Link
                        to="/documents"
                        onClick={closeMenu}
                        className="w-full text-left p-3 text-white hover:bg-custom rounded-md transition-colors flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Meus Documentos
                      </Link>
                    )}
                    
                    {user?.tipoUsuario === 'principal' && !isOnPermissionsPage && (
                      <Link
                        to="/permissions"
                        onClick={closeMenu}
                        className="w-full text-left p-3 text-white hover:bg-custom rounded-md transition-colors flex items-center gap-2"
                      >
                        <Shield className="h-4 w-4" />
                        Permissões
                      </Link>
                    )}
                    
                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      className="w-full text-left p-3 text-white hover:bg-custom rounded-md transition-colors flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Perfil
                    </Link>
                    
                    {onLogout && (
                      <button
                        onClick={() => {
                          onLogout();
                          closeMenu();
                        }}
                        className="w-full text-left p-3 text-white hover:bg-custom rounded-md transition-colors flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Sair
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      to="/"
                      onClick={closeMenu}
                      className="w-full text-left p-3 text-white hover:bg-custom rounded-md transition-colors flex items-center gap-2"
                    >
                      <Home className="h-4 w-4" />
                      Início
                    </Link>
                    
                    {!isOnLoginPage && (
                      <Link
                        to="/login"
                        onClick={closeMenu}
                        className="w-full text-left p-3 text-white hover:bg-custom rounded-md transition-colors"
                      >
                        Entrar
                      </Link>
                    )}
                    
                    {!isOnRegisterPage && (
                      <Link
                        to="/register"
                        onClick={closeMenu}
                        className="w-full text-left p-3 text-white hover:bg-custom rounded-md transition-colors"
                      >
                        Cadastrar
                      </Link>
                    )}
                    <Link
                      to="/pricing"
                      onClick={closeMenu}
                      className="w-full text-left p-3 text-white hover:bg-custom rounded-md transition-colors flex items-center gap-2"
                    >
                      Preços
                    </Link>
                    <Link
                      to="/support"
                      onClick={closeMenu}
                      className="w-full text-left p-3 text-white hover:bg-custom rounded-md transition-colors flex items-center gap-2"
                    >
                      Suporte
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu; 