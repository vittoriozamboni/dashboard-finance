import { FINANCE_BASE_URL, FINANCE_BREADCRUMBS } from '../../constants';

export const TRANSACTIONS_BASE_URL = `${FINANCE_BASE_URL}/transactions`;

export const TRANSACTIONS_BREADCRUMBS = [
    ...FINANCE_BREADCRUMBS,
    { link: TRANSACTIONS_BASE_URL, label: 'Transactions' },
];
