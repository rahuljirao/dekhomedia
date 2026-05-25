import React from 'react';
import CreatableSelect from 'react-select/creatable';

const TagSelect = ({ value = [], onChange, placeholder }) => {
    const selectedOptions = value.map(v => ({ label: v, value: v }));

    const handleChange = (selectedOptions) => {
        const newValues = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
        onChange(newValues);
    };

    return (
        <CreatableSelect
            isMulti
            value={selectedOptions}
            onChange={handleChange}
            placeholder={placeholder}
            options={[]}
            classNamePrefix="select"
        />
    );
};

export default TagSelect;
