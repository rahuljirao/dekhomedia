import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Line } from 'react-chartjs-2';
import { Pagination, Autoplay } from "swiper/modules";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend
);

const Reports = () => {
    const countersRef = useRef([]);
    const fillsRef = useRef([]);
    const [kpiData] = useState([
        { title: "Total Users", target: 5000, percentage: 80, prefix: "" },
        { title: "Active Sessions", target: 1200, percentage: 60, prefix: "" },
        { title: "Revenue", target: 75000, percentage: 90, prefix: "$" },
        { title: "New Sign-ups", target: 350, percentage: 70, prefix: "" },
    ]);

    useEffect(() => {
        countersRef.current.forEach((counterEl, index) => {
            const target = kpiData[index].target;
            const prefix = kpiData[index].prefix || "";
            const duration = 5000; // 10 seconds
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentValue = Math.floor(progress * target);

                if (counterEl) {
                    counterEl.innerText = prefix + currentValue.toLocaleString();
                }

                const percentage = kpiData[index].percentage;
                if (fillsRef.current[index]) {
                    fillsRef.current[index].style.width = `${progress * percentage}%`;
                }

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    counterEl.innerText = prefix + target.toLocaleString();
                    if (fillsRef.current[index]) {
                        fillsRef.current[index].style.width = `${percentage}%`;
                    }
                }
            };

            requestAnimationFrame(animate);
        });
    }, [kpiData]);

    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Users',
                data: [120, 150, 170, 180, 200, 220],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: false,
            },
            {
                label: 'Sessions',
                data: [80, 100, 130, 160, 180, 210],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
                fill: false,
            },
            {
                label: 'Revenue',
                data: [200, 250, 300, 350, 400, 450],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4,
                fill: false,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Overview Dashboard Metrics',
                color: '#ffffff',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
            legend: {
                labels: {
                    color: '#ffffff',
                },
                position: 'bottom',
            },
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
        scales: {
            x: {
                ticks: { color: '#ffffff' },
                grid: { color: 'rgba(255, 255, 255, 0.11)' },
            },
            y: {
                ticks: { color: '#ffffff' },
                grid: { color: 'rgba(255, 255, 255, 0.11)' },
            },
        },
    };
    return (
        <>
            {/* { loading ? <Loader /> :  */}
            <>
                <section id="reports-section" className="section">
                    <h2>reports</h2>
                    {/* Dashboard Container */}
                    <div className="dashboard-container">
                        {/* KPI Cards */}
                        <div className="kpi-cards">
                            {
                                kpiData.map((item, index) => (
                                    <div className="kpi-card animate__animated animate__fadeInUp" key={index}>
                                        <h3>{item.title}</h3>
                                        <p className="counter" ref={(el) => (countersRef.current[index] = el)}>{item.prefix}0</p>
                                        <div className="progress-bar">
                                            <div className="progress-fill" ref={(el) => (fillsRef.current[index] = el)}></div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        {/* Charts Section */}
                        <div className="charts-section">
                            <Line data={data} options={options} />
                            {/* <canvas id="multiLineChart"></canvas> */}
                        </div>
                    </div>
                    <div className="report-builder-section">
                        <div className="section-title">
                            <h2>Custom Report Builder</h2>
                            <p>Build tailored reports with full control using drag-and-drop, filtering, and scheduling tools.
                            </p>
                        </div>
                        <div className="report-features">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <img src="./assets/images/feature-img-1.png" alt="featured-img" />
                                </div>
                                <h3 className="feature-title">Drag & Drop</h3>
                                <p>Easily arrange data fields in a custom layout that fits your needs.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <img src="./assets/images/feature-img-2.png" alt="featured-img" />
                                </div>
                                <h3 className="feature-title">Filters & Sorting</h3>
                                <p className="feature-description">Apply conditions and sort orders to refine report outputs.</p>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <img src="./assets/images/feature-img-3.png" alt="featured-img" />
                                </div>
                                <h3 className="feature-title">Schedule Reports</h3>
                                <p className="feature-description">Save your reports and schedule them to run automatically.</p>
                            </div>
                        </div>
                        <div className="builder-footer">
                            <p><span>Flexible</span> and <span>intuitive</span> — made for power users and simplicity seekers
                                alike.</p>
                        </div>
                    </div>
                    <div className="communication-logs">
                        <div className="section-title">
                            <h2>Communication Logs</h2>
                            <p>Review system communications like emails, notifications, and user responses.</p>
                        </div>
                        <Swiper
                            modules={[Pagination, Autoplay]}
                            slidesPerView={3}
                            spaceBetween={20}
                            loop={true}
                            autoplay={{ delay: 5000 }}
                            pagination={{ clickable: true }}
                            breakpoints={{
                                0: {
                                    slidesPerView: 1,
                                },
                                575: {
                                    slidesPerView: 2,
                                },
                                1199: {
                                    slidesPerView: 3,
                                },
                            }}
                        >
                            <SwiperSlide>
                                <div className="log-title">📧 Email Dispatch Logs</div>
                                <p className="log-desc">Track sent emails, recipients, delivery status, and timestamps for each campaign.</p>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="log-title">🔔 Notification Delivery</div>
                                <div className="log-desc">View logs of push notifications, their delivery status, and platform-specific insights.</div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="log-title">💬 User Feedback</div>
                                <div className="log-desc">Analyze replies to emails, form submissions, and in-app messages for improvement.</div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="log-title">📊 Communication Summary</div>
                                <p className="log-desc">Get an overview of recent communications, engagement metrics, and response effectiveness.</p>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                    <div className="flowgrid-section">
                        <h2 className="flowgrid-title">Export & Sharing Options</h2>
                        <Swiper
                            className="flow-swiper"
                            modules={[Pagination, Autoplay]}
                            grabCursor={true}
                            spaceBetween={20}
                            autoplay={{ delay: 3000 }}
                            pagination={{ clickable: true }}
                            breakpoints={{
                                0: {
                                    slidesPerView: 1,
                                },
                                575: {
                                    slidesPerView: 2,
                                },
                                1024: {
                                    slidesPerView: 3,
                                },
                            }}
                        >
                            <SwiperSlide className="flow-card">
                                <div className="flow-icon"><i className="fas fa-file-export"></i></div>
                                <h3 className="flow-title">Export Formats</h3>
                                <p className="flow-desc">Get data in CSV, PDF, or Excel to integrate and analyze across tools.</p>
                            </SwiperSlide>
                            <SwiperSlide className="flow-card">
                                <div className="flow-icon"><i className="fas fa-clock"></i></div>
                                <h3 className="flow-title">Scheduled Reports</h3>
                                <p className="flow-desc">Schedule automatic delivery of reports to your inbox — hassle-free and timely.</p>
                            </SwiperSlide>
                            <SwiperSlide className="flow-card">
                                <div className="flow-icon"><i className="fas fa-share-alt"></i></div>
                                <h3 className="flow-title">Smart Sharing</h3>
                                <p className="flow-desc">Securely share reports via links or email — direct to your stakeholders.</p>
                            </SwiperSlide>
                            <SwiperSlide className="flow-card">
                                <div className="flow-icon"><i className="fas fa-database"></i></div>
                                <h3 className="flow-title">Export Formats</h3>
                                <p className="flow-desc">Get data in CSV, PDF, or Excel to integrate and analyze across tools.</p>
                            </SwiperSlide>
                        </Swiper>
                        {/* <div className="swiper flow-swiper">
                                <div className="swiper-wrapper">
                                    <div className="swiper-slide flow-card">
                                        <div className="flow-icon"><i className="fas fa-file-export"></i></div>
                                        <h3 className="flow-title">Export Formats</h3>
                                        <p className="flow-desc">Get data in CSV, PDF, or Excel to integrate and analyze across tools.
                                        </p>
                                    </div>
                                    <div className="swiper-slide flow-card">
                                        <div className="flow-icon"><i className="fas fa-clock"></i></div>
                                        <h3 className="flow-title">Scheduled Reports</h3>
                                        <p className="flow-desc">Schedule automatic delivery of reports to your inbox — hassle-free
                                            and timely.</p>
                                    </div>
                                    <div className="swiper-slide flow-card">
                                        <div className="flow-icon"><i className="fas fa-share-alt"></i></div>
                                        <h3 className="flow-title">Smart Sharing</h3>
                                        <p className="flow-desc">Securely share reports via links or email — direct to your
                                            stakeholders.</p>
                                    </div>
                                    <div className="swiper-slide flow-card">
                                        <div className="flow-icon"><i className="fas fa-database"></i></div>
                                        <h3 className="flow-title">Export Formats</h3>
                                        <p className="flow-desc">Get data in CSV, PDF, or Excel to integrate and analyze across tools.
                                        </p>
                                    </div>
                                </div>
                                <div className="swiper-pagination"></div>
                            </div> */}
                    </div>
                    <div className="security-reports-section">
                        <h2 className="security-title">Security Reports</h2>
                        <p className="security-purpose">Maintain system security and compliance with real-time audit trails and
                            event logs.</p>
                        <div className="security-timeline">
                            <div className="timeline-block">
                                <div className="timeline-icon"><i className="fas fa-user-shield"></i></div>
                                <div className="timeline-content">
                                    <h4>Login Attempts & Failures</h4>
                                    <p>Monitor failed logins across multiple systems like Airtable, ReportPortal, and Aspirity.
                                        Detect anomalies in real time.</p>
                                </div>
                            </div>
                            <div className="timeline-block">
                                <div className="timeline-icon"><i className="fas fa-key"></i></div>
                                <div className="timeline-content">
                                    <h4>Permission Changes</h4>
                                    <p>Track changes in roles and access levels to prevent unauthorized privilege escalation.
                                    </p>
                                </div>
                            </div>
                            <div className="timeline-block">
                                <div className="timeline-icon"><i className="fas fa-database"></i></div>
                                <div className="timeline-content">
                                    <h4>Data Access Logs</h4>
                                    <p>Log and review sensitive data access from sources like ThemeForest, Refine.dev, and
                                        Aspirity.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
            {/* } */}
        </>
    );
};

export default Reports;
