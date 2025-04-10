import { describe, it, expect } from 'vitest';
import { sortStudents } from '../studentUtils';
import { render, screen, fireEvent } from '@testing-library/react';
import StudentTable from '../studentTable';

describe('sortStudents', () => {
    const students = [
        { id: '1', name: 'Charlie', age: 15, gender: 'Other', grade: '9th' },
        { id: '2', name: 'Alice', age: 13, gender: 'Female', grade: '7th' },
        { id: '3', name: 'Bob', age: 14, gender: 'Male', grade: '8th' }
    ];

    it('sorts by name ascending', () => {
        const result = sortStudents([...students], 'name', 'asc');
        expect(result.map(s => s.name)).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('sorts by name descending', () => {
        const result = sortStudents([...students], 'name', 'desc');
        expect(result.map(s => s.name)).toEqual(['Charlie', 'Bob', 'Alice']);
    });

    it('sorts by age ascending', () => {
        const result = sortStudents([...students], 'age', 'asc');
        expect(result.map(s => s.age)).toEqual([13, 14, 15]);
    });

    it('sorts by age descending', () => {
        const result = sortStudents([...students], 'age', 'desc');
        expect(result.map(s => s.age)).toEqual([15, 14, 13]);
    });

    it('sorts by grade ascending', () => {
        const result = sortStudents([...students], 'grade', 'asc');
        expect(result.map(s => s.grade)).toEqual(['7th', '8th', '9th']);
    });

    it('sorts by grade descending', () => {
        const result = sortStudents([...students], 'grade', 'desc');
        expect(result.map(s => s.grade)).toEqual(['9th', '8th', '7th']);
    });

    it('sorts students by name when column header is clicked', () => {
        render(<StudentTable students={students} />);

        const headers = screen.getAllByRole('columnheader');
        const nameHeader = headers.find(header => header.textContent.includes('Name'));
        fireEvent.click(nameHeader);

        //After one fire, it switches from asc to desc
        const firstRowName = screen.getAllByTestId(/student-name-/i)[0];
        expect(firstRowName).toHaveTextContent('Charlie');

        //Then it switches back
        fireEvent.click(nameHeader);

        const newFirstRowName = screen.getAllByTestId(/student-name-/i)[0];
        expect(newFirstRowName).toHaveTextContent('Alice'); // Should now be last alphabetically
    });
});
