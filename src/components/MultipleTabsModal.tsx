import { AlertTriangle, X } from 'lucide-react';

interface MultipleTabsModalProps {
  isOpen: boolean;
  onKeep: () => void;
  onClose: () => void;
}

export function MultipleTabsModal({ isOpen, onKeep, onClose }: MultipleTabsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Múltiplas Abas Detectadas
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Fechar modal"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-3">
            Detectamos que você tem múltiplas abas abertas do editor de documentos.
          </p>
          <p className="text-gray-700 mb-3">
            Por questões de segurança e para evitar conflitos, você só pode usar uma aba por vez.
          </p>
          <p className="text-gray-700 font-medium">
            O que você gostaria de fazer?
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Se as outras abas não fecharem automaticamente, você pode fechá-las manualmente.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onKeep}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Manter Esta Aba
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Fechar Esta Aba
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center">
          Se escolher "Manter Esta Aba", as outras abas serão fechadas automaticamente.
        </p>
      </div>
    </div>
  );
} 