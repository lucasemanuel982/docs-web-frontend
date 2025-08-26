import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { useErrorHandler } from '../utils/errorHandler';
import { registerSchema, RegisterFormData } from '../utils/validationSchemas';
import FormInput from '../components/FormInput';
import ImageUpload from '../components/ImageUpload';
import toast from 'react-hot-toast';
import { User, Mail, Building, Lock, UserPlus } from 'lucide-react';
import ResponsiveHeader from '../components/ResponsiveHeader';

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    setValue,
    trigger
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema) as any,
    mode: 'onChange'
  });

  // Redirecionar se já estiver autenticado
  React.useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/documents');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file);
    setValue('profileImage', file || undefined);
    trigger('profileImage');
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      let profileImageBase64: string | undefined;

      if (selectedImage) {
        profileImageBase64 = await convertImageToBase64(selectedImage);
      }

      const response = await apiService.register({
        name: data.name,
        email: data.email,
        empresa: data.empresa,
        password: data.password,
        profileImage: profileImageBase64
      });

      if (response.success && response.data) {
        toast.success('Conta criada com sucesso!');
        login(response.data);
        navigate('/documents');
      }
    } catch (error: any) {
      handleError(error, 'Erro ao criar conta');
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
              Crie sua conta
            </h2>
            <p className="mt-2 text-center text-sm text-custom-muted">
              Ou{' '}
              <Link to="/login" className="font-medium text-primary hover:text-blue-500">
                faça login na sua conta
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleFormSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormInput
                id="name"
                name="name"
                type="text"
                placeholder="Nome completo"
                icon={User}
                required
                autoComplete="name"
                className="rounded-t-md"
                register={register}
                error={errors.name}
              />

              <FormInput
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                icon={Mail}
                required
                autoComplete="email"
                register={register}
                error={errors.email}
              />

              <FormInput
                id="empresa"
                name="empresa"
                type="text"
                placeholder="Empresa"
                icon={Building}
                required
                autoComplete="organization"
                register={register}
                error={errors.empresa}
              />

              <FormInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                icon={Lock}
                required
                autoComplete="new-password"
                showPasswordToggle={true}
                onTogglePassword={() => setShowPassword(!showPassword)}
                showPassword={showPassword}
                register={register}
                error={errors.password}
              />

              <FormInput
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar senha"
                icon={Lock}
                required
                autoComplete="new-password"
                className="rounded-b-md"
                showPasswordToggle={true}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                showPassword={showConfirmPassword}
                register={register}
                error={errors.confirmPassword}
              />

              <ImageUpload
                onImageChange={handleImageChange}
                error={errors.profileImage?.message}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                {isLoading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </div>

            <div className="text-center">
              <Link to="/" className="font-medium text-primary hover:text-blue-500">
                Voltar para o início
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register; 