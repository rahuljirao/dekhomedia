import React from "react";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from 'chart.js';

// Register necessary chart components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

const Movies = () => {

    const data = {
        labels: ['Inception', 'Interstellar', 'Joker', 'Parasite', 'Avatar', 'Tenet'],
        datasets: [{
            label: 'Interest (%)',
            data: [85, 72, 60, 50, 68, 40],
            backgroundColor: [
                '#facc15', '#34d399', '#f87171', '#60a5fa', '#a78bfa', '#fb923c'
            ],
            borderRadius: 6
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: "#1f2937",
                titleColor: "#facc15",
                bodyColor: "#fff"
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                color: '#e5e7eb'
                },
                grid: {
                color: 'rgba(255,255,255,0.05)'
                }
            },
            x: {
                ticks: {
                    color: '#e5e7eb'
                },
                grid: {
                    display: false
                }
            }
        }
    };
    return (
        <>
            {/* { loading ? <Loader /> :  */}
                <>
                    <section id="movies-section" className="section">
                        <div className="movie-management-section">
                            <h2>🎞️ Movie Library Manager</h2>  
                            <div className="table-wrapper">
                                <table className="trending-table">
                                    <thead>
                                        <tr>
                                            <th>🎖️ Rank</th>
                                            <th>🎬 Movie</th>
                                            <th>🎭 Genre</th>
                                            <th>👀 Watch Count</th>
                                            <th>📈 Trend</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Interstellar</td>
                                            <td>Sci-Fi</td>
                                            <td>1.2M</td>
                                            <td><span className="badge badge-up">+14%</span></td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>Inception</td>
                                            <td>Sci-Fi / Thriller</td>
                                            <td>1.1M</td>
                                            <td><span className="badge badge-up">+10%</span></td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>Avengers: Endgame</td>
                                            <td>Action / Sci-Fi</td>
                                            <td>980K</td>
                                            <td><span className="badge badge-down">-3%</span></td>
                                        </tr>
                                        <tr>
                                            <td>4</td>
                                            <td>The Dark Knight</td>
                                            <td>Action / Crime</td>
                                            <td>850K</td>
                                            <td><span className="badge badge-up">+6%</span></td>
                                        </tr>
                                        <tr>
                                            <td>5</td>
                                            <td>Parasite</td>
                                            <td>Drama / Thriller</td>
                                            <td>730K</td>
                                            <td><span className="badge badge-up">+8%</span></td>
                                        </tr>
                                        <tr>
                                            <td>6</td>
                                            <td>Joker</td>
                                            <td>Crime / Drama</td>
                                            <td>690K</td>
                                            <td><span className="badge badge-down">-1%</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>  
                        {/* Public Interest Section */}
                        <div className="public-interest-section fancy-card blur-overlay">
                            <div className="header">
                                <h2>🎬 Public Interest by Movie</h2>
                                <span className="subtext">Top movies gaining traction this week</span>
                            </div>
                            <div className="chart-wrapper">
                                <Bar data={data} options={options} />
                            </div>
                        </div> 
                        <div className="public-reviews-section"> 
                            <div className="header">
                                <h2>💬 Public Movie Reviews</h2>
                                <span className="subtext">Top movies gaining traction this week</span>
                            </div>
                            <div className="reviews-grid">
                                <div className="review-card">
                                    <div className="review-header">
                                        <h4>🎬 Inception <span className="review-user">by Alice</span></h4>
                                        <div className="stars">⭐️⭐️⭐️⭐️☆</div>
                                    </div>
                                    <p className="review-comment">
                                        Mind-blowing visuals and a complex story. Nolan at his best!
                                    </p>
                                </div>
                            
                                <div className="review-card">
                                    <div className="review-header">
                                        <h4>🧠 Parasite <span className="review-user">by John</span></h4>
                                        <div className="stars">⭐️⭐️⭐️⭐️☆</div>
                                    </div>
                                    <p className="review-comment">
                                        Intense and socially powerful. Totally deserves the Oscar.
                                    </p>
                                </div>
                            
                                <div className="review-card">
                                    <div className="review-header">
                                        <h4>🃏 Joker <span className="review-user">by Emma</span></h4>
                                        <div className="stars">⭐️⭐️⭐️⭐️⭐️</div>
                                    </div>
                                    <p className="review-comment">
                                        Joaquin's performance was phenomenal. Dark and brilliant.
                                    </p>
                                </div>
                            
                                <div className="review-card">
                                    <div className="review-header">
                                        <h4>🚀 Interstellar <span className="review-user">by Mike</span></h4>
                                        <div className="stars">⭐️⭐️⭐️⭐️⭐️</div>
                                    </div>
                                    <p className="review-comment">
                                        A beautiful mix of science, emotion, and visuals.
                                    </p>
                                </div>
                            
                                <div className="review-card">
                                    <div className="review-header">
                                        <h4>🌍 Avatar <span className="review-user">by Sophie</span></h4>
                                        <div className="stars">⭐️⭐️⭐️⭐️☆</div>
                                    </div>
                                    <p className="review-comment">
                                        Visually stunning. A cinematic breakthrough of its time.
                                    </p>
                                </div>
                            
                                <div className="review-card">
                                    <div className="review-header">
                                        <h4>🌵 Dune <span className="review-user">by Leo</span></h4>
                                        <div className="stars">⭐️⭐️⭐️⭐️☆</div>
                                    </div>
                                    <p className="review-comment">
                                        A slow burn epic with great world-building and soundtrack.
                                    </p>
                                </div>
                            
                                <div className="review-card">
                                    <div className="review-header">
                                        <h4>🕷️ Spider-Verse <span className="review-user">by Anna</span></h4>
                                        <div className="stars">⭐️⭐️⭐️⭐️⭐️</div>
                                    </div>
                                    <p className="review-comment">
                                        Innovative animation, gripping plot, and emotional depth.
                                    </p>
                                </div>
                            
                                <div className="review-card">
                                    <div className="review-header">
                                        <h4>💣 Oppenheimer <span className="review-user">by Chris</span></h4>
                                        <div className="stars">⭐️⭐️⭐️⭐️☆</div>
                                    </div>
                                    <p className="review-comment">
                                        A thoughtful deep-dive into history and moral consequence.
                                    </p>
                                </div>
                            </div> 
                        </div>   
                    </section>
                </>
            {/* } */}
        </>
    );
};

export default Movies;
