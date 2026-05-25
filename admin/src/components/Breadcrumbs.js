import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
    const location = useLocation();
    const [dynamicBreadcrumbName, setDynamicBreadcrumbName] = useState(null);
    
    const currentRoute = location.pathname;

    // Function to get dynamic content name based on ID
    const getContentTitle = async (id) => {
        // Replace this with your actual API call
        // For example:
        // const response = await fetch(`/api/content/${id}`);
        // const data = await response.json();
        return `Content ${id}`; // Mock title for now
    };

    // Update the dynamic breadcrumb name based on the route
    useEffect(() => {
        const pathParts = currentRoute.split('/');
        if (pathParts[1] === 'content' && !isNaN(pathParts[2])) {
            getContentTitle(pathParts[2]).then(name => {
                setDynamicBreadcrumbName(name);
            });
        } else {
            setDynamicBreadcrumbName(null);
        }
    }, [currentRoute]);

    // Function to format breadcrumb segment (like 'content', 'movies', etc.)
    const formatBreadcrumb = (segment, index, arr) => {
        if (index === arr.length - 1 && dynamicBreadcrumbName) {
            return dynamicBreadcrumbName;
        }
        if (!isNaN(segment)) return `ID: ${segment}`;
        return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    };

    // Generate breadcrumb segments
    const generateBreadcrumbs = () => {
        const pathSegments = currentRoute.split('/').filter(Boolean);
        const breadcrumbs = pathSegments.map((segment, index) => {
            const path = '/' + pathSegments.slice(0, index + 1).join('/');
            return { name: segment, path };
        });

        return breadcrumbs;
    };

    return (
        <div className="breadcrumbs">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/">Home</Link>
                    </li>
                    {generateBreadcrumbs().map((crumb, index, arr) => (
                        <li
                            key={crumb.path}
                            className={`breadcrumb-item ${index === arr.length - 1 ? 'active' : ''}`}
                            aria-current={index === arr.length - 1 ? 'page' : undefined}
                        >
                            {index === arr.length - 1 ? (
                                formatBreadcrumb(crumb.name, index, arr)
                            ) : (
                                <Link to={crumb.path}>{formatBreadcrumb(crumb.name, index, arr)}</Link>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    );
};

export default Breadcrumbs;
