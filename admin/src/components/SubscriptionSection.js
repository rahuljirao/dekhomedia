import React from "react";
import moment from "moment";

const SubscriptionSection = ({ data }) => {
	const today = new Date();

	const activePlans = (data?.userplans || [])
		.filter((plan) => new Date(plan.expire_date) > today)
		.sort((a, b) => new Date(a.expire_date) - new Date(b.expire_date));

	const currentPlan = activePlans[0] || null;
	const upcomingPlan = activePlans[1] || null;

	const renderPlanCard = (plan, label) => {
		const isFreePlan = !plan;

		return (
			<div className="subscription-card">
				<h4>💼 {label}</h4>
				<p className="plan-type premium">
					{isFreePlan ? "Free Plan" : plan.plan_name}
				</p>
				<p>
					<span className="label">Status :</span>{" "}
					<span className="active-tag">Active</span>
				</p>

				{!isFreePlan && (
					<>
						<p>
							<span className="label">Expire Date :</span>{" "}
							{moment(plan.expire_date).format("MMMM DD, YYYY")}
						</p>
						<p>
							<span className="label">Payment Method :</span>{" "}
							{plan.payment_getway_name}
						</p>
					</>
				)}
			</div>
		);
	};

	return (
		<div className="subscription-section">
			<h2 className="section-title">🧾 Subscription / Payment Details</h2>
			<div className="subscription-wrapper">
				{renderPlanCard(currentPlan, "Current Plan")}
				{upcomingPlan && renderPlanCard(upcomingPlan, "Upcoming Plan")}
			</div>
		</div>
	);
};

export default SubscriptionSection;
