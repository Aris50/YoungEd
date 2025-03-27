"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Aici vom adăuga logica de autentificare mai târziu
        console.log('Login attempt:', { email, password });
        router.push('/welcome');
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            flexDirection: 'column',
            backgroundColor: '#FFC107',
            color: '#212121',
            fontFamily: 'Poppins, sans-serif',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                    color: '#212121'
                }}>Login to YoungEd</h1>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '500'
                        }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '500'
                        }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: '#212121',
                            color: '#FFC107',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease'
                        }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.02)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    >
                        Login
                    </button>
                </form>

                <button
                    onClick={() => router.push('/')}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: 'transparent',
                        color: '#212121',
                        border: '2px solid #212121',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginTop: '1rem',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => {
                        e.target.style.backgroundColor = '#212121';
                        e.target.style.color = '#FFC107';
                    }}
                    onMouseLeave={e => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#212121';
                    }}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}
