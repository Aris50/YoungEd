import React, { useState, useMemo } from 'react';
import StudentForm from './StudentForm';
import GradeChart from './GradeChart';
import {addStudent, removeStudent, editStudent, filterStudents, sortStudents, validateStudent, categorizeStudentsByAge} from './studentUtils';

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
    const [showChart, setShowChart] = useState(false);
    const [updateTrigger, setUpdateTrigger] = useState(0);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

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

    const categorizedList = useMemo(() => {
        return categorizeStudentsByAge(studentList);
    }, [studentList]);

    const filteredList = useMemo(() => {
        return filterStudents(categorizedList, filterCriteria);
    }, [categorizedList, filterCriteria]);

    // Calculate pagination
    const totalItems = filteredList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredList.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    function handleSort(field) {
        if (sortField === field) {
            // Toggle direction
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    }

    const handleUpdateChart = async () => {
        try {
            if (!showChart) {
                setShowChart(true);
            }
            // Increment update trigger to force chart update
            setUpdateTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Error updating chart:', error);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
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
                        cursor: 'pointer'
                    }}
                >
                    Add Student
                </button>
                <button 
                    onClick={handleUpdateChart}
                    style={{
                        padding: '0.75rem',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Update Grade Chart
                </button>
            </div>
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
                <>
                    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div>
                            <label htmlFor="itemsPerPage" style={{ marginRight: '0.5rem' }}>Students per page:</label>
                            <select
                                id="itemsPerPage"
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: '5px',
                                    border: '1px solid #ddd'
                                }}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                        <div>
                            <span>Page {currentPage} of {totalPages}</span>
                        </div>
                    </div>

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
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>
                                    Age Category
                                </th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortStudents(currentItems, sortField, sortDirection).map((student) => (
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
                                    <td style={{ 
                                        padding: '0.75rem',
                                        color: student.ageCategory === 'Youngest 33%' ? '#28a745' : 
                                               student.ageCategory === 'Oldest 33%' ? '#dc3545' : '#ffc107',
                                        fontWeight: '600'
                                    }}>
                                        {student.ageCategory}
                                    </td>
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

                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: '0.5rem',
                        marginTop: '1rem'
                    }}>
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: currentPage === 1 ? '#ccc' : '#212121',
                                color: '#FFC107',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            First
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: currentPage === 1 ? '#ccc' : '#212121',
                                color: '#FFC107',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: currentPage === page ? '#FFC107' : '#212121',
                                    color: currentPage === page ? '#212121' : '#FFC107',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: currentPage === totalPages ? '#ccc' : '#212121',
                                color: '#FFC107',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Next
                        </button>
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: currentPage === totalPages ? '#ccc' : '#212121',
                                color: '#FFC107',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Last
                        </button>
                    </div>
                </>
            )}
            {showChart && <GradeChart students={studentList} updateTrigger={updateTrigger} />}
        </div>
    );
}