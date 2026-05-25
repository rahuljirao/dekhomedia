import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Context';

const SiteDataLoader = () => {
	const { siteData, user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

    useEffect(() => {
		if (!siteData) return;

		let link = document.querySelector("link[rel~='icon']");
		if (!link) {
			link = document.createElement("link");
			link.rel = "icon";
			document.head.appendChild(link);
		}
		if (siteData?.favicon) {
			link.href = siteData.favicon;
		}
		document.title = siteData?.title ?? 'DramaShort';

		if (
			parseInt(siteData?.is_admin_maintenance) === 1 &&
			location.pathname !== '/maintenance' &&
			user?.login_type === 'Guest'
		) {
			navigate('/maintenance');
		}
	}, [siteData, location.pathname, navigate, user]);

	return null;
};

export default SiteDataLoader;