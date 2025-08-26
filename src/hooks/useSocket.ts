import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketEvents } from '../types';
import { useAuth } from '../contexts/AuthContext';

const SOCKET_URL = 'https://docs-web-backend.onrender.com';
// const SOCKET_URL = 'https://docs-web-backend-eta.vercel.app';
// const SOCKET_URL = (import.meta as any).env?.VITE_SOCKET_URL || 'http://localhost:3333';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { token, isAuthenticated } = useAuth();

  const connect = useCallback((onConnect?: () => void, onError?: () => void) => {
    console.log('🔌 Tentando conectar...', { isAuthenticated, token: !!token });

    if (socketRef.current?.connected) {
      console.log('🔌 Já conectado, reutilizando conexão');
      setIsConnected(true);
      onConnect?.();
      return socketRef.current;
    }

    setIsConnecting(true);
    setIsConnected(false);

    // Para login/registro, usar namespace público
    // Para documentos, usar namespace de usuários autenticados
    const namespace = isAuthenticated && token ? '/usuarios' : '/';
    console.log('🔌 Conectando ao namespace:', namespace);

    socketRef.current = io(`${SOCKET_URL}${namespace}`, {
      auth: token ? { token } : undefined,
      timeout: 5000 // 5 segundos de timeout
    });

    socketRef.current.on('connect', () => {
      console.log('🔌 Conectado com sucesso ao socket:', socketRef.current?.id);
      setIsConnecting(false);
      setIsConnected(true);
      onConnect?.();
    });

    socketRef.current.on('disconnect', () => {
      console.log('🔌 Desconectado do socket');
      setIsConnecting(false);
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('🔌 Erro de conexão:', error);
      setIsConnecting(false);
      setIsConnected(false);
      onError?.();
    });

    return socketRef.current;
  }, [isAuthenticated, token]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnecting(false);
      setIsConnected(false);
    }
  }, []);

  const emit = useCallback(<K extends keyof SocketEvents>(
    event: K,
    ...args: Parameters<SocketEvents[K]>
  ) => {
    console.log('Emitindo evento:', event, 'com dados:', args);
    if (socketRef.current) {
      (socketRef.current.emit as any)(event, ...args);
    } else {
      console.error('Socket não está conectado para emitir evento:', event);
    }
  }, []);

  const on = useCallback(<K extends keyof SocketEvents>(
    event: K,
    callback: SocketEvents[K]
  ) => {
    if (socketRef.current) {
      (socketRef.current.on as any)(event, callback);
    }
  }, []);

  const off = useCallback(<K extends keyof SocketEvents>(
    event: K,
    callback?: SocketEvents[K]
  ) => {
    if (socketRef.current) {
      if (callback) {
        (socketRef.current.off as any)(event, callback);
      } else {
        (socketRef.current.off as any)(event);
      }
    }
  }, []);



  // Atualizar estado isConnected baseado no socket real
  useEffect(() => {
    if (socketRef.current) {
      setIsConnected(socketRef.current.connected);
    }
  }, [socketRef.current?.connected]);

  return {
    socket: socketRef.current,
    emit,
    on,
    off,
    connect,
    disconnect,
    isConnected: isConnected || (socketRef.current?.connected || false),
    isConnecting
  };
} 