import React, { Fragment, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import { ALink } from 'components/ui/ALink';
import { Breadcrumbs } from 'components/ui/Breadcrumbs';
import { Icon } from 'components/ui/Icon';
import { PageBody } from 'components/ui/PageBody';
import { PageHeader } from 'components/ui/PageHeader';
import { Table } from 'components/ui/table/Table';

import { FINANCE_BASE_URL, FINANCE_BREADCRUMBS } from '../../constants';
import { withFinance } from '../../storeConnection';
import { CATEGORIES_BASE_URL } from './constants';
import { categoriesYearPie } from '../../charts/categoriesYearPie';
import { FullSectionLoader } from 'components/ui/Loader';
import { PeriodSelector } from '../shared/PeriodSelector';


function Categories({ finance }) {
    const pageBodyRef = useRef(null);
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

Categories.propTypes = {
    finance: PropTypes.object,
};

const connectedCategories = withFinance(Categories);
export { connectedCategories as Categories };

function Controls() {
    const baseClass = 'ui-button ui-button--small';
    return <Fragment>
        <PeriodSelector />
        <Link
            to={`${FINANCE_BASE_URL}/categories/add`}
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
    const pieChartContainerId = 'finance-categories-chart-container';

    useEffect(() => {
        const chart = categoriesYearPie(
            am4core.create(pieChartContainerId, am4charts.PieChart),
            { finance }
        );
        return () => { chart && chart.dispose(); };
    }, [finance]);

    return <div id={pieChartContainerId} style={{ width: "100%", height: "400px" }}>
        <FullSectionLoader />
    </div>;
}

CategoriesGraph.propTypes = {
    finance: PropTypes.object,
};
