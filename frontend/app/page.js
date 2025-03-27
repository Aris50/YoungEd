"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [visible, setVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setVisible(true);
    }, []);

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
            perspective: '1000px',
            overflow: 'hidden',
            textAlign: 'center',
            padding: '20px'
        }}>
            <h1 style={{
                fontSize: '4rem',
                fontWeight: '700',
                marginBottom: '20px',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(-30px)',
                transition: 'opacity 1s ease, transform 1s ease',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}>🎓 Welcome to <span style={{ color: '#fff' }}>YoungEd!</span></h1>

            <p style={{
                fontSize: '1.5rem',
                fontWeight: '400',
                marginBottom: '60px',
                maxWidth: '600px',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 1s ease 0.5s, transform 1s ease 0.5s',
                lineHeight: '1.6',
                textShadow: '1px 1px 3px rgba(0,0,0,0.1)'
            }}>Empowering Education with <strong>Ease</strong> and <strong>Style.</strong></p>

            <div style={{
                width: '120px',
                height: '120px',
                position: 'relative',
                transformStyle: 'preserve-3d',
                animation: 'spin 8s infinite linear',
                marginBottom: '50px'
            }}>
                <div className="face front"></div>
                <div className="face back"></div>
                <div className="face right"></div>
                <div className="face left"></div>
                <div className="face top"></div>
                <div className="face bottom"></div>
            </div>

            <button style={{
                padding: '10px 20px',
                fontSize: '1.2rem',
                color: '#FFC107',
                backgroundColor: '#212121',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, background-color 0.3s ease',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
                    onClick={() => router.push('/login')}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            >Login</button>

            <style jsx>{`
            .face {
              position: absolute;
              width: 120px;
              height: 120px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 16px;
              font-weight: bold;
              color: white;
              border: 3px solid white;
            }

            .front  { animation: colorCyclefront 2s infinite linear; transform: translateZ(60px); }
            .back   { animation: colorCycleback 2s infinite linear; transform: rotateY(180deg) translateZ(60px); }
            .right  { animation: colorCycleright 2s infinite linear; transform: rotateY(90deg) translateZ(60px); }
            .left   { animation: colorCycleleft 2s infinite linear; transform: rotateY(-90deg) translateZ(60px); }
            .top    { animation: colorCycletop 2s infinite linear; transform: rotateX(90deg) translateZ(60px); }
            .bottom { animation: colorCyclebottom 2s infinite linear; transform: rotateX(-90deg) translateZ(60px); }

            @keyframes spin {
              10% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
              100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
            }

            @keyframes colorCyclefront { 0% { background-color: red; border-color: #426052; } 50% { background-color: blue; border-color: white; }}
            @keyframes colorCycleback { 0% { background-color: red; border-color: #426052; } 50% { background-color: rgba(0,255,225,0.7); border-color: white; }}
            @keyframes colorCycleright { 0% { background-color: #bf0396; border-color: #426052; } 50% { background-color: #ffec20; border-color: white; }}
            @keyframes colorCycleleft { 0% { background-color: #426052; border-color: #426052; } 50% { background-color: #2fff00; border-color: white; }}
            @keyframes colorCycletop { 0% { background-color: #216c9e; border-color: #426052; } 50% { background-color: #00fff7; border-color: white; }}
            @keyframes colorCyclebottom { 0% { background-color: #c579e3; border-color: #426052; } 50% { background-color: #9a4f4f; border-color: white; }}
          `}</style>
        </div>
    );
}
