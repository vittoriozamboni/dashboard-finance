import { FINANCE_BASE_URL, FINANCE_BREADCRUMBS } from '../../constants';

export const VENDORS_BASE_URL = `${FINANCE_BASE_URL}/vendors`;

export const VENDORS_BREADCRUMBS = [
    ...FINANCE_BREADCRUMBS,
    { link: VENDORS_BASE_URL, label: 'Vendors' },
];
