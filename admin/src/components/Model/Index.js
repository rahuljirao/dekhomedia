import React from 'react';

const Model = ({ children, onChange, ...props }) => {
    return (
        <>
            <div {...props}>
                {children}
            </div>
        </>
    );
};

export default Model;
