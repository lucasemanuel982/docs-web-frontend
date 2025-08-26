import toast from 'react-hot-toast';

// Tipos de erro
export enum ErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  VALIDATION = 'validation',
  SERVER = 'server',
  PERMISSION = 'permission',
  NOT_FOUND = 'not_found',
  UNKNOWN = 'unknown'
}

// Interface para erro padronizado
export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
}

// Mensagens de erro em português
const ERROR_MESSAGES = {
  [ErrorType.NETWORK]: {
    title: 'Erro de Conexão',
    default: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
    timeout: 'A conexão expirou. Tente novamente.',
    offline: 'Você está offline. Verifique sua conexão com a internet.'
  },
  [ErrorType.AUTHENTICATION]: {
    title: 'Erro de Autenticação',
    default: 'Erro na autenticação. Tente fazer login novamente.',
    invalid_credentials: 'Email ou senha incorretos.',
    session_expired: 'Sua sessão expirou. Faça login novamente.',
    unauthorized: 'Você não tem permissão para acessar este recurso.',
    duplicate_session: 'Sessão duplicada detectada. Você foi desconectado.'
  },
  [ErrorType.VALIDATION]: {
    title: 'Erro de Validação',
    default: 'Dados inválidos. Verifique as informações fornecidas.',
    required_fields: 'Por favor, preencha todos os campos obrigatórios.',
    invalid_email: 'Por favor, insira um email válido.',
    password_mismatch: 'As senhas não coincidem.',
    password_length: 'A senha deve ter pelo menos 6 caracteres.',
    invalid_format: 'Formato inválido para o campo.'
  },
  [ErrorType.SERVER]: {
    title: 'Erro do Servidor',
    default: 'Erro interno do servidor. Tente novamente mais tarde.',
    database: 'Erro no banco de dados. Tente novamente.',
    email_service: 'Erro no serviço de email. Tente novamente.',
    file_upload: 'Erro ao fazer upload do arquivo.',
    processing: 'Erro ao processar sua solicitação.'
  },
  [ErrorType.PERMISSION]: {
    title: 'Erro de Permissão',
    default: 'Você não tem permissão para realizar esta ação.',
    admin_only: 'Esta ação é permitida apenas para administradores.',
    read_only: 'Este campo não pode ser editado.',
    access_denied: 'Acesso negado.'
  },
  [ErrorType.NOT_FOUND]: {
    title: 'Não Encontrado',
    default: 'O recurso solicitado não foi encontrado.',
    user: 'Usuário não encontrado.',
    document: 'Documento não encontrado.',
    page: 'Página não encontrada.'
  },
  [ErrorType.UNKNOWN]: {
    title: 'Erro Desconhecido',
    default: 'Ocorreu um erro inesperado. Tente novamente.'
  }
};

// Função para determinar o tipo de erro baseado na mensagem ou código
export function determineErrorType(error: any): ErrorType {
  const message = error?.message?.toLowerCase() || '';
  const code = error?.code?.toLowerCase() || '';

  // Erros de rede
  if (message.includes('network') || message.includes('fetch') || message.includes('connection') || 
      code.includes('net::') || code.includes('network')) {
    return ErrorType.NETWORK;
  }

  // Erros de autenticação
  if (message.includes('authentication') || message.includes('login') || message.includes('senha') ||
      message.includes('email') || message.includes('sessão') || message.includes('session') ||
      code.includes('401') || code.includes('403')) {
    return ErrorType.AUTHENTICATION;
  }

  // Erros de validação
  if (message.includes('validation') || message.includes('inválido') || message.includes('preencha') ||
      message.includes('obrigatório') || message.includes('required') || code.includes('400')) {
    return ErrorType.VALIDATION;
  }

  // Erros de permissão
  if (message.includes('permission') || message.includes('permissão') || message.includes('admin') ||
      message.includes('acesso') || code.includes('403')) {
    return ErrorType.PERMISSION;
  }

  // Erros de não encontrado
  if (message.includes('not found') || message.includes('não encontrado') || message.includes('encontrado') ||
      code.includes('404')) {
    return ErrorType.NOT_FOUND;
  }

  // Erros do servidor
  if (message.includes('server') || message.includes('servidor') || message.includes('internal') ||
      code.includes('500') || code.includes('502') || code.includes('503')) {
    return ErrorType.SERVER;
  }

  return ErrorType.UNKNOWN;
}

// Função para obter mensagem de erro apropriada
export function getErrorMessage(error: any, customMessage?: string): string {
  const errorType = determineErrorType(error);
  const errorMessages = ERROR_MESSAGES[errorType];
  
  // Se há uma mensagem customizada, use ela
  if (customMessage) {
    return customMessage;
  }

  // Se há uma mensagem específica no erro, use ela
  if (error?.message) {
    return error.message;
  }

  // Use a mensagem padrão do tipo de erro
  return errorMessages.default;
}

// Função principal para tratamento de erros
export function handleError(error: any, customMessage?: string, showToast: boolean = true): AppError {
  const errorType = determineErrorType(error);
  const message = getErrorMessage(error, customMessage);
  
  const appError: AppError = {
    type: errorType,
    message,
    code: error?.code,
    details: error
  };

  // Log do erro para debugging
  console.error('Erro capturado:', {
    type: errorType,
    message,
    originalError: error,
    timestamp: new Date().toISOString()
  });

  // Mostrar toast se solicitado
  if (showToast) {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#ffffff',
        border: '1px solid #dc2626'
      }
    });
  }

  return appError;
}

// Função para tratamento específico de erros de socket
export function handleSocketError(error: any, eventName?: string): AppError {
  const customMessage = eventName ? `Erro no evento ${eventName}: ${error?.message || 'Erro desconhecido'}` : undefined;
  return handleError(error, customMessage);
}

// Função para tratamento de erros de validação de formulário
export function handleValidationError(field: string, message?: string): AppError {
  const customMessage = message || `Campo ${field} é obrigatório`;
  return handleError({ message: customMessage }, customMessage);
}

// Função para tratamento de erros de permissão
export function handlePermissionError(action: string): AppError {
  const customMessage = `Você não tem permissão para ${action}`;
  return handleError({ message: customMessage }, customMessage);
}

// Função para tratamento de erros de rede
export function handleNetworkError(): AppError {
  return handleError({ message: 'Erro de conexão' }, 'Verifique sua conexão com a internet');
}

// Função para tratamento de erros de autenticação
export function handleAuthError(message?: string): AppError {
  const customMessage = message || 'Erro na autenticação. Tente fazer login novamente.';
  return handleError({ message: customMessage }, customMessage);
}

// Hook para usar em componentes React
export function useErrorHandler() {
  return {
    handleError,
    handleSocketError,
    handleValidationError,
    handlePermissionError,
    handleNetworkError,
    handleAuthError,
    ErrorType
  };
} 