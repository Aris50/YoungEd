// Serviciu pentru gestionarea stării offline și sincronizarea datelor

// Starea conexiunii
let isOnline = navigator.onLine;
let isServerAvailable = true;
let lastServerCheck = Date.now();
let serverCheckInterval = 10000; // 10 secunde între verificări

// Listener pentru schimbările stării conexiunii
window.addEventListener('online', () => {
  console.log('Conexiune la internet detectată');
  isOnline = true;
  // Verifică imediat starea serverului când revenim online
  checkServerAvailability();
  // Încearcă sincronizarea operațiunilor în așteptare
  syncPendingOperations();
});

window.addEventListener('offline', () => {
  console.log('Conexiune la internet pierdută');
  isOnline = false;
  isServerAvailable = false; // Nu putem verifica serverul fără conexiune
});

// Verificare disponibilitate server
export const checkServerAvailability = async () => {
  // Dacă nu suntem online, nu putem verifica serverul
  if (!isOnline) {
    console.log('Nu se poate verifica serverul - fără conexiune la internet');
    isServerAvailable = false;
    return false;
  }
  
  // Verifică dacă a trecut suficient timp de la ultima verificare
  const now = Date.now();
  if (now - lastServerCheck < serverCheckInterval) {
    console.log('Verificare server ratată - prea frecventă');
    return isServerAvailable;
  }
  
  lastServerCheck = now;
  
  try {
    console.log('Verificare disponibilitate server...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('/api/health', { 
      method: 'HEAD',
      cache: 'no-cache',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    isServerAvailable = response.ok;
    console.log(`Server ${isServerAvailable ? 'disponibil' : 'indisponibil'}`);
    return isServerAvailable;
  } catch (error) {
    console.error('Eroare la verificarea serverului:', error);
    isServerAvailable = false;
    return false;
  }
};

// Verificare starea conexiunii
export const getConnectionStatus = () => {
  // Verifică dacă navigator.onLine reflectă starea reală
  const browserOnline = navigator.onLine;
  
  // Actualizează starea dacă diferă
  if (browserOnline !== isOnline) {
    console.log(`Starea conexiunii actualizată: ${browserOnline ? 'online' : 'offline'}`);
    isOnline = browserOnline;
  }
  
  return {
    isOnline,
    isServerAvailable,
    isFullyOffline: !isOnline || !isServerAvailable,
    reason: !isOnline ? 'internet' : !isServerAvailable ? 'server' : 'online'
  };
};

// Operațiuni în așteptare
const pendingOperations = {
  create: [],
  update: [],
  delete: []
};

// Salvare operațiuni în localStorage
const savePendingOperations = () => {
  localStorage.setItem('pendingOperations', JSON.stringify(pendingOperations));
};

// Încărcare operațiuni din localStorage
const loadPendingOperations = () => {
  const saved = localStorage.getItem('pendingOperations');
  if (saved) {
    Object.assign(pendingOperations, JSON.parse(saved));
  }
};

// Inițializare la încărcarea paginii
loadPendingOperations();

// Adăugare operațiune în așteptare
export const addPendingOperation = (type, data) => {
  pendingOperations[type].push({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    data
  });
  savePendingOperations();
};

// Sincronizare operațiuni în așteptare
export const syncPendingOperations = async () => {
  if (!isOnline || !isServerAvailable) {
    console.log('Nu se pot sincroniza operațiunile - conexiune indisponibilă');
    return;
  }
  
  console.log('Începere sincronizare operațiuni în așteptare...');
  
  // Sincronizare operațiuni de creare
  for (const operation of pendingOperations.create) {
    try {
      console.log('Sincronizare operațiune de creare:', operation);
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(operation.data)
      });
      // Eliminare operațiune după sincronizare
      pendingOperations.create = pendingOperations.create.filter(op => op.id !== operation.id);
      console.log('Operațiune de creare sincronizată cu succes');
    } catch (error) {
      console.error('Eroare la sincronizarea operațiunii de creare:', error);
    }
  }
  
  // Sincronizare operațiuni de actualizare
  for (const operation of pendingOperations.update) {
    try {
      console.log('Sincronizare operațiune de actualizare:', operation);
      await fetch(`/api/students/${operation.data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(operation.data)
      });
      // Eliminare operațiune după sincronizare
      pendingOperations.update = pendingOperations.update.filter(op => op.id !== operation.id);
      console.log('Operațiune de actualizare sincronizată cu succes');
    } catch (error) {
      console.error('Eroare la sincronizarea operațiunii de actualizare:', error);
    }
  }
  
  // Sincronizare operațiuni de ștergere
  for (const operation of pendingOperations.delete) {
    try {
      console.log('Sincronizare operațiune de ștergere:', operation);
      await fetch(`/api/students/${operation.data.id}`, {
        method: 'DELETE'
      });
      // Eliminare operațiune după sincronizare
      pendingOperations.delete = pendingOperations.delete.filter(op => op.id !== operation.id);
      console.log('Operațiune de ștergere sincronizată cu succes');
    } catch (error) {
      console.error('Eroare la sincronizarea operațiunii de ștergere:', error);
    }
  }
  
  // Salvare starea actualizată
  savePendingOperations();
  console.log('Sincronizare operațiuni finalizată');
};

// Verificare periodică a stării serverului
setInterval(async () => {
  await checkServerAvailability();
}, 30000);

// Verificare inițială
checkServerAvailability(); 