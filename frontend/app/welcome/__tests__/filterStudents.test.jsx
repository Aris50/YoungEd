import { describe, it, expect } from 'vitest';
import { filterStudents } from '../studentUtils';
import { render, screen, fireEvent } from '@testing-library/react';
import StudentTable from '../studentTable';

describe('filterStudents', () => {
    const students = [
        { id: '1', name: 'Alice', age: 13, grade: '7th', gender: 'Female' },
        { id: '2', name: 'Bob', age: 14, grade: '9th', gender: 'Male' },
        { id: '3', name: 'Charlie', age: 15, grade: '9th', gender: 'Other' }
    ];

    it('filters by name', () => {
        render(<StudentTable students={students} />);
        fireEvent.change(screen.getByPlaceholderText(/filter by name/i), {
            target: { value: 'bob' }
        });
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.queryByText('Alice')).not.toBeInTheDocument();
        expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
    });

    it('filters students by grade', () => {
        render(<StudentTable students={students} />);
        const [gradeSelect] = screen.getAllByRole('combobox');
        fireEvent.change(gradeSelect, { target: { value: '7th' } });
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.queryByText('Bob')).not.toBeInTheDocument();
        expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
    });

    it('filters students by gender', () => {
        render(<StudentTable students={students} />);
        const selects = screen.getAllByRole('combobox');
        const genderSelect = selects[1]; // second select is gender
        fireEvent.change(genderSelect, { target: { value: 'Female' } });
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.queryByText('Bob')).not.toBeInTheDocument();
        expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
    });

    it('filters students by age', () => {
        render(<StudentTable students={students} />);
        fireEvent.change(screen.getByPlaceholderText(/filter by age/i), {
            target: { value: '14' }
        });
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.queryByText('Alice')).not.toBeInTheDocument();
        expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
    });

    it('returns all when no criteria', () => {
        render(<StudentTable students={students} />);
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('Charlie')).toBeInTheDocument();
    });
});