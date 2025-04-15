// Serviciu pentru gestionarea datelor locale

// Chei pentru localStorage
const STUDENTS_KEY = 'students';
const PENDING_OPERATIONS_KEY = 'pendingOperations';

// Obținere studenți din localStorage
export const getLocalStudents = () => {
  try {
    const studentsJson = localStorage.getItem(STUDENTS_KEY);
    return studentsJson ? JSON.parse(studentsJson) : [];
  } catch (error) {
    console.error('Eroare la citirea studenților din localStorage:', error);
    return [];
  }
};

// Salvare studenți în localStorage
export const saveLocalStudents = (students) => {
  try {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    return true;
  } catch (error) {
    console.error('Eroare la salvarea studenților în localStorage:', error);
    return false;
  }
};

// Adăugare student în localStorage
export const addLocalStudent = (student) => {
  const students = getLocalStudents();
  const newStudent = {
    ...student,
    id: student.id || Date.now().toString(),
    localId: Date.now().toString() // ID local pentru operațiuni offline
  };
  students.push(newStudent);
  saveLocalStudents(students);
  return newStudent;
};

// Actualizare student în localStorage
export const updateLocalStudent = (studentId, updatedData) => {
  const students = getLocalStudents();
  const index = students.findIndex(s => s.id === studentId || s.localId === studentId);
  
  if (index !== -1) {
    students[index] = { ...students[index], ...updatedData };
    saveLocalStudents(students);
    return students[index];
  }
  
  return null;
};

// Ștergere student din localStorage
export const deleteLocalStudent = (studentId) => {
  const students = getLocalStudents();
  const filteredStudents = students.filter(s => s.id !== studentId && s.localId !== studentId);
  saveLocalStudents(filteredStudents);
  return filteredStudents.length !== students.length;
};

// Obținere operațiuni în așteptare
export const getPendingOperations = () => {
  try {
    const operationsJson = localStorage.getItem(PENDING_OPERATIONS_KEY);
    return operationsJson ? JSON.parse(operationsJson) : { create: [], update: [], delete: [] };
  } catch (error) {
    console.error('Eroare la citirea operațiunilor în așteptare:', error);
    return { create: [], update: [], delete: [] };
  }
};

// Salvare operațiuni în așteptare
export const savePendingOperations = (operations) => {
  try {
    localStorage.setItem(PENDING_OPERATIONS_KEY, JSON.stringify(operations));
    return true;
  } catch (error) {
    console.error('Eroare la salvarea operațiunilor în așteptare:', error);
    return false;
  }
};

// Adăugare operațiune în așteptare
export const addPendingOperation = (type, data) => {
  const operations = getPendingOperations();
  operations[type].push({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    data
  });
  savePendingOperations(operations);
};

// Eliminare operațiune din așteptare
export const removePendingOperation = (type, operationId) => {
  const operations = getPendingOperations();
  operations[type] = operations[type].filter(op => op.id !== operationId);
  savePendingOperations(operations);
};

// Ștergere toate operațiunile în așteptare
export const clearPendingOperations = () => {
  savePendingOperations({ create: [], update: [], delete: [] });
}; 