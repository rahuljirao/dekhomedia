import React from 'react';

const NumberInput = React.memo(({ onChange, ...props }) => {
    const handleWheel = (event) => {
        event.target.blur(); // or event.preventDefault(); to keep focus
    };

    return (
        <input
            type="number"
            onWheel={handleWheel}
            {...props}
            onChange={onChange}
        />
    );
})

export default NumberInput;