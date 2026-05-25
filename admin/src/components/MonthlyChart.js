import React from "react";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	LineElement,
	CategoryScale,
	LinearScale,
	PointElement,
	Tooltip,
	Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
	LineElement,
	CategoryScale,
	LinearScale,
	PointElement,
	Tooltip,
	Legend
);

const MonthlyChart = ({ monthlyData }) => {
	// Example data for the month
	const data = {
		labels: monthlyData.map((day) => day.date), // Day labels (e.g., 1, 2, 3...)
		datasets: [
			{
				label: "Views",
				data: monthlyData.map((day) => day.views), // Data for views
				borderColor: "#1F7A1F",
				backgroundColor: "#1F7A1F",
				tension: 0.3,
				borderWidth: 2,
				pointRadius: 4,
				pointBackgroundColor: "#1F7A1F",
			},
			{
				label: "Uploaded Files",
				data: monthlyData.map((day) => day.uploadedFiles), // Data for uploaded files
				borderColor: "#FFAB00",
				backgroundColor: "#FFAB00",
				tension: 0.3,
				borderWidth: 2,
				pointRadius: 4,
				pointBackgroundColor: "#FFAB00",
			},
			{
				label: "Earnings",
				data: monthlyData.map((day) => day.earnings), // Data for earnings
				borderColor: "#00B8D9",
				backgroundColor: "#00B8D9",
				tension: 0.3,
				borderWidth: 2,
				pointRadius: 4,
				pointBackgroundColor: "#00B8D9",
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top",
				labels: {
					font: {
						size: 12,
					},
					color: "#333", // Neutral text color
				},
			},
			tooltip: {
				enabled: true,
			},
		},
		scales: {
			x: {
				ticks: {
					color: "#666",
				},
				grid: {
					display: false,
				},
			},
			y: {
				ticks: {
					color: "#666",
				},
				grid: {
					borderDash: [5, 5], // Dashed grid
				},
			},
		},
	};

	return <Line data={data} options={options} />;
};

export default MonthlyChart;
