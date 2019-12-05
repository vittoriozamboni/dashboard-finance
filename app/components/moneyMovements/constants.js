import { FINANCE_BASE_URL, FINANCE_BREADCRUMBS } from '../../constants';

export const MONEY_MOVEMENTS_BASE_URL = `${FINANCE_BASE_URL}/money-movements`;

export const MONEY_MOVEMENTS_BREADCRUMBS = [
    ...FINANCE_BREADCRUMBS,
    { link: MONEY_MOVEMENTS_BASE_URL, label: 'Money Movements' },
];
