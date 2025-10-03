import React, { createContext, useContext } from 'react';
import { useAuthContext } from './AuthContext';
import { useCustomization } from '../hooks/useCustomization';

const CustomizationContext = createContext(null);

export function CustomizationProvider({ children }) {
  const { token } = useAuthContext();
  const customization = useCustomization(token);

  return (
    <CustomizationContext.Provider value={customization}>
      {children}
    </CustomizationContext.Provider>
  );
}

export function useCustomizationContext() {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomizationContext must be used within a CustomizationProvider');
  }
  return context;
}
