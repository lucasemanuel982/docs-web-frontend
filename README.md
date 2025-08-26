# Docs Web - Frontend

Frontend do editor de documentos colaborativo em tempo real, construído com React, TypeScript e Vite.

## 🚀 Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **Socket.IO Client** para comunicação em tempo real
- **React Hot Toast** para notificações
- **React Context** para gerenciamento de estado

## 📁 Estrutura

```
src/
├── components/          # Componentes reutilizáveis
│   └── ProtectedRoute.tsx
├── contexts/           # Contextos React
│   └── AuthContext.tsx
├── hooks/              # Hooks personalizados
│   └── useSocket.ts
├── pages/              # Páginas da aplicação
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ForgotPassword.tsx
│   ├── ResetPassword.tsx
│   ├── Documents.tsx
│   └── DocumentEditor.tsx
├── types/              # Tipos TypeScript
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🛠️ Instalação

```bash
npm install
```

## 🚀 Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000`

## 📦 Build

```bash
npm run build
```

## 👀 Preview

```bash
npm run preview
```

## 🔧 Scripts

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Compila para produção
- `npm run preview` - Visualiza build de produção
- `npm run lint` - Executa linter
- `npm run lint:fix` - Corrige problemas do linter

## 🌐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
Deverá rodar a API separada: https://github.com/lucasemanuel982/docs-web-backend e realizar a configuração.
VITE_SOCKET_URL=http://localhost:3333
```

## 🎨 Estilização

O projeto usa Tailwind CSS com classes customizadas:

- `bg-dark-custom` - Fundo escuro
- `bg-card-custom` - Fundo de cards
- `text-custom-muted` - Texto secundário
- `btn btn-primary` - Botão primário
- `btn btn-secondary` - Botão secundário

## 📱 Responsividade

O design é totalmente responsivo e funciona em:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (até 767px)


## 🔐 Autenticação e Permissões de Usuário

O frontend gerencia autenticação através do `AuthContext`:
- Login/Logout
- Proteção de rotas
- Persistência de sessão
- Recuperação de senha

### 🏆 Usuário Principal

Ao registrar o primeiro usuário de uma empresa, ele será automaticamente definido como **usuário principal** (`tipoUsuario: 'principal'`) e receberá todas as permissões possíveis (`permissions`).
Os próximos usuários da mesma empresa serão criados como usuários comuns, com permissões restritas.

### Permissões disponíveis

O objeto `user` possui o campo `permissions` com as seguintes flags:
- `canCreateDocuments`: pode criar documentos
- `canEditProfile`: pode editar o próprio perfil
- `canReadDocuments`: pode visualizar documentos
- `canEditDocuments`: pode editar documentos
- `canChangeUserTipo`: pode alterar o tipo de outros usuários


## 🔄 WebSockets

Comunicação em tempo real via Socket.IO:
- Conexão automática
- Reconexão em caso de erro
- Namespaces separados
- Eventos tipados
