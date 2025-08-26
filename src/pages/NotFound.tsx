import React from 'react';
import { Link } from 'react-router-dom';
import ResponsiveHeader from '../components/ResponsiveHeader';
import { useAuth } from '../contexts/AuthContext';

const NotFound: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-dark-custom text-white font-inter">
      <ResponsiveHeader />

      {/* Conteúdo Principal */}
      <main className="max-w-4xl mx-auto px-4 md:px-10 py-12 md:py-16">
        <div className="text-center">
          {/* Ícone de Erro */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-card-custom border border-custom rounded-full mb-6">
              <svg
                className="w-16 h-16 text-custom-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33M15 19l3 3m0 0l3-3m-3 3l-3-3"
                />
              </svg>
            </div>
          </div>

          {/* Título e Mensagem */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-custom-muted">404</h1>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Página não encontrada</h2>
            <p className="text-xl text-custom-muted mb-8 max-w-2xl mx-auto">
              Ops! Parece que você se perdeu. A página que você está procurando não existe ou foi movida para outro lugar.
            </p>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/" className="btn btn-primary btn-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Voltar ao Início
            </Link>
            {isAuthenticated ? (
              <Link to="/documents" className="btn btn-secondary btn-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Meus Documentos
              </Link>
            ) : (
              <Link to="/register" className="btn btn-secondary btn-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Criar Conta
              </Link>
            )}
          </div>

          {/* Links Úteis */}
          <div className="bg-card-custom border border-custom rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Páginas úteis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/" className="flex items-center gap-2 text-custom-muted hover:text-primary-color transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Página Inicial
              </Link>
              {!isAuthenticated && (
                <>
                  <Link to="/login" className="flex items-center gap-2 text-custom-muted hover:text-primary-color transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Fazer Login
                  </Link>
                  <Link to="/register" className="flex items-center gap-2 text-custom-muted hover:text-primary-color transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Criar Conta
                  </Link>
                </>
              )}
              {isAuthenticated && (
                <Link to="/documents" className="flex items-center gap-2 text-custom-muted hover:text-primary-color transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Meus Documentos
                </Link>
              )}
              <a href="#" className="flex items-center gap-2 text-custom-muted hover:text-primary-color transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Suporte
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-custom bg-dark-custom mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <a href="#" className="footer-link">Sobre nós</a>
            <a href="#" className="footer-link">Contato</a>
            <a href="#" className="footer-link">Termos de serviço</a>
            <a href="#" className="footer-link">Política de privacidade</a>
          </div>
          <div className="flex justify-center gap-6 mb-8">
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/lucasemanuell/" target="_blank" rel="noopener noreferrer" className="footer-link" title="LinkedIn">
              <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
                <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM88,184H56V112H88Zm-16-80a16,16,0,1,1,16-16A16,16,0,0,1,72,104Zm128,80H168V144c0-8.84-7.16-16-16-16s-16,7.16-16,16v40H104V112h32v16.13A32,32,0,0,1,184,144Z" />
              </svg>
            </a>
            {/* GitHub */}
            <a href="https://github.com/lucasemanuel982" target="_blank" rel="noopener noreferrer" className="footer-link" title="GitHub">
              <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
                <path d="M128,24A104,104,0,0,0,24,128c0,45.42,29.47,84.06,70.31,97.73,5.14.95,7-2.23,7-5V208.13c-28.63,6.23-34.7-13.81-34.7-13.81-4.68-11.89-11.43-15.06-11.43-15.06-9.35-6.39.71-6.26.71-6.26,10.34.73,15.78,10.62,15.78,10.62,9.19,15.76,24.1,11.22,30,8.58.93-6.65,3.6-11.22,6.55-13.8-22.86-2.6-46.91-11.43-46.91-50.89,0-11.25,4-20.45,10.62-27.65-1.07-2.61-4.6-13.13,1-27.37,0,0,8.59-2.75,28.15,10.56a97.52,97.52,0,0,1,51.24,0c19.56-13.31,28.13-10.56,28.13-10.56,5.62,14.24,2.09,24.76,1,27.37,6.62,7.2,10.61,16.4,10.61,27.65,0,39.59-24.08,48.26-47,50.81,3.7,3.19,7,9.48,7,19.12v28.39c0,2.81,1.85,6,7,5C202.54,212.06,232,173.42,232,128A104,104,0,0,0,128,24Z" />
              </svg>
            </a>
          </div>
          <p className="text-center text-custom-muted m-0">© 2024 Docs Web. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default NotFound; 