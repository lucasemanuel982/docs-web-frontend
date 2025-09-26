import { useEffect, useRef } from 'react';
import { apiService } from '../services/api';

export const usePing = (intervalMs: number = 40000) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startPing = () => {
      intervalRef.current = setInterval(async () => {
        try {
          await apiService.ping();
        } catch (error) {
            console.error('Erro ao pingar o servidor:', error);
        }
      }, intervalMs);
    };

    const stopPing = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // Iniciar o ping
    startPing();

    // Cleanup ao desmontar o componente
    return () => {
      stopPing();
    };
  }, [intervalMs]);

  return {
    stopPing: () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };
};
