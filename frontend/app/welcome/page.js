'use client';
import React from 'react';
import StudentTable from './studentTable';

const sampleStudents = [
    { id: '1', name: 'Alice', age: 14, gender: 'Female', grade: '8th' },
    { id: '2', name: 'Bob', age: 15, gender: 'Male', grade: '9th' }
];

export default function Page() {
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
                <StudentTable students={sampleStudents} />
            </div>
        </div>
    );
}