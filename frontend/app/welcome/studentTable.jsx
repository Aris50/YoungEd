import React, { useState, useMemo } from 'react';
import StudentForm from './StudentForm';
import {addStudent, removeStudent, editStudent, filterStudents, sortStudents, validateStudent} from './studentUtils';

export default function StudentTable({ students }) {
    const [studentList, setStudentList] = useState(students);
    const [formData, setFormData] = useState({ name: '', age: '', gender: '', grade: '' });
    const [isAdding, setIsAdding] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [filterCriteria, setFilterCriteria] = useState({
        name: '',
        age: '',
        grade: '',
        gender: ''
    });
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [errors, setErrors] = useState({});

    function handleSaveStudent() {
        const validationErrors = validateStudent(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            const errorMessage = Object.values(validationErrors).join('\n');
            window.confirm('Please fix the following errors:\n\n' + errorMessage);
            return; // Don't proceed
        }

        if (editingStudent) {
            const updatedList = editStudent(studentList, formData, editingStudent.id);
            setStudentList(updatedList);
        } else {
            const updatedList = addStudent(studentList, formData);
            setStudentList(updatedList);
        }
        setFormData({ name: '', age: '', gender: '', grade: '' });
        setIsAdding(false);
        setEditingStudent(null);
        setErrors({});
    }

    function handleRemoveStudent(studentId) {
        const updatedList = removeStudent(studentList, studentId);
        setStudentList(updatedList);
    }

    function handleEditStudent(student) {
        setFormData({
            name: student.name,
            age: student.age,
            gender: student.gender,
            grade: student.grade
        });
        setEditingStudent(student);
        setErrors({});
    }

    function handleCancel() {
        setFormData({ name: '', age: '', gender: '', grade: '' });
        setIsAdding(false);
        setEditingStudent(null);
        setErrors({});
    }

    function clearFilters() {
        setFilterCriteria({ name: '', age: '', grade: '', gender: '' });
    }

    const filteredList = useMemo(() => {
        return filterStudents(studentList, filterCriteria);
    }, [studentList, filterCriteria]);

    function handleSort(field) {
        if (sortField === field) {
            // Toggle direction
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    }

    return (
        <div>
            <button 
                onClick={() => setIsAdding(true)}
                style={{
                    padding: '0.75rem',
                    backgroundColor: '#212121',
                    color: '#FFC107',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '1rem'
                }}
            >
                Add Student
            </button>
            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Filter by name"
                    value={filterCriteria.name}
                    onChange={(e) =>
                        setFilterCriteria({ ...filterCriteria, name: e.target.value })
                    }
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        fontSize: '1rem',
                        marginBottom: '0.5rem'
                    }}
                />
                <input
                    type="number"
                    placeholder="Filter by age"
                    value={filterCriteria.age}
                    onChange={(e) =>
                        setFilterCriteria({ ...filterCriteria, age: e.target.value })
                    }
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        fontSize: '1rem',
                        marginBottom: '0.5rem'
                    }}
                />
                <select
                    value={filterCriteria.grade}
                    onChange={(e) =>
                        setFilterCriteria({ ...filterCriteria, grade: e.target.value })
                    }
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        fontSize: '1rem',
                        marginBottom: '0.5rem'
                    }}
                >
                    <option value="">All Grades</option>
                    {['5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map((g) => (
                        <option key={g} value={g}>
                            {g}
                        </option>
                    ))}
                </select>
                <select
                    value={filterCriteria.gender}
                    onChange={(e) =>
                        setFilterCriteria({ ...filterCriteria, gender: e.target.value })
                    }
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        fontSize: '1rem',
                        marginBottom: '0.5rem'
                    }}
                >
                    <option value="">All Genders</option>
                    {['Male', 'Female', 'Other'].map((g) => (
                        <option key={g} value={g}>
                            {g}
                        </option>
                    ))}
                </select>
                <button 
                    onClick={clearFilters}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#FFC107',
                        color: '#212121',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginBottom: '1rem'
                    }}
                >
                    Clear Filters
                </button>
            </div>

            {(isAdding || editingStudent) && (
                <StudentForm
                    formData={formData}
                    setFormData={setFormData}
                    onSave={handleSaveStudent}
                    onCancel={handleCancel}
                    errors={errors}
                />
            )}
            {filteredList.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>No students found.</p>
            ) : (
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginTop: '1rem'
                }}>
                    <thead>
                        <tr style={{
                            backgroundColor: '#212121',
                            color: '#FFC107'
                        }}>
                            <th 
                                onClick={() => handleSort('name')}
                                style={{
                                    padding: '0.75rem',
                                    textAlign: 'left',
                                    cursor: 'pointer'
                                }}
                            >
                                Name {sortField === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th 
                                onClick={() => handleSort('age')}
                                style={{
                                    padding: '0.75rem',
                                    textAlign: 'left',
                                    cursor: 'pointer'
                                }}
                            >
                                Age {sortField === 'age' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th 
                                onClick={() => handleSort('gender')}
                                style={{
                                    padding: '0.75rem',
                                    textAlign: 'left',
                                    cursor: 'pointer'
                                }}
                            >
                                Gender {sortField === 'gender' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th 
                                onClick={() => handleSort('grade')}
                                style={{
                                    padding: '0.75rem',
                                    textAlign: 'left',
                                    cursor: 'pointer'
                                }}
                            >
                                Grade {sortField === 'grade' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortStudents(filteredList, sortField, sortDirection).map((student) => (
                            <tr 
                                key={student.id}
                                style={{
                                    borderBottom: '1px solid #ddd',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            >
                                <td data-testid={`student-name-${student.id}`} style={{ padding: '0.75rem' }}>{student.name}</td>
                                <td data-testid={`student-age-${student.id}`} style={{ padding: '0.75rem' }}>{student.age}</td>
                                <td data-testid={`student-gender-${student.id}`} style={{ padding: '0.75rem' }}>{student.gender}</td>
                                <td data-testid={`student-grade-${student.id}`} style={{ padding: '0.75rem' }}>{student.grade}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <button 
                                        onClick={() => handleRemoveStudent(student.id)}
                                        data-testid={`remove-student-${student.id}`}
                                        style={{
                                            padding: '0.5rem',
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            marginRight: '0.5rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Remove
                                    </button>
                                    <button 
                                        onClick={() => handleEditStudent(student)}
                                        data-testid={`edit-student-${student.id}`}
                                        style={{
                                            padding: '0.5rem',
                                            backgroundColor: '#212121',
                                            color: '#FFC107',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}