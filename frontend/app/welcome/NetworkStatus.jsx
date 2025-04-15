import React, { useState, useEffect } from 'react';
import { getNetworkStatus, checkServerAvailability } from './networkService';

const NetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Verifică starea inițială
        setIsOnline(navigator.onLine);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-md ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
        } text-white font-semibold`}>
            {isOnline ? 'Conectat' : 'Deconectat'}
        </div>
    );
};

export default NetworkStatus; 