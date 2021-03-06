import React, { Fragment, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { ALink } from 'components/ui/ALink';
import { Breadcrumbs } from 'components/ui/Breadcrumbs';
import { Icon } from 'components/ui/Icon';
import { PageBody } from 'components/ui/PageBody';
import { PageHeader } from 'components/ui/PageHeader';
import { Table } from 'components/ui/table/Table';

import { moneyMovementsByPeriod } from '../../data/moneyMovementsDataUtils';
import { FINANCE_BREADCRUMBS, FINANCE_PERIODS } from '../../constants';
import { withFinance } from '../../storeConnection';
import { CATEGORIES_BASE_URL } from './constants';
import { PeriodSelector } from '../shared/PeriodSelector';
import { CategoriesPieChart } from './CategoriesPieChart';

export function Categories() {
    const pageBodyRef = useRef(null);
    const finance = useSelector(state => state.finance);
    const { categoriesTree } = finance;

    const controls = <Controls />;

    return <Fragment>
        <PageHeader controls={controls} scrollRef={pageBodyRef}>
            <Breadcrumbs breadcrumbs={FINANCE_BREADCRUMBS} />
            Categories
        </PageHeader>
        <PageBody fullHeight={true} withPageHeader={true} pageBodyRef={pageBodyRef}>
            <CategoriesGraph finance={finance} />
            <CategoriesList categoriesTree={categoriesTree} />
        </PageBody>
    </Fragment>;
}


function Controls() {
    const baseClass = 'ui-button ui-button--small';
    return <Fragment>
        <PeriodSelector />
        <Link
            to={`${CATEGORIES_BASE_URL}/add`}
            className={`${baseClass} ui-button--primary`}
        >Add Category</Link>
    </Fragment>;
}


function CategoriesList({ categoriesTree }) {
    const [expanded, setExpanded] = useState({});
    const current_year = new Date().getFullYear();
    const prev_year = current_year - 1;

    const columns = [
        { prop: 'expand', title: '', width: 50, padding: 0 },
        { prop: 'id', title: 'ID', width: 50 },
        { prop: 'color', title: '', width: 50 },
        { prop: 'name', title: 'Name' },
        { prop: 'prev_year', title: `${prev_year}`, width: 80, style: { textAlign: 'right' } },
        { prop: 'current_year', title: `${current_year}`, width: 80, style: { textAlign: 'right', paddingRight: '10px' } },
        { prop: 'budget', title: 'Budget', width: 100, style: { textAlign: 'right' } },
    ];
    const getCategory = (category, children=[]) => {
        const budgets = category.user_data ? category.user_data.budgets : [];

        return {
            ...category,
            expand: children.length > 0
                ? expanded[category.id]
                    ? <Icon name="keyboard_arrow_down" modifiers="clickable" size="small"
                        onClick={() => { setExpanded({ ...expanded, [category.id]: false }); }} />
                    : <Icon name="keyboard_arrow_right" modifiers="clickable" size="small"
                        onClick={() => { setExpanded({ ...expanded, [category.id]: true }); }} />
                : null,
            color: <span style={{ backgroundColor: category.attributes_ui.color, width: 20, height: 20, display: 'block' }}/>,
            name: <ALink style={{ marginLeft: category.meta_level * 15 }}
                to={`${CATEGORIES_BASE_URL}/${category.id}`}>{category.name}</ALink>,
            prev_year: category.user_data.totals.years[prev_year] || 0,
            current_year: category.user_data.totals.years[current_year] || 0,
            budget: budgets && budgets.length > 0 ? budgets[0].amount * 12 : null,
        };
    };

    const entries = categoriesTree.reduce((categories, node) => {
        const category = node.category;
        if (expanded[category.id])
            return [...categories, getCategory(node.category, node.children), ...node.children.map(n => getCategory(n.category, n.children))];
        return [...categories, getCategory(node.category, node.children)];
    }, []);

    const config = {
        bodyContainerProps: { style: { backgroundColor: '#f8fafb' } },
        verticalAlignment: 'middle',
    };

    return <Table columns={columns} entries={entries} config={config} />;
}

CategoriesList.propTypes = {
    categoriesTree: PropTypes.array,
};

function CategoriesGraph({ finance }) {
    const previousMonths = FINANCE_PERIODS[finance.selectedPeriod].previousMonths;
    const [moneyMovementsList, setMoneyMovementList] = useState(null);

    useEffect(() => {
        const mmData = moneyMovementsByPeriod({ finance, moneyMovements: moneyMovementsList, previousMonths });
        const mmList = Object.values(mmData).reduce((mmList, monthList) => [...mmList, ...monthList], []);
        setMoneyMovementList(mmList);
    }, [previousMonths]);

    return <CategoriesPieChart finance={finance} moneyMovementsList={moneyMovementsList} />
}

CategoriesGraph.propTypes = {
    finance: PropTypes.object,
};
