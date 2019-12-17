import React, { Fragment, useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import { Breadcrumbs } from 'components/ui/Breadcrumbs';
import { Button } from 'components/ui/Button';
import { FullSectionLoader } from 'components/ui/Loader';
import { Page } from 'components/ui/Page';
import { PageBody } from 'components/ui/PageBody';
import { PageHeader } from 'components/ui/PageHeader';

import { FINANCE_PERIODS } from '../../constants';
import { ACCOUNTS_BREADCRUMBS, ACCOUNTS_BASE_URL } from './constants';
import { MoneyMovementEntity } from '../../models/moneyMovement';

import { MoneyMovementsTable } from '../moneyMovements/MoneyMovementsTable';
import { moneyMovementsByPeriod } from '../../data/moneyMovementsDataUtils';
import { timeHistogram } from '../../charts/histograms';
import { PeriodSelector } from '../shared/PeriodSelector';


export function AccountDetail() {
    const finance = useSelector(state => state.finance);
    const { id: paramsId } = useParams();

    const pageBodyRef = useRef(null);
    const [moneyMovements, setMoneyMovements] = useState(null);

    const initialMovements = finance.moneyMovements;

    const account = finance.accounts[+paramsId];

    useEffect(() => {
        const mmEntity = new MoneyMovementEntity();
        const accountId = account.id;
        if (Object.keys(initialMovements).length === 0) {
            mmEntity.fetch().then(loadedMoneyMovements => {
                setMoneyMovements(mmEntity.getByAccount(accountId, loadedMoneyMovements));
            });
        } else {
            setMoneyMovements(mmEntity.getByAccount(accountId, Object.values(initialMovements)));
        }
    }, []); // eslint-disable-line

    if (moneyMovements === null) {
        return <FullSectionLoader />;
    }

    const controls = <Fragment>
        <PeriodSelector />
        <Button tag={Link}
            to={`${ACCOUNTS_BASE_URL}/${account.id}/edit`}
            classes={['primary']}
        >Edit</Button>
    </Fragment>;

    return <Page>
        <PageHeader controls={controls} scrollRef={pageBodyRef}>
            <Breadcrumbs breadcrumbs={ACCOUNTS_BREADCRUMBS} />
            {account.name}
        </PageHeader>
        <PageBody fullHeight={true} withPageHeader={true} pageBodyRef={pageBodyRef}>
            <AccountChart finance={finance} moneyMovements={moneyMovements} />
            <MoneyMovementsTable finance={finance} moneyMovements={moneyMovements} />
        </PageBody>
    </Page>;
}


function AccountChart({ finance, moneyMovements }) {
    const previousMonths = FINANCE_PERIODS[finance.selectedPeriod].previousMonths;

    const monthChartContainerId = 'finance-account-detail-chart-container';
    useEffect(() => {
        const monthsData = moneyMovementsByPeriod({ finance, moneyMovements, previousMonths });
        const data = Object.keys(monthsData).reduce((all, month) => {
            return [...all, {
                date: month + '-01',
                amount: monthsData[month].reduce((tot, m) => tot + parseFloat(m.amount), 0)
            }];
        }, []);
        setTimeout(() => {
            const chart = am4core.create(monthChartContainerId, am4charts.XYChart);
            timeHistogram(chart, data);
        });
    }, [previousMonths]);

    return <div id={monthChartContainerId} style={{ width: '100%', height: '300px' }}>
        <FullSectionLoader />
    </div>;
}