import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import * as action from "../Action/Dashboard/Dashboard_Action";
import Loader from "./Loader";
import {
	Chart as ChartJS,
	LineElement,
	PointElement,
	LinearScale,
	CategoryScale,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import NiceSelect from "./CustomSelect";

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

const Dashboard = () => {
	const dispatch = useDispatch();
	const hasFetched = useRef(null);
	const { loading } = useSelector((state) => state.GetDashboardDetailsReducer);
	const [data, setData] = useState({
		users: 0,
		series: 0,
		genres: 0,
		languages: 0,
		totalRevenue: 0,
		monthlyChart: {},
		weeklyChart: {},
		dailyChart: {},
	});

	useEffect(() => {
		if (hasFetched.current) return;
		hasFetched.current = true;

		const getData = () => {
			dispatch(action.getDashboardDetails()).then((action) => {
				setData((prevData) => ({ ...prevData, ...action.responseDetails }));
			});
		};

		getData();
	}, [dispatch]);

	const chartDataSets = {
		daily: {
			labels: data.dailyChart.labels,
			datasets: [
				{
					label: "Users",
					data: data.dailyChart.users,
					borderColor: "#FACC15",
					backgroundColor: "#FACC15",
					tension: 0.4,
					fill: false,
				},
				{
					label: "Revenue (K)",
					data: data.dailyChart.revenue,
					borderColor: "#FF5733",
					backgroundColor: "#FF5733",
					tension: 0.4,
					fill: false,
				},
			],
		},
		weekly: {
			labels: data.weeklyChart.labels,
			datasets: [
				{
					label: "Users",
					data: data.weeklyChart.users,
					borderColor: "#FACC15",
					backgroundColor: "#FACC15",
					tension: 0.4,
					fill: false,
				},
				{
					label: "Revenue (K)",
					data: data.weeklyChart.revenue,
					borderColor: "#FF5733",
					backgroundColor: "#FF5733",
					tension: 0.4,
					fill: false,
				},
			],
		},
		monthly: {
			labels: data.monthlyChart.labels,
			datasets: [
				{
					label: "Users",
					data: data.monthlyChart.users,
					borderColor: "#FACC15",
					backgroundColor: "#FACC15",
					tension: 0.4,
					fill: false,
				},
				{
					label: "Revenue (K)",
					data: data.monthlyChart.revenue,
					borderColor: "#FF5733",
					backgroundColor: "#FF5733",
					tension: 0.4,
					fill: false,
				},
			],
		},
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			title: {
				display: true,
				text: "Overview Dashboard Metrics",
				color: "#ffffff",
			},
			tooltip: {
				mode: "index",
				intersect: false,
			},
			legend: {
				labels: {
					color: "#ffffff",
				},
				position: "bottom",
			},
		},
		interaction: {
			mode: "nearest",
			axis: "x",
			intersect: false,
		},
		scales: {
			x: {
				ticks: { color: "#ffffff" },
				grid: { color: "rgba(255, 255, 255, 0.11)" },
			},
			y: {
				ticks: { color: "#ffffff" },
				grid: { color: "rgba(255, 255, 255, 0.11)" },
			},
		},
	};
	const [view, setView] = useState("monthly");
	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<>
					<section id="dashboard-section" className="dashboard-section section">
						<div className="dashboard-cards">
							<div className="dashboard-blog">
								<div className="dashboard-blog-content">
									<div className="card-icon">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="feather feather-users"
										>
											<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
											<circle cx="9" cy="7" r="4"></circle>
											<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
											<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
										</svg>
									</div>
									<div className="dashboard-blog-content-top">
										<p> {data.users} </p>
										<Link to={"/users"} id="user-btn">
											Users
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="feather feather-arrow-up-right"
											>
												<line x1="7" y1="17" x2="17" y2="7"></line>
												<polyline points="7 7 17 7 17 17"></polyline>
											</svg>
										</Link>
									</div>
								</div>
							</div>
							<div className="dashboard-blog">
								<div className="dashboard-blog-content">
									<div className="card-icon">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="feather feather-video"
										>
											<polygon points="23 7 16 12 23 17 23 7"></polygon>
											<rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
										</svg>
									</div>
									<div className="dashboard-blog-content-top">
										<p> {data.series} </p>
										<Link to={"/series"} id="Content-btn">
											Series
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="feather feather-arrow-up-right"
											>
												<line x1="7" y1="17" x2="17" y2="7"></line>
												<polyline points="7 7 17 7 17 17"></polyline>
											</svg>
										</Link>
									</div>
								</div>
							</div>
							{/* <div className="dashboard-blog">
                                <div className="dashboard-blog-content">
                                    <div className="card-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                            strokeLinejoin="round" className="feather feather-star">
                                            <polygon
                                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                                            </polygon>
                                        </svg>
                                    </div>
                                    <div className="dashboard-blog-content-top">
                                        <p> 31 </p>
                                        <a href="https://flixy.retrytech.site/actors">
                                            Actors
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round" className="feather feather-arrow-up-right">
                                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                                <polyline points="7 7 17 7 17 17"></polyline>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div> */}
							<div className="dashboard-blog">
								<div className="dashboard-blog-content">
									<div className="card-icon">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="feather feather-package"
										>
											<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
											<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
											<polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
											<line x1="12" y1="22.08" x2="12" y2="12"></line>
										</svg>
									</div>
									<div className="dashboard-blog-content-top">
										<p> {data.genres} </p>
										<Link to={"/genres"}>
											Genres
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="feather feather-arrow-up-right"
											>
												<line x1="7" y1="17" x2="17" y2="7"></line>
												<polyline points="7 7 17 7 17 17"></polyline>
											</svg>
										</Link>
									</div>
								</div>
							</div>
							<div className="dashboard-blog">
								<div className="dashboard-blog-content">
									<div className="card-icon">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="feather feather-globe"
										>
											<circle cx="12" cy="12" r="10"></circle>
											<line x1="2" y1="12" x2="22" y2="12"></line>
											<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
										</svg>
									</div>
									<div className="dashboard-blog-content-top">
										<p> {data.languages} </p>
										<Link to={"/languages"}>
											Languages
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="feather feather-arrow-up-right"
											>
												<line x1="7" y1="17" x2="17" y2="7"></line>
												<polyline points="7 7 17 7 17 17"></polyline>
											</svg>
										</Link>
									</div>
								</div>
							</div>
							{/* <div className="dashboard-blog">
                                <div className="dashboard-blog-content">
                                    <div className="card-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                            strokeLinejoin="round" className="feather feather-cast">
                                            <path
                                                d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6">
                                            </path>
                                            <line x1="2" y1="20" x2="2" y2="20"></line>
                                        </svg>
                                    </div>
                                    <div className="dashboard-blog-content-top">
                                        <p> 10 </p>
                                        <a href="https://flixy.retrytech.site/liveTvCategories">
                                            Live Tv Categories
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round" className="feather feather-arrow-up-right">
                                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                                <polyline points="7 7 17 7 17 17"></polyline>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div> */}
							{/* <div className="dashboard-blog">
                                <div className="dashboard-blog-content">
                                    <div className="card-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                            strokeLinejoin="round" className="feather feather-airplay">
                                            <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1">
                                            </path>
                                            <polygon points="12 15 17 21 7 21 12 15"></polygon>
                                        </svg>
                                    </div>
                                    <div className="dashboard-blog-content-top">
                                        <p> 25 </p>
                                        <a href="https://flixy.retrytech.site/liveTvChannels">
                                            Live Tv Channels
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round" className="feather feather-arrow-up-right">
                                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                                <polyline points="7 7 17 7 17 17"></polyline>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div> */}
							{/* <div className="dashboard-blog">
                                <div className="dashboard-blog-content">
                                    <div className="card-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                            strokeLinejoin="round" className="feather feather-bell">
                                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                        </svg>
                                    </div>
                                    <div className="dashboard-blog-content-top">
                                        <p> 1 </p>
                                        <Link to={"/notification"}>
                                            Notifications
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round" className="feather feather-arrow-up-right">
                                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                                <polyline points="7 7 17 7 17 17"></polyline>
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div> */}
							{/* <div className="dashboard-blog">
                                <div className="dashboard-blog-content">
                                    <div className="card-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                            strokeLinejoin="round" className="feather feather-activity">
                                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                        </svg>
                                    </div>
                                    <div className="dashboard-blog-content-top">
                                        <p> 2 </p>
                                        <Link to="https://flixy.retrytech.site/admob">
                                            Admob
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round" className="feather feather-arrow-up-right">
                                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                                <polyline points="7 7 17 7 17 17"></polyline>
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div> */}
							{/* <div className="dashboard-blog">
                                <div className="dashboard-blog-content">
                                    <div className="card-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                            strokeLinejoin="round" className="feather feather-fast-forward">
                                            <polygon points="13 19 22 12 13 5 13 19"></polygon>
                                            <polygon points="2 19 11 12 2 5 2 19"></polygon>
                                        </svg>
                                    </div>
                                    <div className="dashboard-blog-content-top">
                                        <p> 3 </p>
                                        <a href="https://flixy.retrytech.site/customAds">
                                            Custom Ads
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round" className="feather feather-arrow-up-right">
                                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                                <polyline points="7 7 17 7 17 17"></polyline>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div> */}
							<div className="dashboard-blog">
								<div className="dashboard-blog-content">
									<div className="card-icon">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="feather feather-settings"
										>
											<circle cx="12" cy="12" r="3"></circle>
											<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
										</svg>
									</div>
									<div className="dashboard-blog-content-top">
										<p> </p>
										<Link to={"/settings"}>
											Settings
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="feather feather-arrow-up-right"
											>
												<line x1="7" y1="17" x2="17" y2="7"></line>
												<polyline points="7 7 17 7 17 17"></polyline>
											</svg>
										</Link>
									</div>
								</div>
							</div>
							<div className="dashboard-blog">
								<div className="dashboard-blog-content">
									<div className="card-icon">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="feather feather-dollar-sign"
										>
											<line x1="12" y1="1" x2="12" y2="23"></line>
											<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
										</svg>
									</div>
									<div className="dashboard-blog-content-top">
										<p> {(Number(data.totalRevenue) || 0).toFixed()} </p>
										<Link to={"/order-history"}>
											Total Revenue
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="feather feather-arrow-up-right"
											>
												<line x1="7" y1="17" x2="17" y2="7"></line>
												<polyline points="7 7 17 7 17 17"></polyline>
											</svg>
										</Link>
									</div>
								</div>
							</div>
						</div>
						<div></div>
					</section>
					<section id="reports-section" className="section reports-section">
						<div className="dashboard-container">
							<div className="charts-section">
								<NiceSelect className="form-control  chart-select" name="view" value={view} onChange={(name, value) => setView(value)}>
									<option value="daily">Daily</option>
									<option value="weekly">Weekly</option>
									<option value="monthly">Monthly</option>
								</NiceSelect>
								{/* <div className="pt-5"></div> */}
								<Line data={chartDataSets[view]} options={options} />
							</div>
						</div>
					</section>
				</>
			)}
		</>
	);
};

export default Dashboard;
