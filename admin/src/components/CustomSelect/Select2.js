import React, { useEffect, useState } from 'react';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';

const animatedComponents = makeAnimated();

const Select2Component = React.memo(({ value, options, onChange, ...props }) => {

    const [data, setData] = useState([]);

    useEffect(() => {
        setData(options.filter(x => value.includes(x.value)));
    }, [value, options])

    const handleChange = (selectedValue) => {
        setData(selectedValue);
        onChange(selectedValue.map(x => x.value));
    }

    return (
        <Select
            components={animatedComponents}
            value={data}
            options={options}
            onChange={handleChange}
            {...props}
            classNamePrefix="select"
        />
    )
});

export default Select2Component;