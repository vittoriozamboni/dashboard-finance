import { FINANCE_BASE_URL, FINANCE_BREADCRUMBS } from '../../constants';

export const ACCOUNTS_BASE_URL = `${FINANCE_BASE_URL}/accounts`;

export const ACCOUNTS_BREADCRUMBS = [
    ...FINANCE_BREADCRUMBS,
    { link: ACCOUNTS_BASE_URL, label: 'Accounts' },
];
