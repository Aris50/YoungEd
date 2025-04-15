import React, { useState, useMemo, useEffect } from 'react';
import StudentForm from './StudentForm';
import GradeChart from './GradeChart';
import {addStudent, removeStudent, editStudent, filterStudents, sortStudents, validateStudent, categorizeStudentsByAge} from './studentUtils';
import { useInView } from 'react-intersection-observer';

export default function StudentTable({ students }) {
    const [studentList, setStudentList] = useState(students);
    const [formData, setFormData] = useState({ name: '', age: '', gender: '', grade: '' });
    const [editingStudent, setEditingStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [displayedStudents, setDisplayedStudents] = useState([]);
    const { ref, inView } = useInView({
        threshold: 0,
    });

    // Filtrare studenți
    const filteredStudents = useMemo(() => {
        return filterStudents(studentList, searchTerm);
    }, [studentList, searchTerm]);

    // Sortare studenți
    const sortedStudents = useMemo(() => {
        return sortStudents(filteredStudents, sortField, sortDirection);
    }, [filteredStudents, sortField, sortDirection]);

    // Inițializare studenți afișați
    useEffect(() => {
        const startIndex = 0;
        const endIndex = itemsPerPage;
        setDisplayedStudents(sortedStudents.slice(startIndex, endIndex));
        setCurrentPage(1);
    }, [sortedStudents, itemsPerPage]);

    // Gestionare încărcare mai mulți studenți
    useEffect(() => {
        if (inView && displayedStudents.length < sortedStudents.length) {
            const nextPage = currentPage + 1;
            const startIndex = (nextPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const nextStudents = sortedStudents.slice(startIndex, endIndex);
            
            if (nextStudents.length > 0) {
                setDisplayedStudents(prev => [...prev, ...nextStudents]);
                setCurrentPage(nextPage);
            }
        }
    }, [inView, sortedStudents, currentPage, itemsPerPage]);

    function handleSaveStudent() {
        const validationErrors = validateStudent(formData);
        if (Object.keys(validationErrors).length > 0) {
            const errorMessage = Object.values(validationErrors).join('\n');
            window.confirm('Vă rugăm să corectați următoarele erori:\n\n' + errorMessage);
            return;
        }

        if (editingStudent) {
            const updatedList = editStudent(studentList, formData, editingStudent.id);
            setStudentList(updatedList);
        } else {
            const updatedList = addStudent(studentList, formData);
            setStudentList(updatedList);
        }
        setFormData({ name: '', age: '', gender: '', grade: '' });
        setEditingStudent(null);
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
    }

    function handleSort(field) {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    }

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <StudentForm
                    formData={formData}
                    setFormData={setFormData}
                    onSave={handleSaveStudent}
                    editingStudent={editingStudent}
                />
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <GradeChart students={studentList} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Caută studenți..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '0.5rem',
                        width: '100%',
                        borderRadius: '5px',
                        border: '1px solid #ddd'
                    }}
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    style={{
                        padding: '0.5rem',
                        borderRadius: '5px',
                        border: '1px solid #ddd'
                    }}
                >
                    <option value="5">5 studenți per pagină</option>
                    <option value="10">10 studenți per pagină</option>
                    <option value="20">20 studenți per pagină</option>
                </select>
            </div>

            <div style={{ overflowX: 'auto' }}>
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
                        {displayedStudents.map((student) => (
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
                {/* Element pentru detectarea sfârșitului listei */}
                {displayedStudents.length < sortedStudents.length && (
                    <div ref={ref} style={{ height: '40px' }} />
                )}
            </div>
        </div>
    );
} 