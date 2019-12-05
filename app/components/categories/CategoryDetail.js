import React, { Fragment, useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import { Breadcrumbs } from 'components/ui/Breadcrumbs';
import { FullSectionLoader } from 'components/ui/Loader';
import { Page } from 'components/ui/Page';
import { PageBody } from 'components/ui/PageBody';
import { PageHeader } from 'components/ui/PageHeader';

import { FINANCE_PERIODS } from '../../constants';
import { CATEGORIES_BREADCRUMBS, CATEGORIES_BASE_URL } from './constants';
import { MoneyMovementEntity } from '../../models/moneyMovement';

import { MoneyMovementsTable } from '../moneyMovements/MoneyMovementsTable';
import { moneyMovementsByPeriod } from '../../data/moneyMovementsDataUtils';
import { timeHistogram } from '../../charts/histograms';
import { PeriodSelector } from '../shared/PeriodSelector';

export function CategoryDetail() {
    const finance = useSelector(state => state.finance);
    const { id: paramsId } = useParams();

    const pageBodyRef = useRef(null);
    const [moneyMovements, setMoneyMovements] = useState(null);

    const initialMovements = finance.moneyMovements;

    const category = finance.categories[+paramsId];

    useEffect(() => {
        const mmEntity = new MoneyMovementEntity();
        const categoriesId = [category.id, ...finance.subCategoriesTree[category.id] || []];
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
        <PageHeader controls={controls} scrollRef={pageBodyRef}>
            <Breadcrumbs breadcrumbs={CATEGORIES_BREADCRUMBS} />
            {category.full_name}
        </PageHeader>
        <PageBody fullHeight={true} withPageHeader={true} pageBodyRef={pageBodyRef}>
            <CategoryChart finance={finance} moneyMovements={moneyMovements} />
            <MoneyMovementsTable finance={finance} moneyMovements={moneyMovements} />
        </PageBody>
    </Page>;

}


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