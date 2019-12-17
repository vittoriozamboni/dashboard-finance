import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import { Breadcrumbs } from 'components/ui/Breadcrumbs';
import { FullSectionLoader } from 'components/ui/Loader';
import { Page } from 'components/ui/Page';
import { PageBody } from 'components/ui/PageBody';
import { PageHeader } from 'components/ui/PageHeader';

import { CONTEXTS_BREADCRUMBS, CONTEXTS_BASE_URL } from './constants';
import { moneyMovementsEntity } from '../../models/moneyMovement';

import { histogram } from '../../charts/histograms';
import { MoneyMovementsTable } from '../moneyMovements/MoneyMovementsTable';


export function ContextDetail() {
    const finance = useSelector(state => state.finance);
    const { id: paramsId } = useParams();

    const pageBodyRef = useRef(null);
    const [moneyMovements, setMoneyMovements] = useState(null);

    const context = finance.contexts[+paramsId];

    useEffect(() => {
        setMoneyMovements(moneyMovementsEntity.getByContext(context.id, Object.values(finance.moneyMovements)));
    }, []); // eslint-disable-line

    if (moneyMovements === null) {
        return <FullSectionLoader />;
    }

    const controls = <Link
        to={`${CONTEXTS_BASE_URL}/${context.id}/edit`}
        className="ui-button ui-button--primary ui-button--small"
    >Edit</Link>;

    return <Page>
        <PageHeader controls={controls} scrollRef={pageBodyRef}>
            <Breadcrumbs breadcrumbs={CONTEXTS_BREADCRUMBS} />
            {context.name}
        </PageHeader>
        <PageBody fullHeight={true} withPageHeader={true} pageBodyRef={pageBodyRef}>
            <ContextCategoriesChart context={context} moneyMovements={moneyMovements} categories={finance.categories} chartStyle={{ marginBottom: '1rem' }} />
            <MoneyMovementsTable finance={finance} moneyMovements={moneyMovements} />
        </PageBody>
    </Page>;

}


function ContextCategoriesChart({ categories, moneyMovements })  {
    const contextChartContainerId = 'finance-context-chart-container';

    const groups = {};
    for (let mm of moneyMovements) {
        const group = categories[mm.category].parent || mm.category;
        if (!groups[group]) groups[group] = { amount: 0, category: categories[group].name };
        groups[group].amount += parseFloat(mm.amount);
    };
    const data = Object.values(groups);

    useEffect(() => {
        const chart = am4core.create(contextChartContainerId, am4charts.XYChart);
        const { series } = histogram(chart, data, 'category', 'amount');
        series.name = 'Categories';
    }, [data]);

    return <div id={contextChartContainerId} style={{ width: '100%', height: '300px' }}>
        <FullSectionLoader />
    </div>;
}