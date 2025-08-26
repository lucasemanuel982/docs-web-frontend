import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import ResponsiveHeader from '../components/ResponsiveHeader';
import {
  Shield,
  Edit,
  Save,
  X,
  AlertTriangle,
  Check,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface UserWithPermissions extends User {
  permissions: {
    canCreateDocuments: boolean;
    canEditProfile: boolean;
    canReadDocuments: boolean;
    canEditDocuments: boolean;
    canChangeUsertipo: boolean;
  };
}

const UserPermissionsPanel: React.FC = () => {
  const [users, setUsers] = useState<UserWithPermissions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [localPermissions, setLocalPermissions] = useState<{ [key: string]: any }>({});
  const [localTipo, setLocalTipo] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);

  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se o usuário tem permissão para acessar esta página
    if (user?.tipoUsuario !== 'principal') {
      toast.error('Acesso negado. Apenas usuários principais podem acessar esta página.');
      navigate('/documents');
      return;
    }

    // Buscar usuários da empresa via REST
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          const usersWithPermissions: UserWithPermissions[] = data.users.map((user: any) => ({
            ...user,
            empresa: '',
            profileImage: undefined,
            tipoUsuario: user.tipoUsuario as 'user' | 'admin' | 'principal'
          }));
          setUsers(usersWithPermissions);
          // Inicializar estados locais
          const initialPermissions: { [key: string]: any } = {};
          const initialTipo: { [key: string]: string } = {};
          usersWithPermissions.forEach(userItem => {
            initialPermissions[userItem.id] = { ...userItem.permissions };
            initialTipo[userItem.id] = userItem.tipoUsuario;
          });
          setLocalPermissions(initialPermissions);
          setLocalTipo(initialTipo);
        } else {
          throw new Error(data.message || 'Erro ao carregar usuários');
        }
      } catch (error: any) {
        toast.error(error.message || 'Erro ao carregar usuários');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [user, navigate, token]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleEditUser = (userId: string) => {
    setEditingUser(userId);
    setError(null);
    // Ao entrar em modo edição, copia apenas os dados do usuário selecionado
    setLocalPermissions(prev => ({
      ...prev,
      [userId]: { ...users.find(u => u.id === userId)?.permissions }
    }));
    setLocalTipo(prev => ({
      ...prev,
      [userId]: users.find(u => u.id === userId)?.tipoUsuario || ''
    }));
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setError(null);

    // Restaurar valores originais
    const initialPermissions: { [key: string]: any } = {};
    const initialTipo: { [key: string]: string } = {};

    users.forEach(userItem => {
      initialPermissions[userItem.id] = { ...userItem.permissions };
      initialTipo[userItem.id] = userItem.tipoUsuario;
    });

    setLocalPermissions(initialPermissions);
    setLocalTipo(initialTipo);
  };

  const handlePermissionChange = (userId: string, permission: string, value: boolean) => {
    setLocalPermissions(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [permission]: value
      }
    }));
  };

  const handleTipoChange = (userId: string, tipoUsuario: string) => {
    setLocalTipo(prev => ({
      ...prev,
      [userId]: tipoUsuario
    }));
  };

  const handleSaveUser = async (userId: string) => {
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;

    // Validações
    if (userId === user?.id && localTipo[userId] !== 'principal') {
      setError('Você não pode alterar seu próprio tipo usuário de principal');
      return;
    }
    // Verificar se está tentando criar outro usuário principal
    const currentPrincipals = users.filter(u => u.tipoUsuario === 'principal').length;
    const newPrincipals = users.filter(u => {
      if (u.id === userId) {
        return localTipo[userId] === 'principal';
      }
      return u.tipoUsuario === 'principal';
    }).length;
    if (newPrincipals > currentPrincipals && currentPrincipals >= 1) {
      setError('Apenas um usuário pode ter o tipo usuário principal');
      return;
    }
    // Se for o próprio usuário principal, garantir que mantenha as permissões necessárias
    let updatedPermissions = localPermissions[userId];
    if (userId === user?.id) {
      updatedPermissions = {
        ...updatedPermissions,
        canChangeUserTipo: true
      };
    }
    // Atualizar permissões via REST
    try {
      const response = await fetch('/api/admin/update-user-permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          permissions: updatedPermissions,
          tipoUsuario: localTipo[userId]
        })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || 'Permissões atualizadas com sucesso!');
        setEditingUser(null);
        // Recarregar usuários
        setIsLoading(true);
        const usersResponse = await fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const usersData = await usersResponse.json();
        if (usersResponse.ok) {
          const usersWithPermissions: UserWithPermissions[] = usersData.users.map((user: any) => ({
            ...user,
            empresa: '',
            profileImage: undefined,
            tipoUsuario: user.tipoUsuario as 'user' | 'admin' | 'principal'
          }));
          setUsers(usersWithPermissions);
          // Atualizar estados locais
          const initialPermissions: { [key: string]: any } = {};
          const initialTipo: { [key: string]: string } = {};
          usersWithPermissions.forEach(userItem => {
            initialPermissions[userItem.id] = { ...userItem.permissions };
            initialTipo[userItem.id] = userItem.tipoUsuario;
          });
          setLocalPermissions(initialPermissions);
          setLocalTipo(initialTipo);
        }
      } else {
        throw new Error(data.message || 'Erro ao atualizar permissões');
      }
    } catch (error: any) {
      setError(error.message || 'Erro ao atualizar permissões');
    } finally {
      setIsLoading(false);
    }
  };

  const getTipoBadge = (tipoUsuario: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (tipoUsuario) {
      case 'principal':
        return `${baseClasses} bg-purple-500/20 text-purple-400 border border-purple-500/30`;
      case 'admin':
        return `${baseClasses} bg-blue-500/20 text-blue-400 border border-blue-500/30`;
      case 'user':
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
    }
  };

  if (user?.tipoUsuario !== 'principal') {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-custom text-white font-inter">
      <ResponsiveHeader onLogout={handleLogout} pageTitle="Painel de Permissões" />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Painel de Permissões
            </h1>
            <p className="text-custom-muted mt-2">
              Gerencie as permissões e Tipos dos usuários da empresa
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {editingUser === user?.id && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            <span className="text-blue-400">
              Você está editando suas próprias permissões. O tipo usuário "Principal" não pode ser alterado para manter a segurança do sistema.
            </span>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <div className="text-custom-muted">Carregando usuários...</div>
          </div>
        ) : (
          <div className="bg-card-custom border border-custom rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-custom border-b border-custom">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-custom-muted">
                      Usuário
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-custom-muted">
                      Tipo usuário
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-custom-muted">
                      Criar Documentos
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-custom-muted">
                      Editar Perfil
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-custom-muted">
                      Ler Documentos
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-custom-muted">
                      Editar Documentos
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-custom-muted">
                      Alterar Tipos
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-custom-muted">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-custom">
                  {users.map((userItem) => (
                    <tr key={userItem.id} className="hover:bg-dark-custom/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{userItem.name}</div>
                          <div className="text-sm text-custom-muted">{userItem.email}</div>
                          {userItem.id === user?.id && (
                            <div className="text-xs text-primary mt-1">(Você)</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editingUser === userItem.id ? (
                          <select
                            value={localTipo[userItem.id]}
                            onChange={(e) => handleTipoChange(userItem.id, e.target.value)}
                            className={`bg-dark-custom border border-custom rounded px-2 py-1 text-sm ${userItem.id === user?.id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            aria-label={`Alterar tipo usuário de ${userItem.name}`}
                            disabled={userItem.id === user?.id}
                          >
                            <option value="user">Usuário</option>
                            <option value="admin">Admin</option>
                            <option value="principal">Principal</option>
                          </select>
                        ) : (
                          <span className={getTipoBadge(userItem.tipoUsuario)}>
                            {userItem.tipoUsuario === 'principal' ? 'Principal' :
                              userItem.tipoUsuario === 'admin' ? 'Admin' : 'Usuário'}
                          </span>
                        )}
                      </td>
                      {['canCreateDocuments', 'canEditProfile', 'canReadDocuments', 'canEditDocuments', 'canChangeUserTipo'].map((permission) => (
                        <td key={permission} className="px-6 py-4 text-center">
                          {editingUser === userItem.id ? (
                            <label className="flex items-center justify-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={localPermissions[userItem.id]?.[permission] || false}
                                onChange={(e) => handlePermissionChange(userItem.id, permission, e.target.checked)}
                                className="sr-only"
                              />
                              <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${localPermissions[userItem.id]?.[permission]
                                ? 'bg-primary border-primary'
                                : 'border-custom-muted hover:border-white'
                                }`}>
                                {localPermissions[userItem.id]?.[permission] && (
                                  <Check className="h-4 w-4 text-white" />
                                )}
                              </div>
                            </label>
                          ) : (
                            <div className="flex items-center justify-center">
                              {userItem.permissions?.[permission as keyof typeof userItem.permissions] ? (
                                <Check className="h-5 w-5 text-green-400" />
                              ) : (
                                <X className="h-5 w-5 text-red-400" />
                              )}
                            </div>
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-center">
                        {editingUser === userItem.id ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleSaveUser(userItem.id)}
                              className="btn btn-primary text-sm px-3 py-1"
                              title="Salvar alterações"
                              aria-label="Salvar alterações"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="btn btn-secondary text-sm px-3 py-1"
                              title="Cancelar edição"
                              aria-label="Cancelar edição"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditUser(userItem.id)}
                            className="btn btn-secondary text-sm px-3 py-1"
                            title="Editar permissões"
                            aria-label="Editar permissões"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserPermissionsPanel;