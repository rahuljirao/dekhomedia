import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as action from "../Action/Users/Users_Action";
import Loader from "./Loader";
import CoinHistory from "./CoinHistory";
import PurchaseCoinHistory from "./PurchaseCoinHistory";
import PurchaseVIPHistory from "./PurchaseVIPHistory";
import SubscriptionSection from "./SubscriptionSection";

const ViewUser = () => {
	const dispatch = useDispatch();
	const { loading } = useSelector((state) => state.GetUsersDetailsReducer);
	const [data, setData] = useState({
		file: [],
	});
	const [activeTab, setActiveTab] = useState("coinHistory");
	const { id } = useParams();
	const hasFetched = useRef(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (hasFetched.current) return;
		hasFetched.current = true;

		const getUsersDetails = async () => {
			dispatch(action.getUsersDetails({ id }))
				.then((response) => {
					setData(response.responseDetails);
				})
				.catch((error) => {
					navigate("/users");
				});
		};

		getUsersDetails();
	}, [dispatch, id, navigate]);
	const formatDate = (inputDate) => {
		if (!inputDate) return "";

		const date = new Date(inputDate);
		if (isNaN(date.getTime())) return ""; // Handle invalid dates

		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
		const year = date.getFullYear();

		return `${day}-${month}-${year}`;
	};
	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<>
					<div className="overview-user-section">
						<h2>🧍 Overview of User</h2>
						<div className="user-overview-section">
							<div className="user-card">
								<div className="user-profile-details">
									<img
										src={
											data.profile_picture && data.profile_picture !== ""
												? data.profile_picture
												: "/assets/images/profil-img-1.png"
										}
										alt="User Avatar"
										className="profile-img"
										onError={(e) => {
											e.target.onerror = null;
											e.target.src = "/assets/images/profil-img-1.png";
										}}
									/>
									<div className="user-info">
										<h3 className="username">
											{data.name ? data.name : "Guest"}
										</h3>
										<p className="email">{data.email ? data.email : ""}</p>
									</div>
								</div>
								<div className="user-details">
									<div>
										<span className="label">Registered:</span>{" "}
										{formatDate(data.created_at)}
									</div>
									<div>
										<span className="label">Status:</span>{" "}
										<span
											className={`status ${
												data.is_blocked ? "danger" : "success"
											}`}
										>
											{" "}
											{data.is_blocked ? "Inactive" : "Active"}{" "}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="subscription-section">
						<h2 className="section-title">🪙 Coin History</h2>
						<div className="coin-section">
							<div className="tabs">
								<button
									className={activeTab === "coinHistory" ? "tab active" : "tab"}
									onClick={() => setActiveTab("coinHistory")}
								>
									Coin History
								</button>
								<button
									className={
										activeTab === "coinPlanHistory" ? "tab active" : "tab"
									}
									onClick={() => setActiveTab("coinPlanHistory")}
								>
									Purchase Coin History
								</button>
								<button
									className={
										activeTab === "vipPlanHistory" ? "tab active" : "tab"
									}
									onClick={() => setActiveTab("vipPlanHistory")}
								>
									VIP Plan History
								</button>
							</div>
						</div>
						<div className="subscription-wrapper">
							{activeTab === "coinHistory" && (
								<div className="tab-content-data">
									<CoinHistory id={id}/>
								</div>
							)}

							{/* Coin Plan History */}
							{activeTab === "coinPlanHistory" && (
								<div className="tab-content-data">
									<PurchaseCoinHistory id={id}/>
								</div>
							)}

							{/* VIP Plan History */}
							{activeTab === "vipPlanHistory" && (
								<div className="tab-content-data">
									<PurchaseVIPHistory id={id}/>
								</div>
							)}
						</div>
					</div>
					{/* subscription user plan section */}
					<SubscriptionSection  data={data}/>
				</>
			)}
		</>
	);
};

export default ViewUser;
