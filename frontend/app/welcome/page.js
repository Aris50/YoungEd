'use client';
import React, { useState, useEffect } from 'react';
import StudentTable from './studentTable';
import mockStudents from './mockStudents';
import ConnectionStatus from './ConnectionStatus';
import useOfflineData from './OfflineDataManager';

export default function Page() {
    const [students, setStudents] = useState(mockStudents);
    const { 
        data: offlineStudents, 
        isOffline, 
        pendingOperations,
        addItem: addStudent,
        updateItem: updateStudent,
        deleteItem: deleteStudent,
        syncData
    } = useOfflineData(mockStudents);

    // Actualizare studenți când se schimbă starea offline
    useEffect(() => {
        setStudents(offlineStudents);
    }, [offlineStudents]);

    // Funcții pentru gestionarea studenților
    const handleAddStudent = async (student) => {
        const newStudent = await addStudent(student);
        return newStudent;
    };

    const handleUpdateStudent = async (id, updatedData) => {
        const updatedStudent = await updateStudent(id, updatedData);
        return updatedStudent;
    };

    const handleDeleteStudent = async (id) => {
        const success = await deleteStudent(id);
        return success;
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            flexDirection: 'column',
            backgroundColor: '#FFC107',
            color: '#212121',
            fontFamily: 'Poppins, sans-serif',
            padding: '20px'
        }}>
            <ConnectionStatus />
            
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '800px'
            }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                    color: '#212121'
                }}>Student Management</h1>
                
                {isOffline && (
                    <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '10px',
                        borderRadius: '5px',
                        marginBottom: '20px',
                        border: '1px solid #dee2e6',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <span style={{ fontWeight: 'bold' }}>Mod offline activ</span>
                            <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>
                                Modificările vor fi sincronizate când conexiunea este restaurată.
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div>Operațiuni în așteptare:</div>
                            <div style={{ fontWeight: 'bold' }}>
                                {pendingOperations.create.length + 
                                 pendingOperations.update.length + 
                                 pendingOperations.delete.length}
                            </div>
                        </div>
                    </div>
                )}
                
                <StudentTable 
                    students={students} 
                    onAddStudent={handleAddStudent}
                    onUpdateStudent={handleUpdateStudent}
                    onDeleteStudent={handleDeleteStudent}
                    isOffline={isOffline}
                />
            </div>
        </div>
    );
}