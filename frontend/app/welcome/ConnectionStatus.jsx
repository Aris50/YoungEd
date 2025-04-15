import React, { useState, useEffect } from 'react';
import { getConnectionStatus, checkServerAvailability } from './offlineService';

const ConnectionStatus = () => {
  const [status, setStatus] = useState({
    isOnline: navigator.onLine,
    isServerAvailable: true,
    isFullyOffline: false,
    reason: 'online'
  });

  useEffect(() => {
    // Verificare inițială
    const checkStatus = async () => {
      const serverStatus = await checkServerAvailability();
      const connectionStatus = getConnectionStatus();
      setStatus({
        ...connectionStatus,
        isServerAvailable: serverStatus
      });
    };

    checkStatus();

    // Adăugare event listeners
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
      // Verifică imediat starea serverului când revenim online
      checkServerAvailability().then(serverStatus => {
        setStatus(prev => ({
          ...prev,
          isServerAvailable: serverStatus,
          isFullyOffline: !serverStatus,
          reason: serverStatus ? 'online' : 'server'
        }));
      });
    };

    const handleOffline = () => {
      setStatus(prev => ({ 
        ...prev, 
        isOnline: false, 
        isFullyOffline: true,
        reason: 'internet'
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificare periodică a stării serverului
    const intervalId = setInterval(async () => {
      const serverStatus = await checkServerAvailability();
      const connectionStatus = getConnectionStatus();
      setStatus(prev => ({
        ...connectionStatus,
        isServerAvailable: serverStatus
      }));
    }, 30000);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, []);

  // Funcție pentru a obține mesajul de stare
  const getStatusMessage = () => {
    if (!status.isOnline) {
      return "Fără conexiune la internet";
    } else if (!status.isServerAvailable) {
      return "Server indisponibil";
    } else {
      return "Conectat";
    }
  };

  // Funcție pentru a obține culoarea de fundal
  const getBackgroundColor = () => {
    if (!status.isOnline) {
      return "#ff5252"; // Roșu pentru fără internet
    } else if (!status.isServerAvailable) {
      return "#ff9800"; // Portocaliu pentru server indisponibil
    } else {
      return "#4caf50"; // Verde pentru conectat
    }
  };

  // Funcție pentru a obține iconița
  const getIcon = () => {
    if (!status.isOnline) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
          <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
          <line x1="12" y1="20" x2="12.01" y2="20"></line>
        </svg>
      );
    } else if (!status.isServerAvailable) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      );
    }
  };

  return (
    <div className="connection-status" style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
    }}>
      <div style={{
        backgroundColor: getBackgroundColor(),
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {getIcon()}
        <span>{getStatusMessage()}</span>
      </div>
      
      {status.isFullyOffline && (
        <div style={{
          backgroundColor: '#673ab7',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Mod offline activ - {status.reason === 'internet' ? 'fără conexiune la internet' : 'server indisponibil'}</span>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus; 