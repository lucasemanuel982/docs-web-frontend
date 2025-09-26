import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { User, Edit, Shield, Trash2, Plus, X } from 'lucide-react';
import ResponsiveHeader from '../components/ResponsiveHeader';
import UserPermissionsSelector from '../components/UserPermissionsSelector';

interface Document {
  _id: string;
  title: string;
  content: string;
  ownerId: string;
  collaborators: string[];
  readPermissions: string[];
  editPermissions: string[];
  createdAt: string;
  updatedAt: string;
  ownerName?: string; // Nome do proprietário (será adicionado pelo servidor)
  ownerProfileImage?: string; // Imagem do proprietário (será adicionada pelo servidor)
}

// Modal de confirmação reutilizável
const ConfirmModal = ({ isOpen, onConfirm, onCancel, title, message }: { isOpen: boolean, onConfirm: () => void, onCancel: () => void, title: string, message: string }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card-custom border border-custom rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        <p className="text-custom-muted text-base mb-8">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn btn-secondary flex items-center gap-2">
            <X size={16} />
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn btn-primary bg-red-600 hover:bg-red-700 border-none flex items-center gap-2">
            <Trash2 size={16} />
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
};

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newDocumentTitle, setNewDocumentTitle] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showPermissionsSelector, setShowPermissionsSelector] = useState(false);
  const [selectedDocumentForPermissions, setSelectedDocumentForPermissions] = useState<Document | null>(null);
  const [readPermissions, setReadPermissions] = useState<string[]>([]);
  const [editPermissions, setEditPermissions] = useState<string[]>([]);

  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  // Carregar documentos via REST
  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      console.log('Fazendo requisição para /api/documents com token:', token ? 'presente' : 'ausente');
      
      const response = await fetch('/api/documents', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Resposta recebida:', response.status, response.statusText);
      
      // Verificar se a resposta é JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Resposta não é JSON:', text.substring(0, 200));
        throw new Error('Servidor retornou resposta inválida. Verifique se o servidor está rodando corretamente.');
      }
      
      const data = await response.json();
      console.log('Dados recebidos:', data);
      
      if (response.ok) {
        setDocuments(data.documents || []);
      } else {
        throw new Error(data.message || 'Erro ao carregar documentos');
      }
    } catch (error: any) {
      console.error('Erro ao carregar documentos:', error);
      toast.error(error.message || 'Erro ao carregar documentos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [token]);

  const handleDeleteDocument = async (docId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/documents/${docId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Verificar se a resposta é JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Resposta não é JSON:', text.substring(0, 200));
        throw new Error('Servidor retornou resposta inválida.');
      }
      
      const data = await response.json();
      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc._id !== docId));
        toast.success(data.message || 'Documento deletado com sucesso!');
      } else {
        throw new Error(data.message || 'Erro ao deletar documento');
      }
    } catch (error: any) {
      console.error('Erro ao deletar documento:', error);
      toast.error(error.message || 'Erro ao deletar documento');
    } finally {
      setIsLoading(false);
      setConfirmDeleteId(null);
    }
  };

  const handleOpenPermissions = (document: Document) => {
    setSelectedDocumentForPermissions(document);
    setReadPermissions(document.readPermissions || []);
    setEditPermissions(document.editPermissions || []);
    setShowPermissionsSelector(true);
  };

  const handlePermissionsChange = async (newReadPermissions: string[], newEditPermissions: string[]) => {
    if (selectedDocumentForPermissions) {
      try {
        const response = await fetch(`/api/documents/${selectedDocumentForPermissions._id}/permissions`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            readPermissions: newReadPermissions,
            editPermissions: newEditPermissions
          })
        });
        
        // Verificar se a resposta é JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Resposta não é JSON:', text.substring(0, 200));
          throw new Error('Servidor retornou resposta inválida.');
        }
        
        const data = await response.json();
        if (response.ok) {
          toast.success(data.message || 'Permissões atualizadas com sucesso!');
          setDocuments(prev => prev.map(doc =>
            doc._id === selectedDocumentForPermissions._id
              ? { ...doc, readPermissions: newReadPermissions, editPermissions: newEditPermissions }
              : doc
          ));
        } else {
          throw new Error(data.message || 'Erro ao atualizar permissões');
        }
      } catch (error: any) {
        console.error('Erro ao atualizar permissões:', error);
        toast.error(error.message || 'Erro ao atualizar permissões');
      }
    }
  };

  const handleCreateDocumentWithPermissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocumentTitle.trim()) {
      toast.error('Por favor, insira um título para o documento');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newDocumentTitle,
          readPermissions,
          editPermissions
        })
      });
      
      // Verificar se a resposta é JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Resposta não é JSON:', text.substring(0, 200));
        throw new Error('Servidor retornou resposta inválida.');
      }
      
      const data = await response.json();
      if (response.ok) {
        setNewDocumentTitle('');
        setShowCreateForm(false);
        toast.success('Documento criado com sucesso!');
        // Recarrega a lista para garantir que os dados estejam todos corretos
        fetchDocuments();
      } else {
        throw new Error(data.message || 'Erro ao criar documento');
      }
    } catch (error: any) {
      console.error('Erro ao criar documento:', error);
      toast.error(error.message || 'Erro ao criar documento');
    } finally {
      setIsLoading(false);
    }
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

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-dark-custom text-white font-inter">
      {/* Modal de confirmação de deleção */}
      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onConfirm={() => confirmDeleteId && handleDeleteDocument(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
        title="Confirmar ação"
        message="Tem certeza que deseja deletar este documento? Esta ação não pode ser desfeita."
      />
      <ResponsiveHeader onLogout={handleLogout} pageTitle="Documentos da Empresa" />

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Documentos da Empresa</h1>
          {user?.tipoUsuario === 'admin' || user?.tipoUsuario === 'principal' && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary w-full sm:w-auto flex items-center gap-2"
            >
              <Plus size={18} />
              Novo Documento
            </button>
          )}
        </div>

        {/* Formulário de criação */}
        {showCreateForm && (
          <div className="bg-card-custom border border-custom rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Criar Novo Documento</h3>
            <form onSubmit={handleCreateDocumentWithPermissions} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Título do Documento
                </label>
                <input
                  type="text"
                  id="title"
                  value={newDocumentTitle}
                  onChange={(e) => setNewDocumentTitle(e.target.value)}
                  className="form-input-custom w-full px-3 py-2 rounded-md"
                  placeholder="Digite o título do documento"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn btn-primary flex items-center gap-2">
                  <Plus size={16} />
                  Criar Documento
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <X size={16} />
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de documentos */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-custom-muted">Carregando documentos...</div>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-custom-muted mb-4">Nenhum documento encontrado na empresa</div>
            {user?.tipoUsuario === 'admin' || user?.tipoUsuario === 'principal' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                Criar primeiro documento
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <div key={doc._id} className="bg-card-custom border border-custom rounded-lg p-6 hover:border-primary transition-colors document-card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{doc.title}</h3>
                    <div className="text-custom-muted text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <span>Proprietário:</span>
                        {doc.ownerProfileImage ? (
                          <img
                            src={doc.ownerProfileImage}
                            alt={`${doc.ownerName}`}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-custom rounded-full flex items-center justify-center">
                            <User size={12} className="text-custom-muted" />
                          </div>
                        )}
                        <span>{doc.ownerName}</span>
                      </div>
                      <div>Criado em: {formatDate(doc.createdAt)}</div>
                      {doc.updatedAt !== doc.createdAt && (
                        <div>Atualizado em: {formatDate(doc.updatedAt)}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link
                      to={`/editor/${doc._id}`}
                      className="btn btn-primary flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Editar
                    </Link>
                    {doc.ownerId === user?.id && (user?.tipoUsuario === "principal" || user?.tipoUsuario === "admin") && (
                      <button
                        onClick={() => handleOpenPermissions(doc)}
                        className="btn btn-secondary flex items-center gap-2"
                      >
                        <Shield size={16} />
                        Permissões
                      </button>
                    )}
                    {user?.tipoUsuario === "principal" && (
                      <button
                        onClick={() => {
                          setConfirmDeleteId(doc._id);
                        }}
                        className="btn btn-secondary flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Deletar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Permissões */}
        {showPermissionsSelector && selectedDocumentForPermissions && (
          <UserPermissionsSelector
            readPermissions={readPermissions}
            editPermissions={editPermissions}
            onPermissionsChange={handlePermissionsChange}
            onClose={() => {
              setShowPermissionsSelector(false);
              setSelectedDocumentForPermissions(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default Documents;