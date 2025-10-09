import { useEffect, useRef } from 'react';
import { apiService } from '../services/api';

/**
 * Hook para manter o servidor ativo enviando requisições periódicas
 * Funciona mesmo sem interação do usuário
 */
export const useKeepAlive = (intervalMs: number = 40000) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const ping = async () => {
      try {
        await apiService.ping();
        console.log('Keep-alive: ping enviado com sucesso');
      } catch (error) {
        console.error('Keep-alive: Erro ao enviar ping:', error);
      }
    };

    // Enviar primeiro ping imediatamente
    ping();

    // Configurar intervalo para pings subsequentes
    intervalRef.current = setInterval(ping, intervalMs);

    // Cleanup ao desmontar o componente
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [intervalMs]);

  return {
    // Permite parar manualmente se necessário
    stop: () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };
};

