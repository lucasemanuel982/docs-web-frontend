import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ResponsiveHeader from '../components/ResponsiveHeader';
import Modal from '../components/Modal';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalContent, setModalContent] = React.useState<string>('');

  return (
    <div className="min-h-screen bg-dark-custom text-white font-inter">
      <ResponsiveHeader />

      {/* Espaço para o header fixo */}
      <div className="h-16 md:h-16" />

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto px-4 md:px-10 py-8 md:py-12">
        {/* Hero Section */}
        <div className="hero-section mb-12">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-6 leading-tight">Crie documentos incríveis com Docs Web</h1>
            <p className="text-xl text-custom-muted mb-8">Docs Web é um editor de texto online poderoso e intuitivo, perfeito para
              escrever, editar e colaborar em documentos de qualquer lugar.</p>
          </div>
          {isAuthenticated ? (
            <Link to="/documents" className="btn btn-primary btn-lg">Meus Documentos</Link>
          ) : (
            <Link to="/register" className="btn btn-primary btn-lg">Comece a escrever</Link>
          )}
        </div>

        {/* Seção de Recursos */}
        <section className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Recursos que impulsionam sua produtividade</h2>
            <p className="text-xl text-custom-muted">Docs Web oferece uma variedade de recursos para tornar sua experiência de escrita
              mais eficiente e agradável.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Card de Recurso 1 */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                  viewBox="0 0 256 256">
                  <path
                    d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z">
                  </path>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-3">Edição colaborativa em tempo real</h3>
              <p className="text-custom-muted text-sm">Colabore com colegas em tempo real, veja as alterações
                instantaneamente e trabalhe em conjunto de forma eficiente.</p>
            </div>

            {/* Card de Recurso 2 */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                  viewBox="0 0 256 256">
                  <path
                    d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z">
                  </path>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-3">Controle de versões e histórico de alterações</h3>
              <p className="text-custom-muted text-sm">Acompanhe todas as modificações, compare versões e restaure
                documentos anteriores com facilidade.</p>
            </div>

            {/* Card de Recurso 3 */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                  viewBox="0 0 256 256">
                  <path
                    d="M160,40A88.09,88.09,0,0,0,81.29,88.67,64,64,0,1,0,72,216h88a88,88,0,0,0,0-176Zm0,160H72a48,48,0,0,1,0-96c1.1,0,2.2,0,3.29.11A88,88,0,0,0,72,128a8,8,0,0,0,16,0,72,72,0,1,1,72,72Z">
                  </path>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-3">Armazenamento seguro na nuvem</h3>
              <p className="text-custom-muted text-sm">Seus documentos são armazenados com segurança na nuvem,
                acessíveis de qualquer dispositivo.</p>
            </div>

            {/* Card de Recurso 4 */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                  viewBox="0 0 256 256">
                  <path
                    d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z">
                  </path>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-3">Compartilhamento e permissões avançadas</h3>
              <p className="text-custom-muted text-sm">Controle quem pode visualizar, comentar ou editar seus
                documentos com permissões detalhadas.</p>
            </div>
          </div>
        </section>

        {/* Seção CTA */}
        <section className="text-center py-12">
          <h2 className="text-4xl font-bold mb-6">Comece a usar Docs Web hoje mesmo</h2>
          <p className="text-xl text-custom-muted mb-8">Crie sua conta gratuita e descubra como Docs Web pode transformar sua forma de
            escrever.</p>
          {isAuthenticated ? (
            <Link to="/documents" className="btn btn-primary btn-lg">Meus Documentos</Link>
          ) : (
            <Link to="/register" className="btn btn-primary btn-lg">Experimente grátis</Link>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-custom bg-dark-custom">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <a href="#" className="footer-link" onClick={e => { e.preventDefault(); setModalContent('Esta funcionalidade ainda não está disponível.'); setModalOpen(true); }}>Sobre nós</a>
            <a href="/support" className="footer-link">Contato</a>
            <a href="#" className="footer-link" onClick={e => { e.preventDefault(); setModalContent('Esta funcionalidade ainda não está disponível.'); setModalOpen(true); }}>Termos de serviço</a>
            <a href="#" className="footer-link" onClick={e => { e.preventDefault(); setModalContent('Esta funcionalidade ainda não está disponível.'); setModalOpen(true); }}>Política de privacidade</a>
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
          <p className="text-center text-custom-muted m-0">© 2025 Docs Web. Todos os direitos reservados.</p>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <div className="text-black flex flex-col items-center">
              <div className="mb-4">
                <svg width="48" height="48" fill="#6366f1" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8Zm-1-13h2v6h-2Zm0 8h2v2h-2Z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-indigo-600">Informação</h2>
              <p className="mb-6 text-gray-700 text-base">{modalContent}</p>
              <button
                className="btn btn-primary px-6 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setModalOpen(false)}
              >Fechar</button>
            </div>
          </Modal>
        </div>
      </footer>
    </div>
  );
};

export default Home; 