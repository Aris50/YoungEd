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