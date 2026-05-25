import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import MonthlyChart from "./MonthlyChart";
import * as action from '../Action/Analytics/Analytics_Action';
import Loader from "./Loader";

const Analytics = ({ closeDrawer, logout, verifyToken }) => {
	const dispatch = useDispatch();
	const { loading } = useSelector(state => state.GetAnalyticsReducer);
	const [revenue, setRevenue] = useState({});
	const [dailyAnalytics, setDailyAnalytics] = useState({});
	const [monthlyAnalytics, setMonthlyAnalytics] = useState({
		monthly: {},
		monthlyChart: []
	});
	const hasFetched = useRef(false);
	const [selectedDate, setSelectedDate] = useState("");
	const currentMonthIndex = new Date().getMonth() + 1;
	const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex);
	const todayDate = new Date().toISOString().split("T")[0];

	const getLast12Months = () => {
		const months = [];
		const currentDate = new Date();

		for (let i = 0; i < 12; i++) {
			const monthDate = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth() - i,
				1
			);
			const monthName = monthDate.toLocaleString("default", { month: "long" });
			const monthIndex = monthDate.getMonth() + 1;
			const year = monthDate.getFullYear();
			months.push({ name: `${monthName} ${year}`, index: monthIndex });
		}
		return months;
	};

	const last12Months = getLast12Months();

	useEffect(() => {
		if (hasFetched.current) return;
		hasFetched.current = true;

		verifyToken();
		getAnalytics();
		getDailyAnalytics(todayDate);
		let index = last12Months.findIndex(x => x.index === selectedMonth);
		if (index >= 0) {
			let month = last12Months[index].name.split(" ");
			getMonthlyAnalytics({
				month: month[0],
				year: month[1]
			});
		}
	}, []);

	const getAnalytics = async () => {
		dispatch(action.getAnalytics()).then((response) => {
			setRevenue(response.responseDetails);
		}).catch(error => {
			toast.error(error.responseMessage);
		})
	}

	const getDailyAnalytics = async (date) => {
		dispatch(action.getDailyAnalytics({ date: date })).then((response) => {
			setDailyAnalytics(response.responseDetails);
		}).catch(error => {
			toast.error(error.responseMessage);
		})
	}

	const getMonthlyAnalytics = async (data) => {
		dispatch(action.getMonthlyAnalytics(data)).then((response) => {
			setMonthlyAnalytics(response.responseDetails);
		}).catch(error => {
			toast.error(error.responseMessage);
		})
	}

	const handleDateChange = (e) => {
		setSelectedDate(e.target.value);
		getDailyAnalytics(e.target.value || todayDate);
	};

	const monthlyData = Array.from({ length: 30 }, (_, index) => ({
		date: index + 1,
		views: Math.floor(Math.random() * 1000),
		uploadedFiles: Math.floor(Math.random() * 50),
		earnings: (Math.random() * 100).toFixed(2),
	}));

	const handleMonthChange = (e) => {
		setSelectedMonth(e.target.value);
		let index = last12Months.findIndex(x => x.index == e.target.value);
		if (index >= 0) {
			let month = last12Months[index].name.split(" ");
			getMonthlyAnalytics({
				month: month[0],
				year: month[1]
			});
		}
	}
	return (
		<>
			{loading ? <Loader /> :
				<>
					<ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
					<div className="p-4 lg:ml-[300px] bg-[#F4F6F8]" onClick={closeDrawer}>
						<div className="rounded-lg">
							<div className="relative">
								<button type="button"
									onClick={logout}
									className="text-sm absolute top-0 right-0 border-2 px-3 py-2 rounded-lg font-semibold"
								>
									Logout
								</button>
							</div>
						</div>
						<div className="p-4 px-2 sm:px-10 pt-16 md:pt-24 rounded-lg dark:border-gray-700">
							<h1 className="text-lg sm:text-xl md:text-2xl font-bold">
								Revenue Details
							</h1>
							<p className="text-sm sm:text-base">
								Check your paid, pending, and remaining revenue details...
							</p>
							<div className="grid bg-white my-5 rounded-2xl shadow-md">
								<div className="grid custom-grid gap-6 mb-2">
									{[
										{ img: "/user/total.png", label: "Total", value: `$${revenue?.total || 0}` },
										{ img: "/user/paid.png", label: "Paid", value: `$${revenue?.paid || 0}` },
										{
											img: "/user/available.png",
											label: "Available",
											value: `$${revenue?.available || 0}`,
										},
										{
											img: "/user/approved.png",
											label: "Approved",
											value: `$${revenue?.approved || 0}`,
										},
										{ img: "/user/pending.png", label: "Pending", value: `$${revenue?.pending || 0}` },
										{
											img: "/user/cancelled.png",
											label: "Cancelled",
											value: `$${revenue?.cancelled || 0}`,
										},
									].map((item, index) => (
										<div key={index} className="flex rounded h-20 sm:h-24">
											<div className="flex flex-row gap-40 sm:gap-5 items-center justify-center w-full min-w-[180px] sm:min-w-[200px]">
												<div className="relative w-12 h-12 sm:w-14 sm:h-14">
													<img
														src={item.img}
														alt={item.label}
														className="w-full h-full object-contain"
													/>
												</div>
												<div className="flex flex-col items-left">
													<h6 className="text-sm sm:text-lg font-semibold text-gray-700">
														{item.label}
													</h6>
													<h6 className="text-base font-bold text-gray-900">
														{item.value}
													</h6>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						<div className="p-4 px-2 sm:px-10 pt-5 rounded-lg dark:border-gray-700">
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
								<div className="left-0 mb-4 sm:mb-0">
									<h1 className="text-lg sm:text-xl font-bold">Daily Analytics</h1>
									<p className="text-sm sm:text-base">
										Check your daily analytics, OG link earning and total earnings.
									</p>
								</div>
								<div className="right-0">
									<input
										type="date"
										value={selectedDate || todayDate}
										onChange={handleDateChange}
										className="border border-gray-300 rounded-md p-2 px-4 sm:px-6 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-transparent w-full sm:w-auto"
									/>
								</div>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
								<div className="flex items-center justify-center rounded-2xl bg-white h-30">
									<div className="flex flex-row items-center justify-between w-full min-w-[200px] py-5">
										<div className="flex flex-col items-start pl-4 sm:pl-6">
											<h6 className="text-2xl sm:text-3xl font-bold text-gray-700">
												{dailyAnalytics?.files || 0}
											</h6>
											<h6 className="text-sm sm:text-base font-semibold text-gray-900">
												Uploaded Files
											</h6>
										</div>
										<div className="relative">
											<img
												src="/user/today_Uploaded_files.webp"
												className="w-[80px] sm:w-[120px]"
												alt="total"
											/>
										</div>
									</div>
								</div>
								<div className="flex items-center justify-center rounded-2xl bg-white h-30">
									<div className="flex flex-row items-center justify-between w-full min-w-[200px] py-5">
										<div className="flex flex-col items-start pl-4 sm:pl-6">
											<h6 className="text-2xl sm:text-3xl font-bold text-gray-700">
												{dailyAnalytics?.views || 0}
											</h6>
											<h6 className="text-sm sm:text-base font-semibold text-gray-900">
												Views
											</h6>
										</div>
										<div className="relative">
											<img
												src="/user/Views_daily.webp"
												className="w-[80px] sm:w-[120px]"
												alt="total"
											/>
										</div>
									</div>
								</div>
								<div className="flex items-center justify-center rounded-2xl bg-white h-30">
									<div className="flex flex-row items-center justify-between w-full min-w-[200px] py-5">
										<div className="flex flex-col items-start pl-4 sm:pl-6">
											<h6 className="text-2xl sm:text-3xl font-bold text-gray-700">
												${dailyAnalytics?.og_earning || 0}
											</h6>
											<h6 className="text-sm sm:text-base font-semibold text-gray-900">
												OG Link Earning
											</h6>
										</div>
										<div className="relative">
											<img
												src="/user/daily_og_link_earning.webp"
												className="w-[80px] sm:w-[120px]"
												alt="total"
											/>
										</div>
									</div>
								</div>
								<div className="flex items-center justify-center rounded-2xl bg-white h-30">
									<div className="flex flex-row items-center justify-between w-full min-w-[200px] py-5">
										<div className="flex flex-col items-start pl-4 sm:pl-6">
											<h6 className="text-2xl sm:text-3xl font-bold text-gray-700">
												${dailyAnalytics?.total_earning || 0}
											</h6>
											<h6 className="text-sm sm:text-base font-semibold text-gray-900">
												Total Earnings
											</h6>
										</div>
										<div className="relative">
											<img
												src="/user/total_earnings_daily.webp"
												className="w-[80px] sm:w-[120px]"
												alt="total"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<hr></hr>
						<div className="p-4 px-2 sm:px-10 pt-5 rounded-lg dark:border-gray-700">
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
								<div className="left-0 mb-4 sm:mb-0">
									<h1 className="text-lg sm:text-xl font-bold">
										Monthly Analytics
									</h1>
									<p className="text-sm sm:text-base">
										Check your Monthly views, uploaded files, OG link earning, and
										total earnings.
									</p>
								</div>
								<div className="right-0">
									<select
										value={selectedMonth}
										onChange={handleMonthChange}
										className="border border-gray-300 rounded-md p-2 px-4 sm:px-6 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-transparent w-full sm:w-auto"
									>
										{last12Months.map((month, index) => (
											<option key={index} value={month.index}>
												{month.name}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
								<div className="flex items-center justify-center rounded-2xl bg-white h-30">
									<div className="flex flex-row items-center justify-between w-full min-w-[200px] py-5">
										<div className="flex flex-col items-start pl-4 sm:pl-6">
											<h6 className="text-2xl sm:text-3xl font-bold text-gray-700">
												{monthlyAnalytics.monthly?.files || 0}
											</h6>
											<h6 className="text-sm sm:text-base font-semibold text-gray-900">
												Uploaded Files
											</h6>
										</div>
										<div className="relative">
											<img
												src="/user/today_Uploaded_files.webp"
												className="w-[80px] sm:w-[120px]"
												alt="total"
											/>
										</div>
									</div>
								</div>
								<div className="flex items-center justify-center rounded-2xl bg-white h-30">
									<div className="flex flex-row items-center justify-between w-full min-w-[200px] py-5">
										<div className="flex flex-col items-start pl-4 sm:pl-6">
											<h6 className="text-2xl sm:text-3xl font-bold text-gray-700">
												{monthlyAnalytics.monthly?.views || 0}
											</h6>
											<h6 className="text-sm sm:text-base font-semibold text-gray-900">
												Views
											</h6>
										</div>
										<div className="relative">
											<img
												src="/user/Views_daily.webp"
												className="w-[80px] sm:w-[120px]"
												alt="total"
											/>
										</div>
									</div>
								</div>
								<div className="flex items-center justify-center rounded-2xl bg-white h-30">
									<div className="flex flex-row items-center justify-between w-full min-w-[200px] py-5">
										<div className="flex flex-col items-start pl-4 sm:pl-6">
											<h6 className="text-2xl sm:text-3xl font-bold text-gray-700">
												${monthlyAnalytics.monthly?.og_earning || 0}
											</h6>
											<h6 className="text-sm sm:text-base font-semibold text-gray-900">
												OG Link Earning
											</h6>
										</div>
										<div className="relative">
											<img
												src="/user/daily_og_link_earning.webp"
												className="w-[80px] sm:w-[120px]"
												alt="total"
											/>
										</div>
									</div>
								</div>
								<div className="flex items-center justify-center rounded-2xl bg-white h-30">
									<div className="flex flex-row items-center justify-between w-full min-w-[200px] py-5">
										<div className="flex flex-col items-start pl-4 sm:pl-6">
											<h6 className="text-2xl sm:text-3xl font-bold text-gray-700">
												${monthlyAnalytics.monthly?.total_earning || 0}
											</h6>
											<h6 className="text-sm sm:text-base font-semibold text-gray-900">
												Total Earnings
											</h6>
										</div>
										<div className="relative">
											<img
												src="/user/total_earnings_daily.webp"
												className="w-[80px] sm:w-[120px]"
												alt="total"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<hr></hr>
						<div className="p-4 px-2 sm:px-10 rounded-lg dark:border-gray-700">
							<div className="p-4 px-6 sm:px-10 pt-5 grid bg-white rounded-2xl shadow-md">
								<h1 className="text-lg sm:text-xl font-bold">
									Monthly Analytics
								</h1>
								<p className="text-sm sm:text-base">
									Monthly Views, Files, Earnings Numbers
								</p>
								<div className="h-[400px] overflow-x-auto">
									<MonthlyChart monthlyData={monthlyAnalytics.monthlyChart || monthlyData} />
								</div>
							</div>
						</div>
					</div>
				</>
			}
		</>
	);
};

export default Analytics;
