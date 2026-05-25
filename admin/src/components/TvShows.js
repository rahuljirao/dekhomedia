import React from "react";
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register necessary chart components
ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Legend,
    Tooltip,
    Title
);

const TvShows = () => {

    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'TV Show Users',
                data: [120, 190, 300, 500, 200, 300, 400],
                borderColor: '#42a5f5',
                fill: false,
                tension: 0.4
            },
            {
                label: 'Trending Shows',
                data: [60, 80, 100, 150, 180, 120, 160],
                borderColor: '#66bb6a',
                fill: false,
                tension: 0.4
            },
            {
                label: 'Public Interest',
                data: [200, 300, 250, 400, 450, 420, 500],
                borderColor: '#ef5350',
                fill: false,
                tension: 0.4
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: '#ffffff'
                }
            },
            tooltip: {
                backgroundColor: '#1f2937',
                titleColor: '#facc15',
                bodyColor: '#ffffff'
            }
        },
        animation: {
            duration: 1500,
            easing: 'easeInOutQuart'
        },
        scales: {
            x: {
                ticks: {
                    color: '#ffffff' // X-axis tick labels
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)' // Optional: faint white grid lines
                }
            },
            y: {
                ticks: {
                    color: '#ffffff' // Y-axis tick labels
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)' // Optional: faint white grid lines
                }
            }
        }
    };
    return (
        <>
            {/* { loading ? <Loader /> :  */}
            <>
                <section id="tvshows-section" className="section">
                    <div className="movie-management-section">
                        <h2>📺 TV Show Management Dashboard</h2>
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
                                        <td>The Crown of TV Shows</td>
                                        <td>Sci-Fi</td>
                                        <td>1.2M</td>
                                        <td><span className="badge badge-up">+14%</span></td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>Rings of Power Console</td>
                                        <td>Sci-Fi / Thriller</td>
                                        <td>1.1M</td>
                                        <td><span className="badge badge-up">+10%</span></td>
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>Elite Control Center</td>
                                        <td>Action / Sci-Fi</td>
                                        <td>980K</td>
                                        <td><span className="badge badge-down">-3%</span></td>
                                    </tr>
                                    <tr>
                                        <td>4</td>
                                        <td>Gotham Show Tracker</td>
                                        <td>Action / Crime</td>
                                        <td>850K</td>
                                        <td><span className="badge badge-up">+6%</span></td>
                                    </tr>
                                    <tr>
                                        <td>5</td>
                                        <td>Rick & Morty Series Lab</td>
                                        <td>Drama / Thriller</td>
                                        <td>730K</td>
                                        <td><span className="badge badge-up">+8%</span></td>
                                    </tr>
                                    <tr>
                                        <td>6</td>
                                        <td>Into the 'Stranger Things' Panel</td>
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
                            <h2>📈 TV Show Genre Analysis</h2>
                            <span className="subtext">Top movies gaining traction this week</span>
                        </div>
                        <div className="tv-pie-chart" style={{ height: '200px' }}>
                            <Line data={data} options={options} />
                        </div>
                    </div>
                    <div className="tvshow-reviews-section">
                        <div className="tvshow-header">
                            <h2>📺 TV Show Public Reviews</h2>
                            <span className="tvshow-subtext">Trending shows and what viewers are saying this week</span>
                        </div>
                        <div className="tvshow-reviews-grid">
                            <div className="tvshow-review-card">
                                <div className="tvshow-review-header">
                                    <h4>👑 The Crown <span className="tvshow-review-user">by Olivia</span></h4>
                                    <div className="stars">⭐️⭐️⭐️⭐️⭐️</div>
                                </div>
                                <p className="tvshow-review-comment">
                                    A regal masterpiece. Stellar performances and brilliant direction.
                                </p>
                            </div>

                            <div className="tvshow-review-card">
                                <div className="tvshow-review-header">
                                    <h4>🧟‍♂️ The Last of Us <span className="tvshow-review-user">by Ethan</span></h4>
                                    <div className="stars">⭐️⭐️⭐️⭐️☆</div>
                                </div>
                                <p className="tvshow-review-comment">
                                    Faithful to the game and emotionally gripping. Joel & Ellie shine.
                                </p>
                            </div>

                            <div className="tvshow-review-card">
                                <div className="tvshow-review-header">
                                    <h4>🐉 House of the Dragon <span className="tvshow-review-user">by Sarah</span></h4>
                                    <div className="stars">⭐️⭐️⭐️⭐️⭐️</div>
                                </div>
                                <p className="tvshow-review-comment">
                                    The perfect return to Westeros. Political tension and dragons galore!
                                </p>
                            </div>

                            <div className="tvshow-review-card">
                                <div className="tvshow-review-header">
                                    <h4>🔮 Stranger Things <span className="tvshow-review-user">by Max</span></h4>
                                    <div className="stars">⭐️⭐️⭐️⭐️☆</div>
                                </div>
                                <p className="tvshow-review-comment">
                                    80s nostalgia, supernatural twists, and lovable characters. A blast!
                                </p>
                            </div>

                            <div className="tvshow-review-card">
                                <div className="tvshow-review-header">
                                    <h4>🦸‍♂️ The Boys <span className="tvshow-review-user">by Lily</span></h4>
                                    <div className="stars">⭐️⭐️⭐️⭐️⭐️</div>
                                </div>
                                <p className="tvshow-review-comment">
                                    Dark, witty, and brutally entertaining. Homelander is terrifying!
                                </p>
                            </div>

                            <div className="tvshow-review-card">
                                <div className="tvshow-review-header">
                                    <h4>⚔️ Vikings: Valhalla <span className="tvshow-review-user">by Jack</span></h4>
                                    <div className="stars">⭐️⭐️⭐️⭐️☆</div>
                                </div>
                                <p className="tvshow-review-comment">
                                    Epic battles and legendary storytelling. A must for Viking fans.
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

export default TvShows;
