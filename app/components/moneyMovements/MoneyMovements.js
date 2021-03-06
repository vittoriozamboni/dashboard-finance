import React, { Fragment, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Breadcrumbs } from 'components/ui/Breadcrumbs';
import { Button } from 'components/ui/Button';
import { Page } from 'components/ui/Page';
import { PageBody } from 'components/ui/PageBody';
import { PageHeader } from 'components/ui/PageHeader';

import { FINANCE_BREADCRUMBS } from '../../constants';
import { MONEY_MOVEMENTS_BASE_URL } from './constants';
import { MoneyMovementsTable } from './MoneyMovementsTable';


export function MoneyMovements() {
    const finance = useSelector(state => state.finance);
    const pageBodyRef = useRef(null);

    const moneyMovements = Object.values(finance.moneyMovements)
        .sort((mm1, mm2) => mm1.movement_date > mm2.movement_date ? -1 : 1);

    return <Page>
        <PageHeader scrollRef={pageBodyRef}>
            <Breadcrumbs breadcrumbs={FINANCE_BREADCRUMBS} />
            Money Movements
        </PageHeader>
        <PageBody fullHeight={true} withPageHeader={true} pageBodyRef={pageBodyRef}>
            <MoneyMovementsTable finance={finance} moneyMovements={moneyMovements} />
        </PageBody>
    </Page>;
}
