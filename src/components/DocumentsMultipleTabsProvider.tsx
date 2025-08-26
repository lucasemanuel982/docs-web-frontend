import React from 'react';
import { useMultipleTabs } from '../hooks/useMultipleTabs';
import { MultipleTabsModal } from './MultipleTabsModal';

interface DocumentsMultipleTabsProviderProps {
  children: React.ReactNode;
}

export function DocumentsMultipleTabsProvider({ children }: DocumentsMultipleTabsProviderProps) {
  const { showModal, handleKeep, handleClose } = useMultipleTabs({ enabled: true });

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