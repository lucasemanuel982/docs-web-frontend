import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { apiService } from '../services/api';
import { useErrorHandler } from '../utils/errorHandler';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../utils/validationSchemas';
import FormInput from '../components/FormInput';
import toast from 'react-hot-toast';
import { Mail, Send } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const { handleError } = useErrorHandler();
  
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    
    try {
      const response = await apiService.forgotPassword(data.email);
      
      if (response.success) {
        setEmailSent(true);
        toast.success(response.message || 'Email de recuperação enviado com sucesso!');
      }
    } catch (error: any) {
      handleError(error, 'Erro ao solicitar recuperação de senha');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-dark-custom flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Verifique seu E-mail
            </h2>
            <p className="mt-2 text-center text-sm text-custom-muted">
              Se uma conta com o e-mail fornecido existir, um link para redefinição de senha será enviado.
            </p>
          </div>
          <div className="text-center">
            <Link to="/login" className="btn btn-primary w-full">
              Voltar para o Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-custom flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Recuperar Senha
          </h2>
          <p className="mt-2 text-center text-sm text-custom-muted">
            Digite seu e-mail e enviaremos um link para redefinir sua senha.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleFormSubmit(onSubmit)}>
          <FormInput
            id="email"
            name="email"
            type="email"
            placeholder="Digite seu email"
            icon={Mail}
            required
            autoComplete="email"
            register={register}
            error={errors.email}
          />

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/login" className="font-medium text-primary hover:text-blue-500">
              Lembrou a senha? Voltar para o login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 