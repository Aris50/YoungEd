import React, { useState } from 'react';
import { uploadFile, downloadFile } from './fileUploadService';

const FileUpload = () => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileId, setFileId] = useState(null);
    const [error, setError] = useState(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setError(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Vă rugăm să selectați un fișier');
            return;
        }

        try {
            const id = await uploadFile(selectedFile, (progress) => {
                setUploadProgress(progress);
            });
            setFileId(id);
            setError(null);
        } catch (err) {
            setError('Eroare la încărcarea fișierului');
            console.error(err);
        }
    };

    const handleDownload = async () => {
        if (!fileId) {
            setError('Nu există fișier pentru descărcare');
            return;
        }

        try {
            const blob = await downloadFile(fileId, (progress) => {
                setDownloadProgress(progress);
            });
            
            // Creăm un link pentru descărcare
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = selectedFile.name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            setError(null);
        } catch (err) {
            setError('Eroare la descărcarea fișierului');
            console.error(err);
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Încărcare Fișiere</h2>
            
            <div className="mb-4">
                <input
                    type="file"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />
            </div>

            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <button
                    onClick={handleUpload}
                    disabled={!selectedFile}
                    className="px-4 py-2 bg-blue-500 text-white rounded
                        hover:bg-blue-600 disabled:bg-gray-400
                        disabled:cursor-not-allowed"
                >
                    Încarcă Fișier
                </button>

                {uploadProgress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                )}

                {fileId && (
                    <>
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-green-500 text-white rounded
                                hover:bg-green-600"
                        >
                            Descarcă Fișier
                        </button>

                        {downloadProgress > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-green-600 h-2.5 rounded-full"
                                    style={{ width: `${downloadProgress}%` }}
                                ></div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FileUpload; 