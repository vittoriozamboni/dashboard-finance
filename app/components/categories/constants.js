import { FINANCE_BASE_URL, FINANCE_BREADCRUMBS } from '../../constants';

export const CATEGORIES_BASE_URL = `${FINANCE_BASE_URL}/categories`;

export const CATEGORIES_BREADCRUMBS = [
    ...FINANCE_BREADCRUMBS,
    { link: CATEGORIES_BASE_URL, label: 'Categories' },
];
