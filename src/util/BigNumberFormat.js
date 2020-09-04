export const formatBigNumber = n => {
    if (isInt(n)) {
        n = parseInt(n)
        if (n < 1e6) return n;
        if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + ' mil';
        if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + ' bil';
        if (n >= 1e12) return +(n / 1e12).toFixed(1) + ' tril';
    }
    return n;
};

function isInt(value) {
    // eslint-disable-next-line
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
  }