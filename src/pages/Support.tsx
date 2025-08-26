import { useState } from 'react';
import Modal from '../components/Modal';
import ResponsiveHeader from '../components/ResponsiveHeader';

const supportLinks = [
  {
    name: 'Telegram',
    url: 'https://t.me/',
    icon: 'telegram',
    label: 'Ajuda via Telegram',
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/',
    icon: 'whatsapp',
    label: 'Ajuda via WhatsApp',
  },
  {
    name: 'E-mail',
    url: 'mailto:suporte@seudominio.com',
    icon: 'email',
    label: 'Ajuda via E-mail',
  },
];

export default function Support() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleUnavailable = (msg: string) => {
    setModalMessage(msg);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <>
      <ResponsiveHeader />
      <div className="max-w-xl mx-auto mt-10 p-6 bg-dark-custom rounded-lg shadow-lg text-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Ajuda</h1>
        <p className="mb-8 text-center text-custom-muted">
          Precisa de ajuda? Entre em contato pelos canais abaixo:
        </p>
        <div className="flex flex-col gap-6">
          {supportLinks.map((link) => (
            <a
              key={link.name}
              href="#"
              onClick={e => { e.preventDefault(); handleUnavailable('Esta funcionalidade ainda não está disponível.'); }}
              className="flex items-center gap-4 p-4 bg-custom hover:bg-custom-muted rounded-lg transition-colors shadow cursor-pointer"
            >
              {link.icon === 'telegram' && (
                <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9.99 15.19l-.39 3.47c.56 0 .8-.24 1.09-.53l2.62-2.49 5.44 3.97c1 .55 1.72.26 1.97-.92l3.58-16.77c.33-1.53-.55-2.13-1.52-1.8L2.2 9.13c-1.48.57-1.46 1.38-.25 1.75l4.37 1.37 10.16-6.41c.48-.3.92-.13.56.19l-8.2 7.13z"/></svg>
              )}
              {link.icon === 'whatsapp' && (
                <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.028-.967-.271-.099-.468-.149-.666.15-.197.297-.767.967-.94 1.166-.173.199-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.298.298-.497.099-.198.05-.373-.025-.522-.075-.149-.666-1.611-.912-2.207-.242-.579-.487-.5-.666-.51-.173-.008-.373-.01-.572-.01-.198 0-.52.075-.792.373-.271.298-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.075.149.198 2.099 3.205 5.077 4.487.711.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.075-.124-.271-.198-.568-.347z"/></svg>
              )}
              {link.icon === 'email' && (
                <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8l8 5 8-5v10z"/></svg>
              )}
              <span className="font-semibold text-lg">{link.label}</span>
            </a>
          ))}
        </div>
        <Modal open={modalOpen} onClose={closeModal}>
          <h2 className="text-xl font-bold mb-2 text-blue-700">Funcionalidade Indisponível</h2>
          <p className="text-gray-700 mb-4">{modalMessage}</p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-2xl transition text-lg"
            onClick={closeModal}
          >
            OK
          </button>
        </Modal>
      </div>
    </>
  );
}
