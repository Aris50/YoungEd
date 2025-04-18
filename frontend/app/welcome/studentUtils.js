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

export function categorizeStudentsByAge(students) {
    if (!students.length) return students;

    // Sort students by age
    const sortedStudents = [...students].sort((a, b) => a.age - b.age);
    
    // Calculate the size of each category
    const totalStudents = sortedStudents.length;
    const baseCategorySize = Math.floor(totalStudents / 3);
    const remainder = totalStudents % 3;

    // Assign categories
    return sortedStudents.map((student, index) => {
        let ageCategory;
        
        // First category gets one extra if remainder is 1 or 2
        if (index < baseCategorySize + (remainder > 0 ? 1 : 0)) {
            ageCategory = 'Youngest 33%';
        } 
        // Second category gets one extra if remainder is 2
        else if (index < 2 * baseCategorySize + (remainder > 1 ? 1 : 0)) {
            ageCategory = 'Average 33%';
        } 
        // Last category gets the base size
        else {
            ageCategory = 'Oldest 33%';
        }

        return {
            ...student,
            ageCategory
        };
    });
}