import React, { useEffect, useRef } from 'react';

const NiceSelect = React.memo(({ children, onChange, ...props }) => {
  const selectRef = useRef(null);

  useEffect(() => {
    let selectRefCurrent = selectRef.current;
    const $ = window.$ || window.jQuery;

    if ($ && selectRefCurrent) {
      $(selectRefCurrent).niceSelect();

      // Listen for change event and trigger the passed onChange handler
      $(selectRefCurrent).on('change', (e) => {
        const selectedValue = $(e.target).val();
        // Trigger the passed onChange with the selected value
        onChange && onChange(e.target.name, selectedValue); // Pass the selected value to the onChange prop
      });
    }

    // Optional cleanup
    return () => {
      if ($ && selectRefCurrent) {
        $(selectRefCurrent).niceSelect('destroy');
      }
    };
  }, [onChange]);

  return (
    <select ref={selectRef} {...props} onChange={(e) => {}}>
        {children}
    </select>
  );
});

export default NiceSelect;
