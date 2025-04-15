// Serviciu pentru încărcarea fișierelor mari
const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
const API_URL = 'http://localhost:8080/api/files';

export const uploadFile = async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Eroare la încărcarea fișierului');
        }

        const fileName = await response.text();
        onProgress(100);
        return fileName;
    } catch (error) {
        console.error('Eroare la încărcare:', error);
        throw error;
    }
};

export const downloadFile = async (fileName, onProgress) => {
    try {
        const response = await fetch(`${API_URL}/download/${fileName}`);
        
        if (!response.ok) {
            throw new Error('Eroare la descărcarea fișierului');
        }

        const contentLength = response.headers.get('Content-Length');
        const total = parseInt(contentLength, 10);
        let loaded = 0;

        const reader = response.body.getReader();
        const chunks = [];

        while (true) {
            const {done, value} = await reader.read();
            
            if (done) {
                break;
            }

            chunks.push(value);
            loaded += value.length;
            onProgress((loaded / total) * 100);
        }

        const blob = new Blob(chunks);
        return blob;
    } catch (error) {
        console.error('Eroare la descărcare:', error);
        throw error;
    }
}; 