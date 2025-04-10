import { describe, it, expect } from 'vitest';
import { validateStudent } from '../studentUtils';

describe('validateStudent', () => {
    it('returns no errors for valid student', () => {
        const formData = {
            name: 'Alice',
            age: '14',
            gender: 'Female',
            grade: '8th'
        };
        const errors = validateStudent(formData);
        expect(errors).toEqual({});
    });

    it('returns error if name is empty', () => {
        const formData = {
            name: '',
            age: '14',
            gender: 'Female',
            grade: '8th'
        };
        const errors = validateStudent(formData);
        expect(errors.name).toBeDefined();
    });

    it('returns error if age is not a number between 5 and 30', () => {
        const tooYoung = validateStudent({ name: 'A', age: '4', gender: 'Male', grade: '6th' });
        const tooOld = validateStudent({ name: 'A', age: '40', gender: 'Male', grade: '6th' });
        const invalid = validateStudent({ name: 'A', age: 'abc', gender: 'Male', grade: '6th' });

        expect(tooYoung.age).toBeDefined();
        expect(tooOld.age).toBeDefined();
        expect(invalid.age).toBeDefined();
    });

    it('returns error if gender is missing', () => {
        const formData = {
            name: 'Aris',
            age: '14',
            gender: '',
            grade: '8th'
        };
        const errors = validateStudent(formData);
        expect(errors.gender).toBeDefined();
    });

    it('returns error if grade is not selected', () => {
        const formData = {
            name: 'Aris',
            age: '14',
            gender: 'Male',
            grade: ''
        };
        const errors = validateStudent(formData);
        expect(errors.grade).toBeDefined();
    });
});
