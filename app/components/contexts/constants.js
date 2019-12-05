import { FINANCE_BASE_URL, FINANCE_BREADCRUMBS } from '../../constants';

export const CONTEXTS_BASE_URL = `${FINANCE_BASE_URL}/contexts`;

export const CONTEXTS_BREADCRUMBS = [
    ...FINANCE_BREADCRUMBS,
    { link: CONTEXTS_BASE_URL, label: 'Contexts' },
];
