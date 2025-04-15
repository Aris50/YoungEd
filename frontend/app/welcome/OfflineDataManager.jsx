import React, { useState, useEffect } from 'react';
import { getConnectionStatus, checkServerAvailability, syncPendingOperations } from './offlineService';
import { 
  getLocalStudents, 
  saveLocalStudents, 
  addLocalStudent, 
  updateLocalStudent, 
  deleteLocalStudent,
  getPendingOperations,
  addPendingOperation,
  removePendingOperation,
  clearPendingOperations
} from './localStorageService';

// Hook personalizat pentru gestionarea datelor cu suport offline
const useOfflineData = (initialData = []) => {
  const [data, setData] = useState(initialData);
  const [isOffline, setIsOffline] = useState(false);
  const [pendingOperations, setPendingOperations] = useState({ create: [], update: [], delete: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Inițializare date
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      
      // Verificare starea conexiunii
      const serverStatus = await checkServerAvailability();
      const connectionStatus = getConnectionStatus();
      const isFullyOffline = !connectionStatus.isOnline || !serverStatus;
      
      setIsOffline(isFullyOffline);
      
      if (isFullyOffline) {
        // Încărcare date din localStorage
        const localData = getLocalStudents();
        setData(localData.length > 0 ? localData : initialData);
        
        // Salvare date inițiale în localStorage dacă nu există
        if (localData.length === 0) {
          saveLocalStudents(initialData);
        }
      } else {
        // Datele sunt deja în state, nu trebuie să le încărcăm din localStorage
        setData(initialData);
      }
      
      // Încărcare operațiuni în așteptare
      const pendingOps = getPendingOperations();
      setPendingOperations(pendingOps);
      
      setIsLoading(false);
    };
    
    initializeData();
  }, [initialData]);

  // Verificare periodică a stării conexiunii
  useEffect(() => {
    const checkConnection = async () => {
      const serverStatus = await checkServerAvailability();
      const connectionStatus = getConnectionStatus();
      const isFullyOffline = !connectionStatus.isOnline || !serverStatus;
      
      setIsOffline(isFullyOffline);
      
      // Dacă am revenit online, sincronizăm datele
      if (!isFullyOffline && isOffline) {
        await syncData();
      }
    };
    
    const intervalId = setInterval(checkConnection, 30000);
    
    return () => clearInterval(intervalId);
  }, [isOffline]);

  // Sincronizare date
  const syncData = async () => {
    try {
      // Sincronizare operațiuni în așteptare
      await syncPendingOperations();
      
      // Reîncărcare operațiuni în așteptare
      const updatedPendingOps = getPendingOperations();
      setPendingOperations(updatedPendingOps);
      
      // Reîncărcare date din localStorage
      const localData = getLocalStudents();
      setData(localData);
      
      return true;
    } catch (error) {
      console.error('Eroare la sincronizarea datelor:', error);
      return false;
    }
  };

  // Adăugare element
  const addItem = async (item) => {
    if (isOffline) {
      // Adăugare în localStorage
      const newItem = addLocalStudent(item);
      
      // Adăugare în state
      setData(prevData => [...prevData, newItem]);
      
      // Adăugare operațiune în așteptare
      addPendingOperation('create', newItem);
      
      // Actualizare operațiuni în așteptare în state
      const updatedPendingOps = getPendingOperations();
      setPendingOperations(updatedPendingOps);
      
      return newItem;
    } else {
      // Adăugare directă în state (presupunem că API-ul va fi apelat separat)
      const newItem = { ...item, id: Date.now().toString() };
      setData(prevData => [...prevData, newItem]);
      return newItem;
    }
  };

  // Actualizare element
  const updateItem = async (id, updatedData) => {
    if (isOffline) {
      // Actualizare în localStorage
      const updatedItem = updateLocalStudent(id, updatedData);
      
      if (updatedItem) {
        // Actualizare în state
        setData(prevData => 
          prevData.map(item => 
            (item.id === id || item.localId === id) ? updatedItem : item
          )
        );
        
        // Adăugare operațiune în așteptare
        addPendingOperation('update', updatedItem);
        
        // Actualizare operațiuni în așteptare în state
        const updatedPendingOps = getPendingOperations();
        setPendingOperations(updatedPendingOps);
        
        return updatedItem;
      }
      
      return null;
    } else {
      // Actualizare directă în state (presupunem că API-ul va fi apelat separat)
      setData(prevData => 
        prevData.map(item => 
          item.id === id ? { ...item, ...updatedData } : item
        )
      );
      
      return { ...data.find(item => item.id === id), ...updatedData };
    }
  };

  // Ștergere element
  const deleteItem = async (id) => {
    if (isOffline) {
      // Ștergere din localStorage
      const success = deleteLocalStudent(id);
      
      if (success) {
        // Ștergere din state
        setData(prevData => 
          prevData.filter(item => item.id !== id && item.localId !== id)
        );
        
        // Adăugare operațiune în așteptare
        addPendingOperation('delete', { id });
        
        // Actualizare operațiuni în așteptare în state
        const updatedPendingOps = getPendingOperations();
        setPendingOperations(updatedPendingOps);
        
        return true;
      }
      
      return false;
    } else {
      // Ștergere directă din state (presupunem că API-ul va fi apelat separat)
      setData(prevData => prevData.filter(item => item.id !== id));
      return true;
    }
  };

  return {
    data,
    setData,
    isOffline,
    pendingOperations,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    syncData
  };
};

export default useOfflineData; 