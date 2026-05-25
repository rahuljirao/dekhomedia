const NumberDisplay = ({ count }) => {
    const formatted = new Intl.NumberFormat('en', {
        notation: 'compact',
        compactDisplay: 'short',
    }).format(count);
  
    return formatted;
};

export default NumberDisplay;