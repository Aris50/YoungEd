"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

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
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage] = useState(5);
    const [chartData, setChartData] = useState({
        ageDistribution: null,
        gradeDistribution: null,
        subjectDistribution: null
    });

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
                photo: 'https://i.pravatar.cc/150?img=1'
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
            {
                id: 4,
                name: 'Sarah Williams',
                age: 13,
                email: 'sarah.williams@example.com',
                grade: '7th',
                subject: 'History',
                photo: 'https://i.pravatar.cc/150?img=4'
            },
            {
                id: 5,
                name: 'David Brown',
                age: 17,
                email: 'david.brown@example.com',
                grade: '11th',
                subject: 'Physics',
                photo: 'https://i.pravatar.cc/150?img=5'
            },
            {
                id: 6,
                name: 'Emma Davis',
                age: 12,
                email: 'emma.davis@example.com',
                grade: '6th',
                subject: 'Geography',
                photo: 'https://i.pravatar.cc/150?img=6'
            },
            {
                id: 7,
                name: 'James Wilson',
                age: 18,
                email: 'james.wilson@example.com',
                grade: '12th',
                subject: 'Chemistry',
                photo: 'https://i.pravatar.cc/150?img=7'
            },
            {
                id: 8,
                name: 'Olivia Taylor',
                age: 11,
                email: 'olivia.taylor@example.com',
                grade: '5th',
                subject: 'Biology',
                photo: 'https://i.pravatar.cc/150?img=8'
            },
            {
                id: 9,
                name: 'Lucas Anderson',
                age: 15,
                email: 'lucas.anderson@example.com',
                grade: '9th',
                subject: 'Computer Science',
                photo: 'https://i.pravatar.cc/150?img=9'
            },
            {
                id: 10,
                name: 'Sophia Martinez',
                age: 14,
                email: 'sophia.martinez@example.com',
                grade: '8th',
                subject: 'Literature',
                photo: 'https://i.pravatar.cc/150?img=10'
            },
            {
                id: 11,
                name: 'Ethan Thompson',
                age: 16,
                email: 'ethan.thompson@example.com',
                grade: '10th',
                subject: 'Mathematics',
                photo: 'https://i.pravatar.cc/150?img=11'
            },
            {
                id: 12,
                name: 'Ava Garcia',
                age: 13,
                email: 'ava.garcia@example.com',
                grade: '7th',
                subject: 'Science',
                photo: 'https://i.pravatar.cc/150?img=12'
            },
            {
                id: 13,
                name: 'Noah Rodriguez',
                age: 17,
                email: 'noah.rodriguez@example.com',
                grade: '11th',
                subject: 'English',
                photo: 'https://i.pravatar.cc/150?img=13'
            },
            {
                id: 14,
                name: 'Isabella Lee',
                age: 12,
                email: 'isabella.lee@example.com',
                grade: '6th',
                subject: 'History',
                photo: 'https://i.pravatar.cc/150?img=14'
            },
            {
                id: 15,
                name: 'Mason Walker',
                age: 18,
                email: 'mason.walker@example.com',
                grade: '12th',
                subject: 'Physics',
                photo: 'https://i.pravatar.cc/150?img=15'
            },
            {
                id: 16,
                name: 'Mia Hall',
                age: 11,
                email: 'mia.hall@example.com',
                grade: '5th',
                subject: 'Geography',
                photo: 'https://i.pravatar.cc/150?img=16'
            },
            {
                id: 17,
                name: 'William Allen',
                age: 15,
                email: 'william.allen@example.com',
                grade: '9th',
                subject: 'Chemistry',
                photo: 'https://i.pravatar.cc/150?img=17'
            },
            {
                id: 18,
                name: 'Charlotte Wright',
                age: 14,
                email: 'charlotte.wright@example.com',
                grade: '8th',
                subject: 'Biology',
                photo: 'https://i.pravatar.cc/150?img=18'
            },
            {
                id: 19,
                name: 'Liam King',
                age: 16,
                email: 'liam.king@example.com',
                grade: '10th',
                subject: 'Computer Science',
                photo: 'https://i.pravatar.cc/150?img=19'
            },
            {
                id: 20,
                name: 'Amelia Scott',
                age: 13,
                email: 'amelia.scott@example.com',
                grade: '7th',
                subject: 'Literature',
                photo: 'https://i.pravatar.cc/150?img=20'
            }
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

    // Calculate statistics
    const ages = sortedStudents.map(student => student.age);
    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);
    const avgAge = Math.round(ages.reduce((a, b) => a + b, 0) / ages.length);

    // Calculate pagination
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = sortedStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(sortedStudents.length / studentsPerPage);

    // Update chart data
    useEffect(() => {
        const updateChartData = () => {
            // Age Distribution Chart
            const ageGroups = {
                '11-13': 0,
                '14-15': 0,
                '16-18': 0
            };
            sortedStudents.forEach(student => {
                if (student.age <= 13) ageGroups['11-13']++;
                else if (student.age <= 15) ageGroups['14-15']++;
                else ageGroups['16-18']++;
            });

            // Grade Distribution Chart
            const gradeCounts = {};
            sortedStudents.forEach(student => {
                gradeCounts[student.grade] = (gradeCounts[student.grade] || 0) + 1;
            });

            // Subject Distribution Chart
            const subjectCounts = {};
            sortedStudents.forEach(student => {
                subjectCounts[student.subject] = (subjectCounts[student.subject] || 0) + 1;
            });

            setChartData({
                ageDistribution: {
                    labels: Object.keys(ageGroups),
                    datasets: [{
                        label: 'Age Distribution',
                        data: Object.values(ageGroups),
                        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107']
                    }]
                },
                gradeDistribution: {
                    labels: Object.keys(gradeCounts),
                    datasets: [{
                        label: 'Students per Grade',
                        data: Object.values(gradeCounts),
                        backgroundColor: '#2196F3'
                    }]
                },
                subjectDistribution: {
                    labels: Object.keys(subjectCounts),
                    datasets: [{
                        label: 'Students per Subject',
                        data: Object.values(subjectCounts),
                        backgroundColor: [
                            '#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF5722',
                            '#795548', '#607D8B', '#E91E63', '#00BCD4', '#FF9800'
                        ]
                    }]
                }
            });
        };

        updateChartData();
    }, [sortedStudents]);

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

                {/* Charts Section */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '1rem',
                        borderRadius: '10px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Age Distribution</h3>
                        {chartData.ageDistribution && (
                            <Pie
                                data={chartData.ageDistribution}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'bottom'
                                        }
                                    }
                                }}
                            />
                        )}
                    </div>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '1rem',
                        borderRadius: '10px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Grade Distribution</h3>
                        {chartData.gradeDistribution && (
                            <Bar
                                data={chartData.gradeDistribution}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            display: false
                                        }
                                    }
                                }}
                            />
                        )}
                    </div>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '1rem',
                        borderRadius: '10px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Subject Distribution</h3>
                        {chartData.subjectDistribution && (
                            <Pie
                                data={chartData.subjectDistribution}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'bottom'
                                        }
                                    }
                                }}
                            />
                        )}
                    </div>
                </div>

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
                            {currentStudents.map(student => (
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
                                    <td style={{ 
                                        padding: '1rem',
                                        backgroundColor: student.age === minAge ? '#e8f5e9' : 
                                                       student.age === maxAge ? '#ffebee' : 
                                                       student.age === avgAge ? '#fff3e0' : 'transparent'
                                    }}>
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
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {student.age}
                                                {student.age === minAge && <span style={{ color: '#2e7d32' }}>(Youngest)</span>}
                                                {student.age === maxAge && <span style={{ color: '#c62828' }}>(Oldest)</span>}
                                                {student.age === avgAge && <span style={{ color: '#ef6c00' }}>(Average)</span>}
                                            </div>
                                        )}
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

                {/* Pagination */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '2rem'
                }}>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: currentPage === 1 ? '#ccc' : '#212121',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Previous
                    </button>
                    <span style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '3px'
                    }}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: currentPage === totalPages ? '#ccc' : '#212121',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Next
                    </button>
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
