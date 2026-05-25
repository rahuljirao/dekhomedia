import React, { useState } from "react";
import General from "./General";
import Social from "./Social";
import ReportReason from "./ReportReason";
import FAQ from "./FAQ";
import Currency from "./Currency";

const Settings = () => {
    const [activeTab, setActiveTab] = useState("gereralSetting");
    return (
        <>
            <section id="settings-section" className="setting-section section">
                <div className="coin-section">
                    <div className="tabs">
                        <button
                            className={
                                activeTab === "gereralSetting" ? "tab active" : "tab"
                            }
                            onClick={() => setActiveTab("gereralSetting")}
                        >
                            General Setting
                        </button>
                        <button
                            className={
                                activeTab === "currencySetting" ? "tab active" : "tab"
                            }
                            onClick={() => setActiveTab("currencySetting")}
                        >
                            Currency Setting
                        </button>
                        <button
                            className={
                                activeTab === "socialMediaSetting" ? "tab active" : "tab"
                            }
                            onClick={() => setActiveTab("socialMediaSetting")}
                        >
                            Social Link Setting
                        </button>
                        <button
                            className={
                                activeTab === "reportReason" ? "tab active" : "tab"
                            }
                            onClick={() => setActiveTab("reportReason")}
                        >
                            Report Reasons
                        </button>
                        <button
                            className={
                                activeTab === "faq" ? "tab active" : "tab"
                            }
                            onClick={() => setActiveTab("faq")}
                        >
                            FAQ
                        </button>
                    </div>
                </div>
                <div className="subscription-wrapper">
                    {activeTab === "gereralSetting" && (
                        <div className="tab-content-data">
                            <General />
                        </div>
                    )}
                    {activeTab === "currencySetting" && (
                        <div className="tab-content-data">
                            <Currency />
                        </div>
                    )}
                    {activeTab === "socialMediaSetting" && (
                        <div className="tab-content-data">
                            <Social />
                        </div>
                    )}
                    {activeTab === "reportReason" && (
                        <div className="tab-content-data">
                            <ReportReason />
                        </div>
                    )}
                    {activeTab === "faq" && (
                        <div className="tab-content-data">
                            <FAQ />
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Settings;
