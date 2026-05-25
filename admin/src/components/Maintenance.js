import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/Context";

const Maintenance = () => {
    const { siteData, user } = useAuth();
	const navigate = useNavigate();

    useEffect(() => {
        if(!siteData) return;

        if(parseInt(siteData?.is_admin_maintenance) === 0 || user?.login_type !== 'Guest'){
			navigate('/');
        }

    }, [siteData, user, navigate])
    return(
        <div className="under-maintenance">
            <div className="container">
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="what-is-up">

                        <div className="spinny-cogs">
                            <i className="fa fa-cog"></i>
                            <i className="fa fa-5x fa-cog fa-spin"></i>
                            <i className="fa fa-3x fa-cog"></i>
                        </div>
                        <h1 className="maintenance-title">{siteData?.title} Admin Panel is Under Maintenance</h1>
                        <p>We're currently performing scheduled maintenance and upgrades to keep the platform running smoothly.</p>
                        <p className="my-1">The admin panel will be back online shortly.</p>
                        <p>Thank you for your patience and understanding.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Maintenance;