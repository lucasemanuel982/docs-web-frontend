import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import { useSocket } from '../hooks/useSocket';
import { useErrorHandler } from '../utils/errorHandler';
import { updatePasswordSchema, UpdatePasswordFormData } from '../utils/validationSchemas';
import toast from 'react-hot-toast';
import { User, Mail, Building, Lock, Save, Key } from 'lucide-react';
import ResponsiveHeader from '../components/ResponsiveHeader';
import ImageUpload from '../components/ImageUpload';

interface UpdateUserData {
  name: string;
  email: string;
  empresa?: string;
  profileImage?: string;
}

// Usando o tipo do schema de validação
type UpdatePasswordData = UpdatePasswordFormData;

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<UpdateUserData>({
    name: '',
    email: '',
    empresa: '',
    profileImage: ''
  });
  const [passwordData, setPasswordData] = useState<UpdatePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'image'>('profile');
  
  const { user, logout, token, updateUser } = useAuth();
  // const { emit, on, off } = useSocket();
  const navigate = useNavigate();
  const { handleError, handleValidationError } = useErrorHandler();

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name,
        email: user.email,
        empresa: user.empresa || '',
        profileImage: user.profileImage || ''
      });
    }
  }, [user]);

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setUserData(prev => ({ ...prev, profileImage: base64 }));
      };
      reader.readAsDataURL(file);
    } else {
      setUserData(prev => ({ ...prev, profileImage: '' }));
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData.name.trim() || !userData.email.trim()) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    if (user?.tipoUsuario === 'admin' && !userData.empresa?.trim()) {
      toast.error('Por favor, preencha o nome da empresa');
      return;
    }
    if (userData.email !== user?.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        handleValidationError('email', 'Por favor, insira um email válido');
        return;
      }
    }
    setIsLoading(true);
    toast('Salvando dados...', { icon: '💾', duration: 2000 });
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          empresa: user?.tipoUsuario === 'admin' ? userData.empresa : undefined,
          profileImage: userData.profileImage
        })
      });
      const result = await response.json();
      if (response.ok) {
        updateUser(result.user);
        toast.success(result.message || 'Dados pessoais salvos com sucesso!');
      } else {
        throw new Error(result.message || 'Erro ao atualizar perfil');
      }
    } catch (error: any) {
      handleError(error, 'Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePasswordSchema.validate(passwordData, { abortEarly: false });
      setIsPasswordLoading(true);
      const response = await fetch('/api/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      const result = await response.json();
      if (response.ok) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast.success(result.message || 'Senha alterada com sucesso!');
      } else {
        throw new Error(result.message || 'Erro ao alterar senha');
      }
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        const firstError = error.errors[0];
        toast.error(firstError);
      } else {
        handleError(error, 'Erro ao alterar senha');
      }
    } finally {
      setIsPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-custom text-white font-inter flex items-center justify-center">
        <div className="text-center">
          <div className="text-custom-muted">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-custom text-white font-inter">
      <ResponsiveHeader onLogout={handleLogout} pageTitle="Perfil do Usuário" />

      {/* Conteúdo Principal */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Perfil do Usuário</h1>
          <p className="text-custom-muted">Gerencie suas informações pessoais e configurações de conta</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-custom mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'profile'
                ? 'text-primary border-b-2 border-primary'
                : 'text-custom-muted hover:text-white'
            }`}
          >
            Dados Pessoais
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'image'
                ? 'text-primary border-b-2 border-primary'
                : 'text-custom-muted hover:text-white'
            }`}
          >
            Imagem de Perfil
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'password'
                ? 'text-primary border-b-2 border-primary'
                : 'text-custom-muted hover:text-white'
            }`}
          >
            Alterar Senha
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-card-custom border border-custom rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-6">Dados Pessoais</h3>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="relative">
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nome Completo
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none top-8">
                  <User className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  type="text"
                  id="name"
                  value={userData.name}
                  onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input-custom w-full pl-10 pr-3 py-2 rounded-md"
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>
              
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none top-8">
                  <Mail className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={userData.email}
                  onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                  className="form-input-custom w-full pl-10 pr-3 py-2 rounded-md"
                  placeholder="Digite seu email"
                  required
                />
              </div>

              <div className="relative">
                <label htmlFor="empresa" className="block text-sm font-medium mb-2">
                  Empresa
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 pb-6 flex items-center pointer-events-none top-8">
                  <Building className="h-5 w-5 text-gray-300" />
                </div>
                {user?.tipoUsuario === 'principal' ? (
                  <input
                    type="text"
                    id="empresa"
                    value={userData.empresa}
                    onChange={(e) => setUserData(prev => ({ ...prev, empresa: e.target.value }))}
                    className="form-input-custom w-full pl-10 pr-3 py-2 rounded-md"
                    placeholder="Digite o nome da empresa"
                  />
                ) : (
                  <input
                    type="text"
                    id="empresa"
                    value={userData.empresa}
                    className="form-input-custom w-full pl-10 pr-3 py-2 rounded-md bg-gray-700 cursor-not-allowed"
                    placeholder="Empresa"
                    disabled
                    readOnly
                  />
                )}
                {(
                  <p className="text-xs text-custom-muted mt-1">Apenas administradores podem editar a empresa</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="btn btn-primary flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <Link to="/documents" className="btn btn-secondary">
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="bg-card-custom border border-custom rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-6">Imagem de Perfil</h3>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <ImageUpload
                onImageChange={handleImageChange}
                currentImage={userData.profileImage}
              />
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="btn btn-primary flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Salvando...' : 'Salvar Imagem'}
                </button>
                <Link to="/documents" className="btn btn-secondary">
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="bg-card-custom border border-custom rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-6">Alterar Senha</h3>
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="relative">
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
                  Senha Atual
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none top-8">
                  <Lock className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="form-input-custom w-full pl-10 pr-3 py-2 rounded-md"
                  placeholder="Digite sua senha atual"
                  required
                />
              </div>
              
              <div className="relative">
                <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                  Nova Senha
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none top-8">
                  <Lock className="h-5 w-5 mb-14 lg:mb-6 text-gray-300" />
                </div>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="form-input-custom w-full pl-10 pr-3 py-2 rounded-md"
                  placeholder="Digite a nova senha"
                  required
                />
                <p className="text-xs text-custom-muted mt-1">
                  A senha deve ter pelo menos 8 caracteres, 3 números, um caractere especial e não pode conter 3 números sequenciais
                </p>
              </div>

              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirmar Nova Senha
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none top-8">
                  <Lock className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="form-input-custom w-full pl-10 pr-3 py-2 rounded-md"
                  placeholder="Confirme a nova senha"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="btn btn-primary flex items-center gap-2"
                  disabled={isPasswordLoading}
                >
                  <Key className="h-4 w-4" />
                  {isPasswordLoading ? 'Alterando...' : 'Alterar Senha'}
                </button>
                <Link to="/documents" className="btn btn-secondary">
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserProfile;