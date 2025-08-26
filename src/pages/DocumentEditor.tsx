import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { Document } from '../types';
import toast from 'react-hot-toast';
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify, FaEraser, FaFont, FaCircle } from 'react-icons/fa';
import { User } from 'lucide-react';
import ResponsiveHeader from '../components/ResponsiveHeader';
import MobileToolbar from '../components/MobileToolbar';

const DocumentEditor: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [usersTyping, setUsersTyping] = useState<string[]>([]);

  const [documentContent, setDocumentContent] = useState('');
  const [usersOnline, setUsersOnline] = useState<{ nome: string; id: string; profileImage?: string }[]>([]);
  const [canEdit, setCanEdit] = useState(false);

  // Estado para modal de documento deletado
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [deletedMessage, setDeletedMessage] = useState('');

  const { user, logout } = useAuth();
  const { emit, on, off, connect, disconnect, isConnected } = useSocket();
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Redireciona automaticamente após 3 segundos se o modal estiver aberto
  useEffect(() => {
    if (showDeletedModal) {
      const timer = setTimeout(() => {
        setShowDeletedModal(false);
        navigate('/documents');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showDeletedModal, navigate]);

  useEffect(() => {
    if (!documentId) {
      toast.error('ID do documento não fornecido');
      navigate('/documents');
      return;
    }

    // Função para selecionar documento após garantir conexão
    const selecionarDocumento = () => {
      emit('selecionar_documento', {
        documentoId: documentId,
        nomeUsuario: user?.name || 'Usuário'
      }, (doc: { title: string, content: string, createdAt: string, updatedAt: string, canEdit: boolean } | null) => {
        if (doc) {
          setDocument({
            _id: documentId,
            title: doc.title,
            content: doc.content,
            ownerId: '',
            collaborators: [],
            readPermissions: [],
            editPermissions: [],
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
          });
          setDocumentContent(doc.content || '');
          setCanEdit(doc.canEdit);
        }
        setIsLoading(false);
      });
    };

    if (!isConnected) {
      connect(() => {
        selecionarDocumento();
      });
    } else {
      selecionarDocumento();
    }

    // Escutar eventos
    on('texto_editor_clientes', (texto: string) => {
      setDocumentContent(texto);
    });

    on('usuario_digitando', (dados: { nomeUsuario: string; usuariosDigitando: string[] }) => {
      setUsersTyping(dados.usuariosDigitando);
    });

    on('usuario_parou_digitacao', (dados: { nomeUsuario: string; usuariosDigitando: string[] }) => {
      setUsersTyping(dados.usuariosDigitando);
    });

    on('aviso_redirecionamento', (dados: { mensagem: string }) => {
      toast.error(dados.mensagem);
      logout();
      navigate('/login');
    });

    on('sessao_duplicada', () => {
      toast.error('Sessão duplicada detectada. Você foi desconectado.');
      logout();
      navigate('/login');
    });

    on('erro_servidor', (error: any) => {
      toast.error(error.message || 'Erro interno do servidor');
      setIsLoading(false);
    });

    on('usuarios_online', (usuarios: { nome: string; id: string; profileImage?: string }[]) => {
      setUsersOnline(usuarios);
    });

    on('documento_excluido', (documentoId: string) => {
      console.log('[SOCKET] Recebido evento documento_excluido:', documentoId);
      setDeletedMessage('Este documento foi excluído por outro usuário. Você será redirecionado para a página de documentos.');
      setShowDeletedModal(true);
    });

    on('documento_deletado', (documentoId: string) => {
      console.log('[SOCKET] Recebido evento documento_deletado:', documentoId);
      setDeletedMessage('Este documento foi deletado por outro usuário. Você será redirecionado para a página de documentos.');
      setShowDeletedModal(true);
    });

    // Cleanup: remover listeners, mas só desconectar ao desmontar
    return () => {
      off('texto_editor_clientes');
      off('usuario_digitando');
      off('usuario_parou_digitacao');
      off('aviso_redirecionamento');
      off('sessao_duplicada');
      off('erro_servidor');
      off('usuarios_online');
      off('documento_excluido');
      off('documento_deletado');
      // Não desconectar aqui!
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId, user?.name, emit, on, off, logout, navigate, connect, isConnected]);

  // Desconectar socket apenas ao desmontar o componente (sair do editor)
  useEffect(() => {
    return () => {
      if (typeof disconnect === 'function') disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (textareaRef.current && documentContent) {
      textareaRef.current.innerHTML = documentContent;
      // Garante fonte padrão ao carregar
      textareaRef.current.style.fontFamily = 'Inter, Arial, sans-serif';
    }
  }, [documentContent, textareaRef.current]);

  const handleSave = async () => {
    try {
      setIsSaving(true);


      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Documento salvo com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      toast.error('Erro ao salvar documento');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/documents');
  };

  const handleClearFormatting = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      // @ts-ignore: execCommand é legado mas ainda funciona para este caso
      window.document.execCommand('removeFormat', false);
    }
    toast('Formatação removida!', {
      icon: '✨',
      duration: 2000,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleClearAll = () => {
    if (textareaRef.current) {
      textareaRef.current.innerHTML = '';
    }
    if (documentId) {
      emit('texto_editor', { texto: '', documentoId: documentId });
    }
    toast('Documento limpo!', {
      icon: '🧹',
      duration: 2000,
    });
  };

  const handleFormat = (command: string, value?: string) => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      // @ts-ignore: execCommand é legado mas ainda funciona para este caso
      window.document.execCommand(command, false, value);
    }
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-custom text-white font-inter flex items-center justify-center">
        <div className="text-custom-muted">Carregando documento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-custom text-white font-inter">
      {/* Modal de documento deletado */}
      {showDeletedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-dark-custom rounded-lg p-6 shadow-lg text-center max-w-sm mx-auto border border-red-500">
            <h2 className="text-xl font-bold text-red-400 mb-2">Documento deletado</h2>
            <p className="mb-4 text-custom-muted">{deletedMessage}</p>
            <button
              className="btn btn-primary w-full"
              onClick={() => {
                setShowDeletedModal(false);
                navigate('/documents');
              }}
            >OK</button>
          </div>
        </div>
      )}
      <ResponsiveHeader
        onBack={handleBack}
        pageTitle={document?.title || 'Editor de Documento'}
        onLogout={() => {
          logout();
          navigate('/login');
        }}
      />

      {/* Conteúdo principal com título, toolbar, e editor+sidebar lado a lado */}
      <div className="px-4 md:px-10 pt-6">
        {/* Título do documento */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">
            {document?.title || 'Documento sem título'}
          </h1>
          <div className="flex gap-3 items-center">
            {!canEdit && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2 text-yellow-400 text-sm">
                Modo somente leitura
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-primary disabled:opacity-50 w-full sm:w-auto"
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>

        {/* Mobile Toolbar */}
        <MobileToolbar
          onFormat={handleFormat}
          onClearFormatting={handleClearFormatting}
          onClearAll={handleClearAll}
          canEdit={canEdit}
        />

        {/* Barra de ferramentas de formatação - Desktop */}
        <div className={`hidden md:flex gap-2 mb-4 bg-dark-custom p-2 rounded border border-custom items-center editor-toolbar ${!canEdit ? 'opacity-50 pointer-events-none' : ''
          }`}>
          <button type="button" title="Negrito" onClick={() => canEdit && window.document.execCommand('bold')}
            className="px-2 py-1 rounded hover:bg-custom-muted flex items-center justify-center">
            <FaBold />
          </button>
          <button type="button" title="Itálico" onClick={() => canEdit && window.document.execCommand('italic')}
            className="px-2 py-1 rounded hover:bg-custom-muted flex items-center justify-center">
            <FaItalic />
          </button>
          <button type="button" title="Sublinhado" onClick={() => canEdit && window.document.execCommand('underline')}
            className="px-2 py-1 rounded hover:bg-custom-muted flex items-center justify-center">
            <FaUnderline />
          </button>
          <button type="button" title="Tachado" onClick={() => canEdit && window.document.execCommand('strikeThrough')}
            className="px-2 py-1 rounded hover:bg-custom-muted flex items-center justify-center">
            <FaStrikethrough />
          </button>
          <select title="Tamanho da fonte" className="px-2 py-1 rounded bg-dark-custom border border-custom text-white" onChange={e => canEdit && window.document.execCommand('fontSize', false, e.target.value)} defaultValue="" disabled={!canEdit}>
            <option value="" disabled>Tamanho</option>
            <option value="1">Pequeno</option>
            <option value="3">Normal</option>
            <option value="5">Grande</option>
            <option value="7">Enorme</option>
          </select>
          <button type="button" title="Alinhar à esquerda" onClick={() => canEdit && window.document.execCommand('justifyLeft')}
            className="px-2 py-1 rounded hover:bg-custom-muted flex items-center justify-center">
            <FaAlignLeft />
          </button>
          <button type="button" title="Centralizar" onClick={() => canEdit && window.document.execCommand('justifyCenter')}
            className="px-2 py-1 rounded hover:bg-custom-muted flex items-center justify-center">
            <FaAlignCenter />
          </button>
          <button type="button" title="Alinhar à direita" onClick={() => canEdit && window.document.execCommand('justifyRight')}
            className="px-2 py-1 rounded hover:bg-custom-muted flex items-center justify-center">
            <FaAlignRight />
          </button>
          <button type="button" title="Justificar" onClick={() => canEdit && window.document.execCommand('justifyFull')}
            className="px-2 py-1 rounded hover:bg-custom-muted flex items-center justify-center">
            <FaAlignJustify />
          </button>
          <input type="color" title="Cor do texto" className="ml-2" onChange={e => canEdit && window.document.execCommand('foreColor', false, e.target.value)} disabled={!canEdit} />
          <button type="button" title="Limpar formatação" onClick={() => canEdit && handleClearFormatting()}
            className="px-2 py-1 rounded hover:bg-custom-muted ml-2 flex items-center justify-center">
            <FaEraser />
          </button>
          <button type="button" title="Limpar tudo" onClick={() => canEdit && handleClearAll()}
            className="px-2 py-1 rounded hover:bg-custom-muted ml-2 flex items-center justify-center">
            🗑️ Limpar tudo
          </button>
          {/* Seletor de fonte */}
          <div className="flex items-center ml-2">
            <FaFont />
            <select
              title="Fonte"
              className="px-2 py-1 rounded bg-dark-custom border border-custom text-white"
              onChange={e => canEdit && window.document.execCommand('fontName', false, e.target.value)}
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

        </div>

        {/* Editor e sidebar lado a lado */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar de usuários online */}
          <aside className="w-full lg:w-64 bg-dark-custom border border-custom rounded-lg p-4 h-fit self-start order-2 lg:order-1">
            <h3 className="text-lg font-bold mb-2">Usuários Online</h3>
            <div className="space-y-2">
              {usersOnline.map((u) => (
                <div key={u.id} className="flex items-center justify-between py-1 px-2 rounded hover:bg-custom-muted transition-colors">
                  <div className="flex items-center gap-2">
                    <FaCircle size={8} color="#10B981" />
                    {u.profileImage ? (
                      <img
                        src={u.profileImage}
                        alt={`${u.nome}`}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-custom rounded-full flex items-center justify-center">
                        <User size={12} className="text-custom-muted" />
                      </div>
                    )}
                    <span className="font-medium">{u.nome}</span>
                  </div>
                  {usersTyping.includes(u.nome) && (
                    <span className="text-xs text-primary-color typing-indicator flex items-center gap-1">
                      <span>digitando</span>
                      <span className="typing-dots"></span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </aside>
          {/* Editor de texto rico */}
          <div className="flex-1 flex flex-col order-1 lg:order-2 editor-container">
            <div
              ref={textareaRef as any}
              contentEditable={canEdit}
              suppressContentEditableWarning
              onInput={e => {
                if (!canEdit) {
                  toast.error('Você não tem permissão para editar este documento');
                  return;
                }

                const html = (e.target as HTMLDivElement).innerHTML;
                // Emitir mudança de texto imediatamente para sincronização em tempo real
                if (documentId) {
                  emit('texto_editor', { texto: html, documentoId: documentId });
                }
                // Indicar que está digitando
                if (documentId && user?.name) {
                  emit('comecar_digitacao', { documentoId: documentId, nomeUsuario: user.name });
                  if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                  }
                  typingTimeoutRef.current = setTimeout(() => {
                    if (documentId && user?.name) {
                      emit('parar_digitacao', { documentoId: documentId, nomeUsuario: user.name });
                    }
                  }, 2000);
                }
              }}
              className={`w-full bg-transparent text-white border border-indigo-500 rounded outline-none font-inter text-base leading-relaxed p-2 document-editor-textarea ${!canEdit ? 'cursor-not-allowed opacity-75' : ''
                }`}
            >
            </div>
            {/* Informações do documento */}
            <div className="mt-3 text-custom-muted text-sm">
              {document && (
                <>
                  <p>Criado em: {formatDate(document.createdAt)}</p>
                  <p>Última atualização: {formatDate(document.updatedAt)}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;