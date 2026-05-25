import React from "react";
import NiceSelect from "../CustomSelect";

const Security = () => {
    return (
        <>
            <div className="security-settings-section">
                <h2 className="section-title">Security Settings</h2>
                <form className="settings-form">
                    <div className="row">
                        <div className="col-md-6 col-12">
                            <div className="form-group">
                                <label htmlFor="password-rules">Password Strength Requirements</label>
                                <NiceSelect id="password-rules" onChange={(e) => console.log(e)}>
                                    <option value="medium">Medium (min 8 chars, mix of letters/numbers)</option>
                                    <option value="strong">Strong (min 12 chars, special characters,
                                        upper/lower)
                                    </option>
                                    <option value="custom">Custom Rules</option>
                                </NiceSelect>
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="form-group">
                                <label htmlFor="admin-restrictions">Admin Access Restrictions</label>
                                <NiceSelect id="admin-restrictions" onChange={(e) => console.log(e)}>
                                    <option>Only from Whitelisted IPs</option>
                                    <option>Time-based Access Windows</option>
                                    <option>Device-based Verification</option>
                                </NiceSelect>
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="form-group">
                                <label htmlFor="ip-whitelist">IP Whitelist (Allowed)</label>
                                <textarea id="ip-whitelist" placeholder="Enter allowed IPs, one per line"></textarea>
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="form-group">
                                <label htmlFor="ip-blacklist">IP Blacklist (Blocked)</label>
                                <textarea id="ip-blacklist" placeholder="Enter blocked IPs, one per line"></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="setting-btn">
                        <button type="submit" className="btn">Save Security Settings</button>
                    </div>
                </form>
            </div> 
        </>
    );
};

export default Security;
