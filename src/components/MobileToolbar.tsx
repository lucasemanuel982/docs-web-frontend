import React, { useState } from 'react';
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify, FaEraser, FaEllipsisH } from 'react-icons/fa';

interface MobileToolbarProps {
  onFormat: (command: string, value?: string) => void;
  onClearFormatting: () => void;
  onClearAll: () => void;
  canEdit: boolean;
}

const MobileToolbar: React.FC<MobileToolbarProps> = ({
  onFormat,
  onClearFormatting,
  onClearAll,
  canEdit
}) => {
  const [showMoreTools, setShowMoreTools] = useState(false);

  const basicTools = [
    { icon: <FaBold />, command: 'bold', title: 'Negrito' },
    { icon: <FaItalic />, command: 'italic', title: 'Itálico' },
    { icon: <FaUnderline />, command: 'underline', title: 'Sublinhado' },
    { icon: <FaStrikethrough />, command: 'strikeThrough', title: 'Tachado' },
  ];

  const alignmentTools = [
    { icon: <FaAlignLeft />, command: 'justifyLeft', title: 'Alinhar à esquerda' },
    { icon: <FaAlignCenter />, command: 'justifyCenter', title: 'Centralizar' },
    { icon: <FaAlignRight />, command: 'justifyRight', title: 'Alinhar à direita' },
    { icon: <FaAlignJustify />, command: 'justifyFull', title: 'Justificar' },
  ];

  const handleFormat = (command: string, value?: string) => {
    onFormat(command, value);
  };

  return (
    <div className="md:hidden">
      {/* Toolbar básica sempre visível */}
      <div className={`flex gap-1 mb-2 bg-dark-custom p-2 rounded border border-custom items-center overflow-x-auto ${!canEdit ? 'opacity-50 pointer-events-none' : ''
        }`}>
        {basicTools.map((tool) => (
          <button
            key={tool.command}
            type="button"
            title={tool.title}
            onClick={() => canEdit && handleFormat(tool.command)}
            className="p-2 rounded hover:bg-custom-muted flex items-center justify-center min-w-[2.5rem]"
            disabled={!canEdit}
          >
            {tool.icon}
          </button>
        ))}

        <div className="w-px h-6 bg-custom mx-1"></div>

        <button
          type="button"
          onClick={() => canEdit && setShowMoreTools(!showMoreTools)}
          className="p-2 rounded hover:bg-custom-muted flex items-center justify-center min-w-[2.5rem]"
          title="Mais ferramentas"
          disabled={!canEdit}
        >
          <FaEllipsisH />
        </button>
      </div>

      {/* Toolbar expandida */}
      {showMoreTools && (
        <div className="mb-2 bg-dark-custom p-2 rounded border border-custom">
          {/* Ferramentas de alinhamento */}
          <div className="mb-3">
            <div className="text-xs text-custom-muted mb-2">Alinhamento</div>
            <div className="flex gap-1">
              {alignmentTools.map((tool) => (
                <button
                  key={tool.command}
                  type="button"
                  title={tool.title}
                  onClick={() => canEdit && handleFormat(tool.command)}
                  className="p-2 rounded hover:bg-custom-muted flex items-center justify-center min-w-[2.5rem]"
                  disabled={!canEdit}
                >
                  {tool.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Tamanho da fonte */}
          <div className="mb-3">
            <div className="text-xs text-custom-muted mb-2">Tamanho</div>
            <select
              title="Tamanho da fonte"
              className="w-full px-2 py-1 rounded bg-dark-custom border border-custom text-white text-sm"
              onChange={e => canEdit && handleFormat('fontSize', e.target.value)}
              defaultValue=""
              disabled={!canEdit}
            >
              <option value="" disabled>Tamanho</option>
              <option value="1">Pequeno</option>
              <option value="3">Normal</option>
              <option value="5">Grande</option>
              <option value="7">Enorme</option>
            </select>
          </div>

          {/* Fonte */}
          <div className="mb-3">
            <div className="text-xs text-custom-muted mb-2">Fonte</div>
            <select
              title="Fonte"
              className="w-full px-2 py-1 rounded bg-dark-custom border border-custom text-white text-sm"
              onChange={e => canEdit && handleFormat('fontName', e.target.value)}
              defaultValue=""
              disabled={!canEdit}
            >
              <option value="" disabled>Fonte</option>
              <option value="Inter">Inter</option>
              <option value="Arial">Arial</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Verdana">Verdana</option>
              <option value="Georgia">Georgia</option>
              <option value="Tahoma">Tahoma</option>
              <option value="Trebuchet MS">Trebuchet MS</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
            </select>
          </div>

          {/* Cor do texto */}
          <div className="mb-3">
            <div className="text-xs text-custom-muted mb-2">Cor do texto</div>
            <input
              type="color"
              title="Cor do texto"
              className="w-full h-8 rounded border border-custom"
              onChange={e => canEdit && handleFormat('foreColor', e.target.value)}
              disabled={!canEdit}
            />
          </div>

          {/* Ferramentas de limpeza */}
          <div className="mb-3">
            <div className="text-xs text-custom-muted mb-2">Limpeza</div>
            <div className="flex gap-1">
              <button
                type="button"
                title="Limpar formatação"
                onClick={() => canEdit && onClearFormatting()}
                className="p-2 rounded hover:bg-custom-muted flex items-center justify-center min-w-[2.5rem]"
                disabled={!canEdit}
              >
                <FaEraser />
              </button>
              <button
                type="button"
                title="Limpar tudo"
                onClick={() => canEdit && onClearAll()}
                className="p-2 rounded hover:bg-custom-muted flex items-center justify-center text-sm"
                disabled={!canEdit}
              >
                🗑️ Limpar tudo
              </button>
            </div>
          </div>




        </div>
      )}
    </div>
  );
};

export default MobileToolbar; 