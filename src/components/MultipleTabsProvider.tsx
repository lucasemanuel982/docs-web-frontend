import React from 'react';
import { useMultipleTabs } from '../hooks/useMultipleTabs';
import { MultipleTabsModal } from './MultipleTabsModal';

interface MultipleTabsProviderProps {
  children: React.ReactNode;
}

export function MultipleTabsProvider({ children }: MultipleTabsProviderProps) {
  const { showModal, handleKeep, handleClose } = useMultipleTabs({ enabled: false });

  return (
    <>
      {children}
      <MultipleTabsModal
        isOpen={showModal}
        onKeep={handleKeep}
        onClose={handleClose}
      />
    </>
  );
} 