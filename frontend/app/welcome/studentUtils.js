export function createStudent({name, age, gender, grade}){
    return{
        id: crypto.randomUUID?.() || Math.random().toString(36).substring(2, 10),
        name,
        age,
        gender,
        grade
    };
}

export function addStudent(currentList, formData) {
    const newStudent = {
        id: crypto.randomUUID?.() || Math.random().toString(36).substring(2, 10),
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        grade: formData.grade
    };

    return [...currentList, newStudent];
}


export function editStudent(currentList, formData, studentId){
    const updatedStudent ={
        id: studentId.toString(),
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        grade: formData.grade
    }
    return currentList.map(student => student.id === studentId ? updatedStudent : student);
}

export function removeStudent(currentList, studentId){
    return currentList.filter(student => student.id !== studentId);
}

export function filterStudents(currentList, criteria) {
    return currentList.filter((student) => {
        const matchesName =
            !criteria.name || student.name.toLowerCase().includes(criteria.name.toLowerCase());
        const matchesGrade = !criteria.grade || student.grade === criteria.grade;
        const matchesGender = !criteria.gender || student.gender === criteria.gender;
        const matchesAge = !criteria.age || student.age === parseInt(criteria.age);
        return matchesName && matchesGrade && matchesGender && matchesAge;
    });
}

export function sortStudents(students, sortField = 'name', sortDirection = 'asc') {
    return [...students].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        // If it's a number comparison
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }

        // For strings, use localeCompare
        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return sortDirection === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }

        // Default to equal if unknown type
        return 0;
    });
}

export function validateStudent(formData) {
    const errors = {};

    if (!formData.name || formData.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters long.';
    }

    const age = parseInt(formData.age, 10);
    if (isNaN(age) || age < 5 || age > 18) {
        errors.age = 'Age must be a number between 5 and 18.';
    }

    if (!formData.gender) {
        errors.gender = 'Gender is required.';
    }

    if (!formData.grade) {
        errors.grade = 'Grade is required.';
    }

    return errors;
}