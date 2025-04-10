import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

export default function GradeChart({ students, updateTrigger }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateChart = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Simulate a more realistic async operation
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Calculate grade distribution
            const gradeCounts = students.reduce((acc, student) => {
                acc[student.grade] = (acc[student.grade] || 0) + 1;
                return acc;
            }, {});

            const grades = Object.keys(gradeCounts);
            const counts = Object.values(gradeCounts);

            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: grades,
                    datasets: [{
                        label: 'Number of Students',
                        data: counts,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(153, 102, 255, 0.7)',
                            'rgba(255, 159, 64, 0.7)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Grade Distribution',
                            font: {
                                size: 16
                            }
                        }
                    }
                }
            });
        } catch (err) {
            setError('Failed to update chart. Please try again.');
            console.error('Chart update error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Only update when updateTrigger changes
    useEffect(() => {
        updateChart();
    }, [updateTrigger]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return (
        <div style={{ marginTop: '2rem', position: 'relative' }}>
            {isLoading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '5px'
                }}>
                    Updating chart...
                </div>
            )}
            {error && (
                <div style={{
                    color: 'red',
                    textAlign: 'center',
                    marginBottom: '1rem'
                }}>
                    {error}
                </div>
            )}
            <canvas ref={chartRef}></canvas>
        </div>
    );
} 