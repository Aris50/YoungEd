import React from 'react';

export default function StudentForm({ formData, setFormData, onSave, onCancel }) {
    return (
        <div>
            <label>
                Name:
                <input
                    aria-label="Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </label>

            <label>
                Age:
                <input
                    aria-label="Age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
            </label>

            <label>
                Gender:
                <input
                    aria-label="Gender"
                    type="text"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                />
            </label>

            <label>
                Grade:
                <input
                    aria-label="Grade"
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                />
            </label>

            <button onClick={onSave}>Save</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    );
}