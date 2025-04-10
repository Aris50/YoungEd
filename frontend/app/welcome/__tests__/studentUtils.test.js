import { createStudent } from '../studentUtils';
import { addStudent } from '../studentUtils';
import { removeStudent } from '../studentUtils';
import { editStudent } from '../studentUtils';

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
