export const FINANCE_BASE_URL = '/apps/finance';

export const FINANCE_BREADCRUMBS = [
    { link: '/', label: 'Dashboard' },
    { link: FINANCE_BASE_URL, label: 'Finance' },
];

export const FINANCE_PERIODS = {
    ALL: { key: 'ALL', previousMonths: null, label: 'All', order: 1 },
    CURRENT_MONTH: { key: 'CURRENT_MONTH', previousMonths: 1, label: `Month`, order: 2 },
    CURRENT_YEAR: { key: 'CURRENT_YEAR', previousMonths: new Date().getMonth() + 1, label: `${new Date().getFullYear()}`, order: 3 },
    LAST_2_YEARS: { key: 'LAST_2_YEARS', previousMonths: new Date().getMonth() + 1 + 12, label: '2Y', order: 4 },
    LAST_3_YEARS: { key: 'LAST_3_YEARS', previousMonths: new Date().getMonth() + 1 + 24, label: '3Y', order: 5 },
};

export const FINANCE_PERIODS_DEFAULT = 'CURRENT_YEAR';
