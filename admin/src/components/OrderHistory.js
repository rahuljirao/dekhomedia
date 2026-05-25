import React, { useState } from 'react';
import PurchaseAllCoinHistory from "./PurchaseAllCoinHistory";
import PurchaseAllVIPHistory from "./PurchaseAllVIPHistory";
const OrderHistory = () => {
    const [activeTab, setActiveTab] = useState("coinOrderHistory");
	return (
		<>
			{/* { loading ? <Loader />  :  */}
				<>
                    <div className='overlay'></div>
                    <section id="notification-section" className="notification-section section">
                        <div className="coin-section">
                            <div className="tabs">
                                <button
                                    className={
                                        activeTab === "coinOrderHistory" ? "tab active" : "tab"
                                    }
                                    onClick={() => setActiveTab("coinOrderHistory")}
                                >
                                    Coin Order History
                                </button>
                                <button
                                    className={
                                        activeTab === "vipOrderHistory" ? "tab active" : "tab"
                                    }
                                    onClick={() => setActiveTab("vipOrderHistory")}
                                >
                                    VIP Order History
                                </button>
                            </div>
                        </div>
                        <div className="subscription-wrapper">
                            {activeTab === "coinOrderHistory" && (
                                <div className="tab-content-data">
                                    <PurchaseAllCoinHistory />
                                </div>
                            )}
                            {activeTab === "vipOrderHistory" && (
                                <div className="tab-content-data">
                                    <PurchaseAllVIPHistory/>
                                </div>
                            )}
                        </div>
                    </section>
				</>
			{/* } */}
		</>
	);

}

export default OrderHistory;