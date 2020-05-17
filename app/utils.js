export function getCurrentMonth() {
    return new Date().toISOString().substr(0, 7);
}

function formatDate(year, month) {
    return `${year}-${month < 10 ? `0${month}` : month}`;
}

export function getPreviousMonth(currentMonth) {
    const year = +currentMonth.substr(0, 4);
    const month = +currentMonth.substr(5, 2) - 1;
    return (month === 0) ? formatDate(year - 1, 12) : formatDate(year, month);
}

export function getNextMonth(currentMonth) {
    const year = +currentMonth.substr(0, 4);
    const month = +currentMonth.substr(5, 2) + 1;
    return (month === 13) ? formatDate(year + 1, 1) : formatDate(year, month);
}