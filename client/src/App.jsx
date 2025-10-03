import React from 'react';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { GameStateProvider } from './contexts/GameStateContext';
import { CustomizationProvider } from './contexts/CustomizationContext';
import { ShopProvider } from './contexts/ShopContext';
import Auth from './components/Auth';
import DashboardRefactored from './components/DashboardRefactored';
import './App.css';

function AppContent() {
  const { isAuthenticated } = useAuthContext();

  return (
    <div className="App">
      {!isAuthenticated ? (
        <Auth />
      ) : (
        <GameStateProvider>
          <CustomizationProvider>
            <ShopProvider>
              <DashboardRefactored />
            </ShopProvider>
          </CustomizationProvider>
        </GameStateProvider>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
