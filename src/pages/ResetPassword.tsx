import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import { useSocket } from '../hooks/useSocket';
import { useErrorHandler } from '../utils/errorHandler';
import { resetPasswordSchema, ResetPasswordFormData } from '../utils/validationSchemas';
import FormInput from '../components/FormInput';
import toast from 'react-hot-toast';
import { Lock, Key } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // const { emit, on, off, isConnected, connect } = useSocket();
  const { handleError } = useErrorHandler();

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors }
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onChange'
  });

  useEffect(() => {
    if (!token) {
      toast.error('Token de redefinição não encontrado. Por favor, use o link enviado para o seu e-mail.');
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    setIsLoading(true);
    try {
      // Chamada REST para resetar senha
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password })
      });
      const result = await response.json();
      if (response.ok) {
        setIsSuccess(true);
        toast.success(result.message || 'Senha redefinida com sucesso!');
      } else {
        throw new Error(result.message || 'Erro ao redefinir a senha');
      }
    } catch (error: any) {
      handleError(error, 'Falha ao redefinir a senha');
      navigate('/forgot-password');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-dark-custom flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Senha Redefinida com Sucesso!
          </h2>
          <p className="mt-2 text-sm text-custom-muted">
            Você já pode fazer login com sua nova senha.
          </p>
          <Link to="/login" className="btn btn-primary w-full mt-4">
            Ir para o Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-custom flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Redefinir Senha
          </h2>
          <p className="mt-2 text-center text-sm text-custom-muted">
            Crie uma nova senha para sua conta.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleFormSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormInput
              id="password"
              name="password"
              type="password"
              placeholder="Digite sua nova senha"
              icon={Lock}
              required
              autoComplete="new-password"
              register={register}
              error={errors.password}
            />

            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirme sua nova senha"
              icon={Lock}
              required
              autoComplete="new-password"
              register={register}
              error={errors.confirmPassword}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Key className="h-4 w-4" />
              {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 