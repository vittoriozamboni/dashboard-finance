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
import { VENDORS_BREADCRUMBS, VENDORS_BASE_URL } from './constants';
import { MoneyMovementEntity } from '../../models/moneyMovement';

import { MoneyMovementsTable } from '../moneyMovements/MoneyMovementsTable';
import { moneyMovementsByPeriod } from '../../data/moneyMovementsDataUtils';
import { timeHistogram } from '../../charts/histograms';
import { PeriodSelector } from '../shared/PeriodSelector';


export function VendorDetail() {
    const finance = useSelector(state => state.finance);
    const { id: paramsId } = useParams();

    const pageBodyRef = useRef(null);
    const [moneyMovements, setMoneyMovements] = useState(null);

    const initialMovements = finance.moneyMovements;

    const vendor = finance.vendors[+paramsId];

    useEffect(() => {
        const mmEntity = new MoneyMovementEntity();
        const vendorId = vendor.id;
        if (Object.keys(initialMovements).length === 0) {
            mmEntity.fetch().then(loadedMoneyMovements => {
                setMoneyMovements(mmEntity.getByVendor(vendorId, loadedMoneyMovements));
            });
        } else {
            setMoneyMovements(mmEntity.getByVendor(vendorId, Object.values(initialMovements)));
        }
    }, []); // eslint-disable-line

    if (moneyMovements === null) {
        return <FullSectionLoader />;
    }

    const controls = <Fragment>
        <PeriodSelector />
        <Button tag={Link}
            to={`${VENDORS_BASE_URL}/${vendor.id}/edit`}
            classes={['primary']}
        >Edit</Button>
    </Fragment>;

    return <Page>
        <PageHeader controls={controls} scrollRef={pageBodyRef}>
            <Breadcrumbs breadcrumbs={VENDORS_BREADCRUMBS} />
            {vendor.name}
        </PageHeader>
        <PageBody fullHeight={true} withPageHeader={true} pageBodyRef={pageBodyRef}>
            <VendorChart finance={finance} moneyMovements={moneyMovements} />
            <MoneyMovementsTable finance={finance} moneyMovements={moneyMovements} />
        </PageBody>
    </Page>;
}


function VendorChart({ finance, moneyMovements }) {
    const previousMonths = FINANCE_PERIODS[finance.selectedPeriod].previousMonths;

    const monthChartContainerId = 'finance-vendor-detail-chart-container';
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
            // timeHistogram(chart, data);
            timeHistogram(chart, Object.values(monthsData)
                .reduce((all, month) => [...all, ...month], [])
                .map(mm => ({ date: mm.movement_date, amount: mm.amount })));
        });
    }, [previousMonths]);

    return <div id={monthChartContainerId} style={{ width: '100%', height: '300px' }}>
        <FullSectionLoader />
    </div>;
}