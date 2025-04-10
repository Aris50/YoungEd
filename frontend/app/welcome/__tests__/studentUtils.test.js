import { createStudent } from '../studentUtils';
import { addStudent } from '../studentUtils';
import { removeStudent } from '../studentUtils';
import { editStudent } from '../studentUtils';
import { categorizeStudentsByAge } from '../studentUtils';
import { describe, it, expect } from 'vitest';

describe('createStudent', () => {
    it('should create a valid student object', () => {
        const input = {
            name: 'Alice',
            age: 13,
            gender: 'Female',
            grade: '7th'
        };

        const student = createStudent(input);

        expect(student).toEqual({
            name: 'Alice',
            age: 13,
            gender: 'Female',
            grade: '7th',
            id: expect.any(String)
        });
    });
});

describe('addStudent', () => {
    it('should return a new list with the new student added', () => {
        const initialList = [
            { id: '1', name: 'Alice', age: 14, gender: 'Female', grade: '8th' }
        ];

        const formData = {
            name: 'Aris',
            age: 15,
            gender: 'Male',
            grade: '9th'
        };

        const result = addStudent(initialList, formData);

        expect(result).toHaveLength(2);
        expect(result[1]).toMatchObject({
            name: 'Aris',
            age: 15,
            gender: 'Male',
            grade: '9th'
        });
        expect(result[1].id).toBeDefined();
    });
});


describe('removeStudent', () => {
    it('should return a new list with a specific student removed', () => {
        const initialList = [
            {id: '1', name: 'Alice', age: 14, gender: 'Female', grade: '8th'},
            {id: '2', name: 'Bob', age:15, gender:'Male', grade:'9th'}
        ];
        const studentIdToRemove = '2';

        const result = removeStudent(initialList, studentIdToRemove);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('1');
        expect(result[0].name).toBe('Alice');
        expect(result[0].id).toBeDefined();
    });
});


describe('editStudent', () => {
    it('should return a new list with the updated student', () => {
        const initialList = [
            {id: '1', name: 'Alice', age: 14, gender: 'Female', grade: '8th'},
            {id: '2', name: 'Bob', age:15, gender:'Male', grade:'9th'}
        ];
        const studentIdToEdit='1';
        const formData={
            name: 'Aris',
            age: 14,
            gender: 'Female',
            grade: '8th'
        }
        const result = editStudent(initialList, formData, studentIdToEdit);
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe('1');
        expect(result[0].name).toBe('Aris');
        expect(result[0].id).toBeDefined();
    });
});

describe('categorizeStudentsByAge', () => {
    it('categorizes 9 students into equal thirds', () => {
        const students = [
            { id: '1', name: 'S1', age: 10 },
            { id: '2', name: 'S2', age: 11 },
            { id: '3', name: 'S3', age: 12 },
            { id: '4', name: 'S4', age: 13 },
            { id: '5', name: 'S5', age: 14 },
            { id: '6', name: 'S6', age: 15 },
            { id: '7', name: 'S7', age: 16 },
            { id: '8', name: 'S8', age: 17 },
            { id: '9', name: 'S9', age: 18 }
        ];

        const result = categorizeStudentsByAge(students);
        const groups = result.reduce((acc, s) => {
            acc[s.ageCategory] = (acc[s.ageCategory] || 0) + 1;
            return acc;
        }, {});

        expect(groups['Youngest 33%']).toBe(3);
        expect(groups['Average 33%']).toBe(3);
        expect(groups['Oldest 33%']).toBe(3);
    });
    /*
    it('categorizes 7 students correctly with remainder', () => {
        const students = [
            { id: '1', name: 'S1', age: 10 },
            { id: '2', name: 'S2', age: 11 },
            { id: '3', name: 'S3', age: 12 },
            { id: '4', name: 'S4', age: 13 },
            { id: '5', name: 'S5', age: 14 },
            { id: '6', name: 'S6', age: 15 },
            { id: '7', name: 'S7', age: 16 }
        ];

        const result = categorizeStudentsByAge(students);
        const categories = result.map(s => s.ageCategory);

        const count = categories.reduce((acc, cat) => {
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});

        expect(count['Youngest 33%']).toBe(3);  // 2 + 1 (remainder)
        expect(count['Average 33%']).toBe(2);
        expect(count['Oldest 33%']).toBe(2);
    });

    it('handles empty input', () => {
        const result = categorizeStudentsByAge([]);
        expect(result).toEqual([]);
    });

    it('preserves age order in sorted output', () => {
        const students = [
            { id: '1', name: 'Zoe', age: 19 },
            { id: '2', name: 'Liam', age: 10 },
            { id: '3', name: 'Mia', age: 15 }
        ];
        const result = categorizeStudentsByAge(students);

        expect(result[0].age).toBe(10);
        expect(result[1].age).toBe(15);
        expect(result[2].age).toBe(19);
    });
    */
});