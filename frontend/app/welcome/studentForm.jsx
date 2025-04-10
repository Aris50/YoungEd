import React from 'react';

export default function StudentForm({ formData, setFormData, onSave, onCancel, errors }) {
    return (
        <form style={{ marginBottom: '1rem' }} onSubmit={(e) => e.preventDefault()}>
            {/* Name */}
            <div style={{ marginBottom: '1rem' }}>
                <label 
                    htmlFor="name"
                    style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500'
                    }}
                >
                    Name:
                </label>
                <input
                    id="name"
                    aria-label="Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '5px',
                        border: errors.name ? '1px solid #dc3545' : '1px solid #ddd',
                        fontSize: '1rem'
                    }}
                />
                {errors.name && (
                    <p style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        {errors.name}
                    </p>
                )}
            </div>

            {/* Age */}
            <div style={{ marginBottom: '1rem' }}>
                <label 
                    htmlFor="age"
                    style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500'
                    }}
                >
                    Age:
                </label>
                <input
                    id="age"
                    aria-label="Age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '5px',
                        border: errors.age ? '1px solid #dc3545' : '1px solid #ddd',
                        fontSize: '1rem'
                    }}
                />
                {errors.age && (
                    <p style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        {errors.age}
                    </p>
                )}
            </div>

            {/* Gender */}
            <div style={{ marginBottom: '1rem' }}>
                <label 
                    htmlFor="gender"
                    style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500'
                    }}
                >
                    Gender:
                </label>
                <select
                    id="gender"
                    aria-label="Gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '5px',
                        border: errors.gender ? '1px solid #dc3545' : '1px solid #ddd',
                        fontSize: '1rem'
                    }}
                >
                    <option value="">Select a gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                {errors.gender && (
                    <p style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        {errors.gender}
                    </p>
                )}
            </div>

            {/* Grade */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label 
                    htmlFor="grade"
                    style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500'
                    }}
                >
                    Grade:
                </label>
                <select
                    id="grade"
                    aria-label="Grade"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '5px',
                        border: errors.grade ? '1px solid #dc3545' : '1px solid #ddd',
                        fontSize: '1rem'
                    }}
                >
                    <option value="">Select a grade</option>
                    {['5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map((grade) => (
                        <option key={grade} value={grade}>
                            {grade}
                        </option>
                    ))}
                </select>
                {errors.grade && (
                    <p style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        {errors.grade}
                    </p>
                )}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    type="button"
                    onClick={onSave}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        backgroundColor: '#212121',
                        color: '#FFC107',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Save
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        backgroundColor: '#FFC107',
                        color: '#212121',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}