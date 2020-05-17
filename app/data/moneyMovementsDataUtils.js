function getPreviousYearMonth(yearMonth) {
    const [year, month] = yearMonth;

    if (month === 1)
        return [year - 1, 12];
    return [year, month - 1];
}

function yearMonthToString(yearMonth) {
    return `${yearMonth[0]}-${yearMonth[1] < 10 ? '0' + yearMonth[1] : yearMonth[1]}`;
}

export function getMonthsByBoundaries({ fromYearMonth, toYearMonth, previousMonths } = {}) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const minYearMonth = !fromYearMonth ? null : fromYearMonth;
    const maxYearMonth = !toYearMonth ? [currentYear, currentMonth] : toYearMonth;
    const months = [];
    if (previousMonths) {
        let current = maxYearMonth;
        for (let i=0; i<previousMonths; i++) {
            months.push(yearMonthToString(current));
            current = getPreviousYearMonth(current);
        }
    } else if (minYearMonth) {
        const minYM = yearMonthToString(minYearMonth);
        let current = maxYearMonth;
        while (yearMonthToString(current) !== minYM) {
            months.push(yearMonthToString(current));
            current = getPreviousYearMonth(current);
        }
        months.push(yearMonthToString(current));
    }
    return months.sort();
}

export function moneyMovementsByPeriod({ finance, groupParent=true, excludeIncoming=true, fromYearMonth, toYearMonth, previousMonths, moneyMovements }) {
    const mms = moneyMovements || finance.moneyMovements;
    const incoming = Object.values(finance.categories).filter(c => c.name === 'Incoming')[0];
    const filterMonths = getMonthsByBoundaries(
        { fromYearMonth, toYearMonth, previousMonths }
    ).reduce((months, month) => {
        months[month] = true;
        return months;
    }, {});
    const haveFilterMonths = Object.keys(filterMonths).length > 0;

    // Divide by months
    const monthsData = (mms.reduce ? mms : Object.values(mms)).reduce((months, mm) => {
        const month = `${mm.movement_date.split('-')[0]}-${mm.movement_date.split('-')[1]}`;
        // Ignore if the month is not in the list
        if (haveFilterMonths && !filterMonths[month]) return months;

        // Group by first level - if parent is set, use it
        const categoryId = groupParent
            ? finance.categories[mm.category].parent || mm.category
            : mm.category;

        // Ignore "incoming" category
        if (+categoryId === incoming.id && excludeIncoming) return months;

        if (!months[month]) months[month] = [];
        months[month].push(mm);

        return months;
    }, {});

    return monthsData;
}