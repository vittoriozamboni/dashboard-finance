import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Breadcrumbs } from 'components/ui/Breadcrumbs';
import { PageBody } from 'components/ui/PageBody';
import { PageHeader } from 'components/ui/PageHeader';

import { FINANCE_BASE_URL, FINANCE_BREADCRUMBS } from '../../constants';
import { withFinance } from '../../storeConnection';
import { CategoriesTiles } from './CategoriesTiles';

function Categories({ finance }) {
    const { categoriesTree } = finance;

    const controls = <Controls />;

    return <Fragment>
        <PageHeader controls={controls}>
            <Breadcrumbs breadcrumbs={FINANCE_BREADCRUMBS} />
            Categories
        </PageHeader>
        <PageBody>
            <CategoriesTiles categoriesTree={categoriesTree} />
        </PageBody>
    </Fragment>;
}

Categories.propTypes = {
    finance: PropTypes.object,
};

const connectedCategories = withFinance(Categories);
export { connectedCategories as Categories };

function Controls() {
    const baseClass = 'ui-button ui-button--small';
    return <Fragment>
        <Link
            to={`${FINANCE_BASE_URL}/categories/add`}
            className={`${baseClass} ui-button--primary`}
        >Add Category</Link>
    </Fragment>;
}
