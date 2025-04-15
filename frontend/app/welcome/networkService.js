// Serviciu pentru gestionarea stării rețelei și sincronizarea offline

// Starea rețelei
let isOnline = navigator.onLine;
let isServerAvailable = true;

// Lista de operații în așteptare pentru sincronizare
let pendingOperations = JSON.parse(localStorage.getItem('pendingOperations') || '[]');

// Listener pentru schimbările stării rețelei
window.addEventListener('online', () => {
    isOnline = true;
    syncPendingOperations();
});

window.addEventListener('offline', () => {
    isOnline = false;
});

// Funcție pentru verificarea disponibilității serverului
export const checkServerAvailability = async () => {
    try {
        const response = await fetch('/api/health', { 
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        isServerAvailable = response.ok;
        return isServerAvailable;
    } catch (error) {
        isServerAvailable = false;
        return false;
    }
};

// Funcție pentru adăugarea unei operații în așteptare
export const addPendingOperation = (operation) => {
    pendingOperations.push({
        ...operation,
        timestamp: Date.now()
    });
    localStorage.setItem('pendingOperations', JSON.stringify(pendingOperations));
};

// Funcție pentru sincronizarea operațiilor în așteptare
export const syncPendingOperations = async () => {
    if (!isOnline || !isServerAvailable || pendingOperations.length === 0) {
        return;
    }

    const operations = [...pendingOperations];
    const failedOperations = [];

    for (const operation of operations) {
        try {
            // Aici vom implementa logica de sincronizare cu serverul
            // De exemplu:
            // await fetch('/api/students', {
            //     method: operation.method,
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(operation.data)
            // });
            
            // Dacă operația reușește, o eliminăm din lista de așteptare
            pendingOperations = pendingOperations.filter(op => op.timestamp !== operation.timestamp);
        } catch (error) {
            failedOperations.push(operation);
        }
    }

    // Actualizăm lista de operații în așteptare
    localStorage.setItem('pendingOperations', JSON.stringify(pendingOperations));
    
    return {
        synced: operations.length - failedOperations.length,
        failed: failedOperations.length
    };
};

// Funcție pentru obținerea stării rețelei
export const getNetworkStatus = () => {
    return {
        isOnline,
        isServerAvailable,
        pendingOperationsCount: pendingOperations.length
    };
};

// Funcție pentru ștergerea operațiilor sincronizate
export const clearSyncedOperations = () => {
    pendingOperations = [];
    localStorage.setItem('pendingOperations', JSON.stringify(pendingOperations));
}; 