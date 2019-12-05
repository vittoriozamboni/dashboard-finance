import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import { Breadcrumbs } from 'components/ui/Breadcrumbs';
import { FullSectionLoader } from 'components/ui/Loader';
import { Page } from 'components/ui/Page';
import { PageBody } from 'components/ui/PageBody';
import { PageHeader } from 'components/ui/PageHeader';

import { FINANCE_PERIODS } from '../../constants';
import { CATEGORIES_BREADCRUMBS, CATEGORIES_BASE_URL } from './constants';
import { withFinance } from '../../storeConnection';
import { MoneyMovementEntity } from '../../models/moneyMovement';

import { MoneyMovementsTable } from '../moneyMovements/MoneyMovementsTable';
import { moneyMovementsByPeriod } from '../../data/moneyMovementsDataUtils';
import { timeHistogram } from '../../charts/histograms';
import { PeriodSelector } from '../shared/PeriodSelector';

function CategoryDetail({ match, finance }) {
    const [moneyMovements, setMoneyMovements] = useState(null);

    const initialMovements = finance.moneyMovements;

    const categoryId = +match.params.id;
    const category = finance.categories[categoryId];

    useEffect(() => {
        const mmEntity = new MoneyMovementEntity();
        const categoriesId = [categoryId, ...finance.subCategoriesTree[categoryId] || []];
        if (Object.keys(initialMovements).length === 0) {
            mmEntity.fetch().then(loadedMoneyMovements => {
                setMoneyMovements(mmEntity.getByCategories(categoriesId, loadedMoneyMovements));
            });
        } else {
            setMoneyMovements(mmEntity.getByCategories(categoriesId, Object.values(initialMovements)));
        }
    }, []); // eslint-disable-line

    if (moneyMovements === null) {
        return <FullSectionLoader />;
    }

    const controls = <Fragment>
        <PeriodSelector />
        <Link
            to={`${CATEGORIES_BASE_URL}/${category.id}/edit`}
            className="ui-button ui-button--primary ui-button--small"
        >Edit</Link>
    </Fragment>;

    return <Page>
        <PageHeader controls={controls}>
            <Breadcrumbs breadcrumbs={CATEGORIES_BREADCRUMBS} />
            {category.full_name}
        </PageHeader>
        <PageBody>
            <CategoryChart finance={finance} moneyMovements={moneyMovements} />
            <MoneyMovementsTable finance={finance} moneyMovements={moneyMovements} />
        </PageBody>
    </Page>;

}

CategoryDetail.propTypes = {
    match: PropTypes.object,
    finance: PropTypes.object,
};

const connectedCategoryDetail = withRouter(withFinance(CategoryDetail));
export { connectedCategoryDetail as CategoryDetail };


function CategoryChart({ finance, moneyMovements }) {
    const previousMonths = FINANCE_PERIODS[finance.selectedPeriod].previousMonths;
    const monthsData = moneyMovementsByPeriod({ finance, moneyMovements, previousMonths });
    const monthChartContainerId = 'finance-home-month-chart-container';

    const data = Object.keys(monthsData).reduce((all, month) => {
        return [...all, {
            date: month + '-01',
            amount: monthsData[month].reduce((tot, m) => tot + parseFloat(m.amount), 0)
        }];
    }, []);

    useEffect(() => {
        const chart = am4core.create(monthChartContainerId, am4charts.XYChart);
        timeHistogram(chart, data);
    }, [previousMonths, data]);


    return <div id={monthChartContainerId} style={{ width: '100%', height: '300px' }}>
        <FullSectionLoader />
    </div>;
}