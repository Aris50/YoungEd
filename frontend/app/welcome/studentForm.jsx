import React from 'react';

export default function StudentForm({ formData, setFormData, onSave, onCancel, errors }) {
    return (
        <form style={{ marginBottom: '1rem' }} onSubmit={(e) => e.preventDefault()}>
            {/* Name */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="name">Name:</label>
                <input
                    id="name"
                    aria-label="Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: errors.name ? '1px solid red' : '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                />{/*
                {errors.name && (
                    <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        {errors.name}
                    </p>
                )}
                */}
            </div>

            {/* Age */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="age">Age:</label>
                <input
                    id="age"
                    aria-label="Age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: errors.age ? '1px solid red' : '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                />{/*
                {errors.age && (
                    <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        {errors.age}
                    </p>
                )}
                */}
            </div>

            {/* Gender */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="gender">Gender:</label>
                <select
                    id="gender"
                    aria-label="Gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: errors.gender ? '1px solid red' : '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                >
                    <option value="">Select a gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>{/*}
                {errors.gender && (
                    <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        {errors.gender}
                    </p>
                )}
                */}
            </div>

            {/* Grade */}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="grade">Grade:</label>
                <select
                    id="grade"
                    aria-label="Grade"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: errors.grade ? '1px solid red' : '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                >
                    <option value="">Select a grade</option>
                    {['5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map((grade) => (
                        <option key={grade} value={grade}>
                            {grade}
                        </option>
                    ))}
                </select>
                {/*}
                {errors.grade && (
                    <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        {errors.grade}
                    </p>
                )}
                */}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={onSave} style={{ padding: '0.5rem 1rem' }}>
                    Save
                </button>
                <button type="button" onClick={onCancel} style={{ padding: '0.5rem 1rem' }}>
                    Cancel
                </button>
            </div>
        </form>
    );
}