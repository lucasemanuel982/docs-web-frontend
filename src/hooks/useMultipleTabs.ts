import { useEffect, useRef, useState } from 'react';

interface TabMessage {
  type: 'TAB_OPENED' | 'TAB_CLOSED' | 'CLOSE_THIS_TAB' | 'FORCE_CLOSE';
  tabId: string;
  timestamp: number;
}

interface UseMultipleTabsOptions {
  enabled?: boolean;
}

export function useMultipleTabs(options: UseMultipleTabsOptions = {}) {
  const { enabled = true } = options;
  const channel = useRef<BroadcastChannel | null>(null);
  const tabId = useRef<string>(`tab_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`);
  const [showModal, setShowModal] = useState(false);
  const [otherTabs, setOtherTabs] = useState<Set<string>>(new Set());

  const forceCloseTab = () => {
      try {
        window.location.href = '/documents';
      } catch (e) {
        console.log('[MultipleTabs] Redirecionamento falhou:', e);
      }
    
  };

  useEffect(() => {
    if (!enabled) {
      console.log('[MultipleTabs] Hook desabilitado para esta rota');
      return;
    }

    // Verificar se BroadcastChannel é suportado
    if (typeof BroadcastChannel === 'undefined') {
      console.warn('[MultipleTabs] BroadcastChannel não é suportado neste navegador');
      return;
    }

    console.log('[MultipleTabs] Inicializando hook para tabId:', tabId.current);
    
    try {
      channel.current = new BroadcastChannel('document-editor-tabs');
      
      // Notifica outras abas que esta aba foi aberta
      const message = {
        type: 'TAB_OPENED' as const,
        tabId: tabId.current,
        timestamp: Date.now()
      };
      
      channel.current.postMessage(message);

      const handleMessage = (event: MessageEvent<TabMessage>) => {
        const { type, tabId: messageTabId } = event.data;
        
        if (messageTabId === tabId.current) {
          console.log('[MultipleTabs] Ignorando mensagem da própria aba');
          return;
        }
        
        switch (type) {
          case 'TAB_OPENED': {
            console.log('[MultipleTabs] Nova aba detectada:', messageTabId);
            setOtherTabs((prev) => {
              const novo = new Set(prev);
              novo.add(messageTabId);
              console.log('[MultipleTabs] Total de outras abas:', novo.size);
              return novo;
            });
            setShowModal(true);
            console.log('[MultipleTabs] Modal deve aparecer agora!');
            break;
          }
          case 'TAB_CLOSED': {
            console.log('[MultipleTabs] Aba fechada:', messageTabId);
            setOtherTabs((prev) => {
              const novo = new Set(prev);
              novo.delete(messageTabId);
              console.log('[MultipleTabs] Total de outras abas após fechamento:', novo.size);
              return novo;
            });
            break;
          }
          case 'CLOSE_THIS_TAB': {
            console.log('[MultipleTabs] Recebido comando para fechar esta aba');
            forceCloseTab();
            break;
          }
          case 'FORCE_CLOSE': {
            console.log('[MultipleTabs] Recebido comando FORCE_CLOSE');
            forceCloseTab();
            break;
          }
        }
      };
      
      channel.current.addEventListener('message', handleMessage);

      const handleBeforeUnload = () => {
        console.log('[MultipleTabs] Aba sendo fechada, notificando outras abas');
        try {
          channel.current?.postMessage({
            type: 'TAB_CLOSED',
            tabId: tabId.current,
            timestamp: Date.now()
          });
        } catch (e) {
          console.log('[MultipleTabs] Erro ao enviar mensagem de fechamento:', e);
        }
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        console.log('[MultipleTabs] Cleanup do hook');
        handleBeforeUnload();
        try {
          channel.current?.close();
        } catch (e) {
          console.log('[MultipleTabs] Erro ao fechar canal:', e);
        }
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    } catch (error) {
      console.error('[MultipleTabs] Erro ao inicializar BroadcastChannel:', error);
    }
  }, [enabled]);

  const handleKeep = () => {
    console.log('[MultipleTabs] Usuário escolheu manter esta aba');
    
    // Notifica outras abas para fechar com comando mais forte
    const message = {
      type: 'FORCE_CLOSE' as const,
      tabId: tabId.current,
      timestamp: Date.now()
    };
    
    console.log('[MultipleTabs] Enviando comando FORCE_CLOSE para outras abas:', message);
    
    try {
      channel.current?.postMessage(message);
    } catch (e) {
      console.log('[MultipleTabs] Erro ao enviar comando de fechamento:', e);
    }
    
    setShowModal(false);
    setOtherTabs(new Set()); // Limpa o contador
  };

  const handleClose = () => {
    console.log('[MultipleTabs] Usuário escolheu fechar esta aba');
    setShowModal(false);
    
    // Aguarda um pouco para o modal fechar antes de fechar a aba
    setTimeout(() => {
      console.log('[MultipleTabs] Fechando aba atual');
      forceCloseTab();
    }, 300);
  };

  return {
    showModal,
    handleKeep,
    handleClose,
    otherTabsCount: otherTabs.size
  };
} 