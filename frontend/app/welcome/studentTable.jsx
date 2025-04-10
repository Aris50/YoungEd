import React, { useState, useMemo } from 'react';
import StudentForm from './StudentForm';
import { addStudent, removeStudent, editStudent, filterStudents, sortStudents} from './studentUtils';

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

    function handleSaveStudent() {
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

    function handleCancel() {
        setFormData({ name: '', age: '', gender: '', grade: '' });
        setIsAdding(false);
        setEditingStudent(null);
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
            <button onClick={() => setIsAdding(true)}>Add</button>
            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Filter by name"
                    value={filterCriteria.name}
                    onChange={(e) =>
                        setFilterCriteria({ ...filterCriteria, name: e.target.value })
                    }
                />
                <input
                    type="number"
                    placeholder="Filter by age"
                    value={filterCriteria.age}
                    onChange={(e) =>
                        setFilterCriteria({ ...filterCriteria, age: e.target.value })
                    }
                />
                <select
                    value={filterCriteria.grade}
                    onChange={(e) =>
                        setFilterCriteria({ ...filterCriteria, grade: e.target.value })
                    }
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
                >
                    <option value="">All Genders</option>
                    {['Male', 'Female', 'Other'].map((g) => (
                        <option key={g} value={g}>
                            {g}
                        </option>
                    ))}
                </select>

                <button onClick={clearFilters}>Clear</button>
            </div>

            {(isAdding || editingStudent) && (
                <StudentForm
                    formData={formData}
                    setFormData={setFormData}
                    onSave={handleSaveStudent}
                    onCancel={handleCancel}
                />
            )}
            {filteredList.length === 0 ? (
                <p>No students found.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th onClick={() => handleSort('name')}>Name {sortField === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
                        <th onClick={() => handleSort('age')}>Age {sortField === 'age' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
                        <th onClick={() => handleSort('gender')}>Gender {sortField === 'gender' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
                        <th onClick={() => handleSort('grade')}>Grade {sortField === 'grade' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortStudents(filteredList, sortField, sortDirection).map((student) => (
                        <tr key={student.id}>
                            <td data-testid={`student-name-${student.id}`}>{student.name}</td>
                            <td data-testid={`student-age-${student.id}`}>{student.age}</td>
                            <td data-testid={`student-gender-${student.id}`}>{student.gender}</td>
                            <td data-testid={`student-grade-${student.id}`}>{student.grade}</td>
                            <td>
                                <button onClick={() => handleRemoveStudent(student.id)}>Remove</button>
                                <button onClick={() => handleEditStudent(student)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}