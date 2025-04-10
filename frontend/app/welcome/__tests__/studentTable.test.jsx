import {fireEvent, render, screen} from '@testing-library/react';
import StudentTable from '../studentTable';

const mockStudents = [
    { id: '1', name: 'Alice', age: 13, gender: 'Female', grade: '7th' },
    { id: '2', name: 'Bob', age: 14, gender: 'Male', grade: '8th' },
    { id: '3', name: 'Charlie', age: 15, gender: 'Other', grade: '9th' }
];

const mockNoStudents =[];

describe('StudentTable', () => {
    it('renders the table with student data', () => {
        render(<StudentTable students={mockStudents} />);

        mockStudents.forEach(student => {
            expect(screen.getByTestId(`student-name-${student.id}`)).toHaveTextContent(student.name);
            expect(screen.getByTestId(`student-grade-${student.id}`)).toHaveTextContent(student.grade);
        });
    });

    it('displays a message when we have no students', () => {
        render(<StudentTable students={mockNoStudents} />);
        expect(screen.getByText(/no students found/i)).toBeInTheDocument();
    });

    it('adds a new student when Save is clicked', () => {
        render(<StudentTable students={[]} />);

        fireEvent.click(screen.getByText(/add/i));

        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Aris' } });
        fireEvent.change(screen.getByLabelText(/age/i), { target: { value: '15' } });
        fireEvent.change(screen.getByLabelText(/gender/i), { target: { value: 'Male' } });
        fireEvent.change(screen.getByLabelText(/grade/i), { target: { value: '10th' } });

        fireEvent.click(screen.getByText(/save/i));

        expect(screen.getByText('Aris')).toBeInTheDocument();
        expect(screen.getByTestId(/student-grade-/i)).toHaveTextContent('10th');
    });

    it('removes a student when the remove button is clicked', () => {
        render(<StudentTable students={mockStudents} />);

        const removeButton = screen.getAllByText(/remove/i)[1];
        fireEvent.click(removeButton);

        expect(screen.queryByText(/Bob/i)).not.toBeInTheDocument();
    });

    it('edits a student when Save is clicked', () => {
        render(<StudentTable students={mockStudents} />);

        const editButton = screen.getAllByText(/edit/i)[0];
        fireEvent.click(editButton);

        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'AliceUpdated' } });
        fireEvent.click(screen.getByText(/save/i));

        expect(screen.getByText(/AliceUpdated/i)).toBeInTheDocument();
    });

    it('hides the form when Cancel is clicked', () => {
        render(<StudentTable students={[]} />);

        fireEvent.click(screen.getByText(/add/i));
        fireEvent.click(screen.getByText(/cancel/i));

        expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
    });
});
