import * as yup from 'yup';

// Constantes de validação
const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const MAX_DIMENSIONS = { width: 1024, height: 1024 }; // Máximo 1024x1024px

export const registerSchema = yup.object({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email deve ser válido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'),
  
  confirmPassword: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('password')], 'As senhas não coincidem'),
  
  empresa: yup
    .string()
    .required('Empresa é obrigatória')
    .min(2, 'Empresa deve ter pelo menos 2 caracteres')
    .max(100, 'Empresa deve ter no máximo 100 caracteres'),
  
  profileImage: yup
    .mixed()
    .optional()
    .test('file-size', 'A imagem deve ter no máximo 1MB', (value) => {
      if (!value) return true; // Campo opcional
      if (value instanceof File) {
        return value.size <= MAX_FILE_SIZE;
      }
      return true;
    })
    .test('file-type', 'Apenas imagens são permitidas (JPEG, PNG, GIF, WebP)', (value) => {
      if (!value) return true; // Campo opcional
      if (value instanceof File) {
        return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(value.type);
      }
      return true;
    })
    .test('file-dimensions', `A imagem deve ter no máximo ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} pixels`, (value) => {
      if (!value) return true; // Campo opcional
      if (value instanceof File) {
        // Esta validação será feita no componente ImageUpload
        // Aqui apenas retornamos true para não duplicar a validação
        return true;
      }
      return true;
    })
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email deve ser válido'),
  
  password: yup
    .string()
    .required('Senha é obrigatória')
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email deve ser válido')
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required('Nova senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'),
  
  confirmPassword: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('password')], 'As senhas não coincidem')
});

export const updatePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Senha atual é obrigatória'),
  
  newPassword: yup
    .string()
    .required('Nova senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'),
  
  confirmPassword: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('newPassword')], 'As senhas não coincidem')
});

// Tipos TypeScript
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  empresa: string;
  profileImage?: File | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface UpdatePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}