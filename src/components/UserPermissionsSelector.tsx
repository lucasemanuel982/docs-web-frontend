import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Check, X, AlertTriangle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserPermissionsSelectorProps {
  readPermissions: string[];
  editPermissions: string[];
  onPermissionsChange: (readPermissions: string[], editPermissions: string[]) => void;
  onClose: () => void;
}

const UserPermissionsSelector: React.FC<UserPermissionsSelectorProps> = ({
  readPermissions,
  editPermissions,
  onPermissionsChange,
  onClose
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localReadPermissions, setLocalReadPermissions] = useState<string[]>(readPermissions);
  const [localEditPermissions, setLocalEditPermissions] = useState<string[]>(editPermissions);
  const [error, setError] = useState<string | null>(null);

  // const { emit, on, off } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    // Buscar usuários da empresa via REST
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/users/empresa', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        if (!res.ok) throw new Error('Erro ao buscar usuários');
        const data = await res.json();
        // Normaliza o id para string e usa _id do MongoDB
        const usuarios = (data.usuarios || []).map((u: any) => ({
          id: String(u._id || u.id),
          name: u.name,
          email: u.email
        }));
        setUsers(usuarios);
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar usuários');
        toast.error(err.message || 'Erro ao carregar usuários');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleReadPermissionChange = (userId: string, checked: boolean) => {
    if (checked) {
      // Adicionar à leitura
      if (!localReadPermissions.includes(userId)) {
        setLocalReadPermissions(prev => [...prev, userId]);
      }
    } else {
      // Remover da leitura
      setLocalReadPermissions(prev => prev.filter(id => id !== userId));
      // Se estiver em edição, mostrar alerta
      if (localEditPermissions.includes(userId)) {
        setError('Usuário com permissão de edição deve ter também permissão de leitura');
        return;
      }
    }
    setError(null);
  };

  const handleEditPermissionChange = (userId: string, checked: boolean) => {
    if (checked) {
      // Adicionar à edição (automaticamente adiciona à leitura também)
      if (!localEditPermissions.includes(userId)) {
        setLocalEditPermissions(prev => [...prev, userId]);
      }
      if (!localReadPermissions.includes(userId)) {
        setLocalReadPermissions(prev => [...prev, userId]);
      }
    } else {
      // Remover da edição
      setLocalEditPermissions(prev => prev.filter(id => id !== userId));
    }
    setError(null);
  };

  const handleSave = () => {
    // Verificar se há usuários em edição que não estão em leitura
    const usuariosEmEdicaoSemLeitura = localEditPermissions.filter(
      userId => !localReadPermissions.includes(userId)
    );

    if (usuariosEmEdicaoSemLeitura.length > 0) {
      setError('Usuários com permissão de edição devem ter também permissão de leitura');
      return;
    }

    onPermissionsChange(localReadPermissions, localEditPermissions);
    onClose();
  };

  const handleCancel = () => {
    // Restaurar valores originais
    setLocalReadPermissions(readPermissions);
    setLocalEditPermissions(editPermissions);
    setError(null);
    onClose();
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-card-custom border border-custom rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="text-center">
            <div className="text-custom-muted">Carregando usuários...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card-custom border border-custom rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Gerenciar Permissões de Usuários</h3>
          <button
            onClick={handleCancel}
            className="text-custom-muted hover:text-white transition-colors"
            title="Fechar"
            aria-label="Fechar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-medium text-custom-muted mb-4">
            <div>Usuário</div>
            <div className="text-center">Modo Leitura</div>
            <div className="text-center">Modo Edição</div>
          </div>

          {users.map((userItem) => (
            <div key={userItem.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-3 bg-dark-custom rounded-lg">
              <div>
                <div className="font-medium">{userItem.name}</div>
                <div className="text-sm text-custom-muted">{userItem.email}</div>
                {userItem.id === user?.id && (
                  <div className="text-xs text-primary mt-1">(Você)</div>
                )}
              </div>

              <div className="flex justify-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localReadPermissions.includes(userItem.id)}
                    onChange={(e) => handleReadPermissionChange(userItem.id, e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${localReadPermissions.includes(userItem.id)
                      ? 'bg-primary border-primary'
                      : 'border-custom-muted hover:border-white'
                    }`}>
                    {localReadPermissions.includes(userItem.id) && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </div>
                </label>
              </div>

              <div className="flex justify-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localEditPermissions.includes(userItem.id)}
                    onChange={(e) => handleEditPermissionChange(userItem.id, e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${localEditPermissions.includes(userItem.id)
                      ? 'bg-primary border-primary'
                      : 'border-custom-muted hover:border-white'
                    }`}>
                    {localEditPermissions.includes(userItem.id) && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </div>
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-custom">
          <button
            onClick={handleSave}
            className="btn btn-primary flex-1"
          >
            Salvar Permissões
          </button>
          <button
            onClick={handleCancel}
            className="btn btn-secondary flex-1"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPermissionsSelector; 