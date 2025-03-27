import { sortStudents, filterStudents } from '../page';

test('sortStudents sorts students by name in ascending order', () => {
    const students = [
        { id: 1, name: 'Charlie', age: 15, email: 'charlie@example.com', grade: '5th', subject: 'Math' },
        { id: 2, name: 'Alice', age: 14, email: 'alice@example.com', grade: '5th', subject: 'Science' },
        { id: 3, name: 'Bob', age: 16, email: 'bob@example.com', grade: '5th', subject: 'English' }
    ];
    const sortedStudents = sortStudents(students, 'name', 'asc');
    expect(sortedStudents).toEqual([
        { id: 2, name: 'Alice', age: 14, email: 'alice@example.com', grade: '5th', subject: 'Science' },
        { id: 3, name: 'Bob', age: 16, email: 'bob@example.com', grade: '5th', subject: 'English' },
        { id: 1, name: 'Charlie', age: 15, email: 'charlie@example.com', grade: '5th', subject: 'Math' }
    ]);
});

test('filterStudents filters students by search term', () => {
    const students = [
        { id: 1, name: 'John Doe', age: 15, email: 'john@example.com', grade: '9th', subject: 'Math' },
        { id: 2, name: 'Jane Smith', age: 14, email: 'jane@example.com', grade: '8th', subject: 'Science' },
        { id: 3, name: 'Mike Johnson', age: 16, email: 'mike@example.com', grade: '10th', subject: 'English' }
    ];
    const searchTerm = 'Johnson';
    const filterCriteria = { age: '', grade: '', subject: '' };
    
    const filtered = filterStudents(students, searchTerm, filterCriteria);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Mike Johnson');
});