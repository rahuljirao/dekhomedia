import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Logout = () => {

    useEffect(() => {
        document.body.classList.add('log-in-page');
        return () => {
            document.body.classList.remove('log-in-page');
        };
    }, []);
    return (
        <>
            <div className="container">
                <div className="image-section"></div>
                <div className="form-section">
                    <div className="form-container log-out-wrp">
                    <img src="/assets/images/Exit-4.png" alt="Logged Out" />
                    <h2>You've Successfully Logged Out</h2>
                    <p>Your session has been securely closed. We hope to see you again soon!</p> 
                    <div>
                        <Link to={"/login"} className="btn btn-primary me-2">Sign In Again</Link>
                    </div>  
                    </div> 
                </div>
            </div>
        </>
    );
};
  
export default Logout;
  