import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { useErrorHandler } from '../utils/errorHandler';
import { loginSchema, LoginFormData } from '../utils/validationSchemas';
import FormInput from '../components/FormInput';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn } from 'lucide-react';
import ResponsiveHeader from '../components/ResponsiveHeader';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange'
  });

  // Redirecionar se já estiver autenticado
  React.useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/documents');
    }
  }, [isAuthenticated, loading, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const response = await apiService.login({
        email: data.email,
        password: data.password
      });

      if (response.success && response.data) {
        login(response.data);
        navigate('/documents');
        toast.success('Login realizado com sucesso!');
      }
    } catch (error: any) {
      handleError(error, 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ResponsiveHeader />
      <div className="min-h-screen bg-dark-custom flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <div className="logo-icon">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd"
                    d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor"></path>
                </svg>
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Entre na sua conta
            </h2>
            <p className="mt-2 text-center text-sm text-custom-muted">
              Ou{' '}
              <Link to="/register" className="font-medium text-primary hover:text-blue-500">
                crie uma nova conta
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleFormSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormInput
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                icon={Mail}
                required
                autoComplete="email"
                className="rounded-t-md"
                register={register}
                error={errors.email}
              />

              <FormInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                icon={Lock}
                required
                autoComplete="current-password"
                className="rounded-b-md"
                showPasswordToggle={true}
                onTogglePassword={() => setShowPassword(!showPassword)}
                showPassword={showPassword}
                register={register}
                error={errors.password}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>

            <div className="text-center">
              <Link to="/" className="font-medium text-primary hover:text-blue-500">
                Voltar para o início
              </Link>
            </div>

            <div className="text-center">
              <Link to="/forgot-password" className="font-medium text-primary hover:text-blue-500">
                Esqueceu sua senha?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login; 