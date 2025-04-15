// Serviciu pentru gestionarea conexiunii WebSocket și actualizărilor în timp real

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000;

// Listeneri pentru evenimente
const listeners = {
    studentUpdate: [],
    studentAdded: [],
    studentRemoved: [],
    studentEdited: [],
    connectionStatus: []
};

// Funcție pentru inițializarea conexiunii WebSocket
export const initializeWebSocket = () => {
    if (socket) {
        return;
    }

    try {
        // Înlocuiți cu URL-ul real al serverului WebSocket
        socket = new WebSocket('ws://localhost:8080/ws/students');

        socket.onopen = () => {
            console.log('WebSocket conectat');
            reconnectAttempts = 0;
            notifyConnectionStatus(true);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                handleWebSocketMessage(data);
            } catch (error) {
                console.error('Eroare la procesarea mesajului WebSocket:', error);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket deconectat');
            notifyConnectionStatus(false);
            attemptReconnect();
        };

        socket.onerror = (error) => {
            console.error('Eroare WebSocket:', error);
            notifyConnectionStatus(false);
        };
    } catch (error) {
        console.error('Eroare la inițializarea WebSocket:', error);
        notifyConnectionStatus(false);
    }
};

// Funcție pentru încercarea reconectării
const attemptReconnect = () => {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.log('Număr maxim de încercări de reconectare atins');
        return;
    }

    reconnectAttempts++;
    console.log(`Încercare de reconectare ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);

    setTimeout(() => {
        initializeWebSocket();
    }, RECONNECT_DELAY);
};

// Funcție pentru procesarea mesajelor WebSocket
const handleWebSocketMessage = (data) => {
    switch (data.type) {
        case 'STUDENT_UPDATE':
            notifyListeners('studentUpdate', data.students);
            break;
        case 'STUDENT_ADDED':
            notifyListeners('studentAdded', data.student);
            break;
        case 'STUDENT_REMOVED':
            notifyListeners('studentRemoved', data.studentId);
            break;
        case 'STUDENT_EDITED':
            notifyListeners('studentEdited', data.student);
            break;
        default:
            console.warn('Tip de mesaj necunoscut:', data.type);
    }
};

// Funcție pentru notificarea listenerilor
const notifyListeners = (eventType, data) => {
    if (listeners[eventType]) {
        listeners[eventType].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Eroare la notificarea listenerului pentru ${eventType}:`, error);
            }
        });
    }
};

// Funcție pentru notificarea stării conexiunii
const notifyConnectionStatus = (isConnected) => {
    listeners.connectionStatus.forEach(callback => {
        try {
            callback(isConnected);
        } catch (error) {
            console.error('Eroare la notificarea stării conexiunii:', error);
        }
    });
};

// Funcție pentru adăugarea unui listener
export const addListener = (eventType, callback) => {
    if (listeners[eventType]) {
        listeners[eventType].push(callback);
    }
};

// Funcție pentru eliminarea unui listener
export const removeListener = (eventType, callback) => {
    if (listeners[eventType]) {
        listeners[eventType] = listeners[eventType].filter(cb => cb !== callback);
    }
};

// Funcție pentru închiderea conexiunii WebSocket
export const closeWebSocket = () => {
    if (socket) {
        socket.close();
        socket = null;
    }
};

// Funcție pentru verificarea stării conexiunii
export const isWebSocketConnected = () => {
    return socket && socket.readyState === WebSocket.OPEN;
};

// Funcție pentru trimiterea unui mesaj prin WebSocket
export const sendWebSocketMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
        return true;
    }
    return false;
}; 