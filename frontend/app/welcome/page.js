"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const filterStudents = (students, searchTerm, filterCriteria) => {
    let filtered = [...students];

    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(student =>
            student.name.toLowerCase().includes(term) ||
            student.age.toString().includes(term) ||
            student.email.toLowerCase().includes(term) ||
            student.grade.toLowerCase().includes(term) ||
            student.subject.toLowerCase().includes(term)
        );
    }

    if (filterCriteria.age) {
        filtered = filtered.filter(student =>
            student.age === parseInt(filterCriteria.age)
        );
    }

    if (filterCriteria.grade) {
        filtered = filtered.filter(student =>
            student.grade === filterCriteria.grade
        );
    }

    if (filterCriteria.subject) {
        filtered = filtered.filter(student =>
            student.subject === filterCriteria.subject
        );
    }

    return filtered;
};

export const sortStudents = (students, sortField = 'name', sortDirection = 'asc') => {
    return [...students].sort((a, b) => {
        if (sortField === 'grade') {
            const gradeA = parseInt(a[sortField]);
            const gradeB = parseInt(b[sortField]);
            return sortDirection === 'asc' ? gradeA - gradeB : gradeB - gradeA;
        }
        return sortDirection === 'asc'
            ? (a[sortField] > b[sortField] ? 1 : -1)
            : (a[sortField] < b[sortField] ? 1 : -1);
    });
};

export default function Welcome() {
    const [visible, setVisible] = useState(false);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [editingStudent, setEditingStudent] = useState(null);
    const [errors, setErrors] = useState({});
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState({
        age: '',
        grade: '',
        subject: ''
    });
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const router = useRouter();

    const subjects = [
        'Mathematics', 'Science', 'English', 'History', 'Geography',
        'Physics', 'Chemistry', 'Biology', 'Literature', 'Computer Science'
    ];

    useEffect(() => {
        setVisible(true);
        // Date de exemplu
        const initialStudents = [
            {
                id: 1,
                name: 'John Doe',
                age: 15,
                email: 'john.doe@example.com',
                grade: '9th',
                subject: 'Mathematics',
                photo: 'https://example.com/default-photo.png'
            },
            {
                id: 2,
                name: 'Jane Smith',
                age: 14,
                email: 'jane.smith@example.com',
                grade: '8th',
                subject: 'Science',
                photo: 'https://i.pravatar.cc/150?img=2'
            },
            {
                id: 3,
                name: 'Mike Johnson',
                age: 16,
                email: 'mike.johnson@example.com',
                grade: '10th',
                subject: 'English',
                photo: 'https://i.pravatar.cc/150?img=3'
            },
        ];
        setStudents(initialStudents);
        setFilteredStudents(initialStudents);
    }, []);

    const validateStudent = (student) => {
        const newErrors = {};

        if (!student.name || student.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters long';
        }

        if (!student.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        const age = parseInt(student.age);
        if (isNaN(age) || age < 5 || age > 18) {
            newErrors.age = 'Age must be between 5 and 18';
        }

        if (!student.grade || !/^(5th|6th|7th|8th|9th|10th|11th|12th)$/.test(student.grade)) {
            newErrors.grade = 'Grade must be between 5th and 12th';
        }

        if (!student.subject) {
            newErrors.subject = 'Please select a subject';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        const filtered = filterStudents(students, searchTerm, filterCriteria);
        setFilteredStudents(filtered);
    }, [searchTerm, filterCriteria, students]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (field, value) => {
        setFilterCriteria(prev => ({
            ...prev,
            [field]: value
        }));
        setShowFilterOptions(false);
    };

    const clearFilters = () => {
        setFilterCriteria({
            age: '',
            grade: '',
            subject: ''
        });
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
        setShowSortOptions(false);
    };

    const handleAdd = () => {
        if (editingStudent) {
            if (!validateStudent(editingStudent)) {
                return;
            }
            handleSave();
        }
        const newStudent = {
            id: students.length + 1,
            name: '',
            age: '',
            email: '',
            grade: '5th',
            subject: '',
            photo: `https://example.com/default-photo.png`
        };
        setStudents([...students, newStudent]);
        setFilteredStudents([...filteredStudents, newStudent]);
        setEditingStudent(newStudent);
        setErrors({});
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setErrors({});
    };

    const handleSave = () => {
        if (validateStudent(editingStudent)) {
            const updatedStudents = students.map(student =>
                student.id === editingStudent.id ? editingStudent : student
            );
            setStudents(updatedStudents);
            setFilteredStudents(updatedStudents);
            setEditingStudent(null);
            setErrors({});
        }
    };

    const handleDelete = (id) => {
        setStudents(students.filter(student => student.id !== id));
        setFilteredStudents(filteredStudents.filter(student => student.id !== id));
        if (editingStudent && editingStudent.id === id) {
            setEditingStudent(null);
        }
    };

    const handleInfo = (student) => {
        setSelectedStudent(student);
        setShowInfoModal(true);
    };

    const sortedStudents = sortStudents(filteredStudents, sortField, sortDirection);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#FFC107',
            color: '#212121',
            fontFamily: 'Poppins, sans-serif',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '15px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 1s ease, transform 1s ease'
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    marginBottom: '2rem',
                    color: '#212121',
                    textAlign: 'center'
                }}>Student Management Dashboard</h1>

                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '2rem',
                    flexWrap: 'wrap'
                }}>
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{
                            flex: '1',
                            minWidth: '200px',
                            padding: '0.75rem',
                            borderRadius: '5px',
                            border: '1px solid #ddd',
                            fontSize: '1rem'
                        }}
                    />
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowSortOptions(!showSortOptions)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#212121',
                                color: '#FFC107',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600',
                                transition: 'transform 0.2s ease'
                            }}
                            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                        >
                            Sort {sortField && `(${sortField} ${sortDirection === 'asc' ? '↑' : '↓'})`}
                        </button>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowFilterOptions(!showFilterOptions)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#212121',
                                color: '#FFC107',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600',
                                transition: 'transform 0.2s ease'
                            }}
                            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                        >
                            Filter
                        </button>
                        {showFilterOptions && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: '0',
                                backgroundColor: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                zIndex: 1000,
                                marginTop: '0.5rem',
                                padding: '1rem',
                                minWidth: '200px'
                            }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Age:</label>
                                    <input
                                        type="text"
                                        value={filterCriteria.age}
                                        onChange={e => handleFilterChange('age', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            borderRadius: '3px',
                                            border: '1px solid #ddd'
                                        }}
                                        placeholder="Enter age"
                                    />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Grade:</label>
                                    <select
                                        value={filterCriteria.grade}
                                        onChange={e => handleFilterChange('grade', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            borderRadius: '3px',
                                            border: '1px solid #ddd'
                                        }}
                                    >
                                        <option value="">All Grades</option>
                                        {['5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(grade => (
                                            <option key={grade} value={grade}>{grade}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Subject:</label>
                                    <select
                                        value={filterCriteria.subject}
                                        onChange={e => handleFilterChange('subject', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            borderRadius: '3px',
                                            border: '1px solid #ddd'
                                        }}
                                    >
                                        <option value="">All Subjects</option>
                                        {subjects.map(subject => (
                                            <option key={subject} value={subject}>{subject}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={clearFilters}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        backgroundColor: '#f44336',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '3px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleAdd}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#212121',
                            color: '#FFC107',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            transition: 'transform 0.2s ease'
                        }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    >
                        Add New Student
                    </button>
                </div>

                <div style={{
                    overflowX: 'auto'
                }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        marginTop: '1rem'
                    }}>
                        <thead>
                            <tr style={{
                                backgroundColor: '#f8f9fa',
                                borderBottom: '2px solid #ddd'
                            }}>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    userSelect: 'none'
                                }} onClick={() => handleSort('name')}>
                                    Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    userSelect: 'none'
                                }} onClick={() => handleSort('age')}>
                                    Age {sortField === 'age' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    userSelect: 'none'
                                }} onClick={() => handleSort('email')}>
                                    Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    userSelect: 'none'
                                }} onClick={() => handleSort('grade')}>
                                    Grade {sortField === 'grade' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    userSelect: 'none'
                                }} onClick={() => handleSort('subject')}>
                                    Subject {sortField === 'subject' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'left'
                                }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedStudents.map(student => (
                                <tr key={student.id} style={{
                                    borderBottom: '1px solid #ddd'
                                }}>
                                    <td style={{ padding: '1rem' }}>
                                        {editingStudent?.id === student.id ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={editingStudent.name}
                                                    onChange={e => setEditingStudent({...editingStudent, name: e.target.value})}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.5rem',
                                                        borderRadius: '3px',
                                                        border: errors.name ? '1px solid #f44336' : '1px solid #ddd'
                                                    }}
                                                />
                                                {errors.name && <div style={{ color: '#f44336', fontSize: '0.8rem' }}>{errors.name}</div>}
                                            </div>
                                        ) : student.name}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {editingStudent?.id === student.id ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={editingStudent.age}
                                                    onChange={e => {
                                                        const value = e.target.value;
                                                        if (value === '' || /^\d+$/.test(value)) {
                                                            setEditingStudent({...editingStudent, age: value});
                                                        }
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.5rem',
                                                        borderRadius: '3px',
                                                        border: errors.age ? '1px solid #f44336' : '1px solid #ddd'
                                                    }}
                                                />
                                                {errors.age && <div style={{ color: '#f44336', fontSize: '0.8rem' }}>{errors.age}</div>}
                                            </div>
                                        ) : student.age}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {editingStudent?.id === student.id ? (
                                            <div>
                                                <input
                                                    type="email"
                                                    value={editingStudent.email}
                                                    onChange={e => setEditingStudent({...editingStudent, email: e.target.value})}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.5rem',
                                                        borderRadius: '3px',
                                                        border: errors.email ? '1px solid #f44336' : '1px solid #ddd'
                                                    }}
                                                />
                                                {errors.email && <div style={{ color: '#f44336', fontSize: '0.8rem' }}>{errors.email}</div>}
                                            </div>
                                        ) : student.email}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {editingStudent?.id === student.id ? (
                                            <div>
                                                <select
                                                    value={editingStudent.grade}
                                                    onChange={e => setEditingStudent({...editingStudent, grade: e.target.value})}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.5rem',
                                                        borderRadius: '3px',
                                                        border: errors.grade ? '1px solid #f44336' : '1px solid #ddd'
                                                    }}
                                                >
                                                    {['5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(grade => (
                                                        <option key={grade} value={grade}>{grade}</option>
                                                    ))}
                                                </select>
                                                {errors.grade && <div style={{ color: '#f44336', fontSize: '0.8rem' }}>{errors.grade}</div>}
                                            </div>
                                        ) : student.grade}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {editingStudent?.id === student.id ? (
                                            <div>
                                                <select
                                                    value={editingStudent.subject}
                                                    onChange={e => setEditingStudent({...editingStudent, subject: e.target.value})}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.5rem',
                                                        borderRadius: '3px',
                                                        border: errors.subject ? '1px solid #f44336' : '1px solid #ddd'
                                                    }}
                                                >
                                                    <option value="">Select a subject</option>
                                                    {subjects.map(subject => (
                                                        <option key={subject} value={subject}>{subject}</option>
                                                    ))}
                                                </select>
                                                {errors.subject && <div style={{ color: '#f44336', fontSize: '0.8rem' }}>{errors.subject}</div>}
                                            </div>
                                        ) : student.subject}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {editingStudent?.id === student.id ? (
                                            <button
                                                onClick={handleSave}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    backgroundColor: '#4CAF50',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '3px',
                                                    cursor: 'pointer',
                                                    marginRight: '0.5rem'
                                                }}
                                            >
                                                Save
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleInfo(student)}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        backgroundColor: '#FF9800',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '3px',
                                                        cursor: 'pointer',
                                                        marginRight: '0.5rem'
                                                    }}
                                                >
                                                    Info
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(student)}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        backgroundColor: '#2196F3',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '3px',
                                                        cursor: 'pointer',
                                                        marginRight: '0.5rem'
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => handleDelete(student.id)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                backgroundColor: '#f44336',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '3px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info Modal */}
            {showInfoModal && selectedStudent && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '15px',
                        width: '90%',
                        maxWidth: '500px',
                        position: 'relative',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                        <button
                            onClick={() => setShowInfoModal(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                color: '#666'
                            }}
                        >
                            ×
                        </button>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginBottom: '2rem'
                        }}>
                            <img
                                src={selectedStudent.photo}
                                alt={selectedStudent.name}
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginBottom: '1rem',
                                    border: '3px solid #FFC107',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            />
                            <h2 style={{
                                fontSize: '1.8rem',
                                color: '#212121',
                                textAlign: 'center',
                                margin: '0'
                            }}>{selectedStudent.name}</h2>
                        </div>
                        <div style={{
                            display: 'grid',
                            gap: '1rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.5rem',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '5px'
                            }}>
                                <span style={{ fontWeight: '600' }}>Age:</span>
                                <span>{selectedStudent.age}</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.5rem',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '5px'
                            }}>
                                <span style={{ fontWeight: '600' }}>Email:</span>
                                <span>{selectedStudent.email}</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.5rem',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '5px'
                            }}>
                                <span style={{ fontWeight: '600' }}>Grade:</span>
                                <span>{selectedStudent.grade}</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.5rem',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '5px'
                            }}>
                                <span style={{ fontWeight: '600' }}>Subject:</span>
                                <span>{selectedStudent.subject}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
