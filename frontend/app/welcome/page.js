'use client';
import React from 'react';
import StudentTable from './studentTable';

const sampleStudents = [
    { id: '1', name: 'Alice', age: 14, gender: 'Female', grade: '8th' },
    { id: '2', name: 'Bob', age: 15, gender: 'Male', grade: '9th' }
];

export default function Page() {
    return (
        <div style={{ padding: '2rem' }}>
            <h1>Student Management</h1>
            <StudentTable students={sampleStudents} />
        </div>
    );
}