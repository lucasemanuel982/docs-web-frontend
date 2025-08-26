export interface User {
  id: string;
  name: string;
  email: string;
  empresa: string;
  tipoUsuario: 'user' | 'admin' | 'principal';
  profileImage?: string;
  permissions?: {
    canCreateDocuments: boolean;
    canEditProfile: boolean;
    canReadDocuments: boolean;
    canEditDocuments: boolean;
    canChangeUsertipo: boolean;
  };
}

export interface Document {
  _id: string;
  title: string;
  content: string;
  ownerId: string;
  collaborators: string[];
  readPermissions: string[];
  editPermissions: string[];
  createdAt: string;
  updatedAt: string;
  ownerName?: string;
  ownerProfileImage?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  empresa: string;
  profileImage?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SocketEvents {
  // Login events
  'autenticar_usuario': (dados: LoginRequest) => void;
  'registrar_usuario': (dados: RegisterRequest) => void;
  'autenticacao_sucesso': (response: AuthResponse) => void;
  'autenticacao_erro': (error: { message: string }) => void;
  'registro_sucesso': (response: { message: string; token: string; user: User }) => void;
  'registro_erro': (error: { message: string }) => void;
  'erro_servidor': (error: { message: string }) => void;

  // Password recovery events
  'recuperar_senha': (dados: ForgotPasswordRequest) => void;
  'solicitar_recuperacao_senha': (dados: ForgotPasswordRequest) => void;
  'recuperacao_sucesso': (response: { message: string }) => void;
  'recuperacao_erro': (error: { message: string }) => void;
  'redefinir_senha': (dados: ResetPasswordRequest) => void;
  'resetar_senha': (dados: ResetPasswordRequest) => void;
  'redefinicao_sucesso': (response: { message: string }) => void;
  'redefinicao_erro': (error: { message: string }) => void;

  // Document events
  'carregar_documentos': () => void;
  'documentos_carregados': (documentos: Document[]) => void;
  'selecionar_documento': (dados: { documentoId: string; nomeUsuario: string }, callback: (doc: { title: string; content: string; createdAt: string; updatedAt: string; canEdit: boolean } | null) => void) => void;
  'texto_editor': (dados: { texto: string; documentoId: string }) => void;
  'texto_editor_clientes': (texto: string) => void;
  'comecar_digitacao': (dados: { documentoId: string; nomeUsuario: string }) => void;
  'parar_digitacao': (dados: { documentoId: string; nomeUsuario: string }) => void;
  'usuario_digitando': (dados: { nomeUsuario: string; usuariosDigitando: string[] }) => void;
  'usuario_parou_digitacao': (dados: { nomeUsuario: string; usuariosDigitando: string[] }) => void;
  'criar_documento': (dados: { title: string; readPermissions?: string[]; editPermissions?: string[] }) => void;
  'documento_criado': (documento: Document) => void;
  'deletar_documento': (dados: { documentId: string }) => void;
  'documento_deletado': (documentoId: string) => void;
  'excluir_documento': (dados: { documentoId: string }) => void;
  'documento_excluido': (documentoId: string) => void;
  'usuarios_online': (usuarios: Array<{ nome: string; id: string; profileImage?: string }>) => void;
  'buscar_usuarios_empresa': () => void;
  'usuarios_empresa_carregados': (usuarios: Array<{ id: string; name: string; email: string }>) => void;
  'atualizar_permissoes_documento': (dados: { documentId: string; readPermissions: string[]; editPermissions: string[] }) => void;
  'permissoes_atualizadas': (response: { message: string; documentId: string; readPermissions: string[]; editPermissions: string[] }) => void;
  'erro_permissoes': (error: { message: string }) => void;

  // Session events
  'logout_usuario': (tokenJWT: string) => void;
  'verificar_sessao': (tokenJWT: string) => void;
  'aviso_redirecionamento': (dados: { mensagem: string }) => void;
  'sessao_duplicada': () => void;
  'deslogar_usuario': () => void;
  'autorizacao_sucesso': (payload: any) => void;

  // User profile events
  'atualizar_perfil': (dados: { name: string; email: string; empresa?: string; profileImage?: string }) => void;
  'atualizacao_perfil_sucesso': (response: { message: string; user: User }) => void;
  'atualizacao_perfil_erro': (error: { message: string }) => void;
  'atualizar_senha': (dados: { currentPassword: string; newPassword: string }) => void;
  'atualizacao_senha_sucesso': (response: { message: string }) => void;
  'atualizacao_senha_erro': (error: { message: string }) => void;

  // Admin permissions events
  'buscar_usuarios_empresa_admin': () => void;
  'usuarios_empresa_admin_carregados': (usuarios: Array<{ id: string; name: string; email: string; tipoUsuario: string; permissions: any }>) => void;
  'atualizar_permissoes_usuario': (dados: { userId: string; permissions: any; tipoUsuario: string }) => void;
  'permissoes_usuario_atualizadas': (response: { message: string; userId: string }) => void;
}

export interface UpdateUserData {
  name: string;
  email: string;
  empresa?: string; // Opcional para usuários normais
  profileImage?: string; // Opcional para imagem de perfil
} 