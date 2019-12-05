import React, { Fragment, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { ALink } from 'components/ui/ALink';
import { Breadcrumbs } from 'components/ui/Breadcrumbs';
import { Icon } from 'components/ui/Icon';
import { Page } from 'components/ui/Page';
import { PageBody } from 'components/ui/PageBody';
import { PageHeader } from 'components/ui/PageHeader';
import { Table } from 'components/ui/table/Table';

import { FINANCE_BREADCRUMBS } from '../../constants';
import { MONEY_MOVEMENTS_BASE_URL } from './constants';
import { MoneyMovementsTable } from './MoneyMovementsTable';


export function MoneyMovements() {
    const finance = useSelector(state => state.finance);
    const pageBodyRef = useRef(null);

    const controls = <Controls />;
    const moneyMovements = Object.values(finance.moneyMovements)
        .sort((mm1, mm2) => mm1.movement_date > mm2.movement_date ? -1 : 1);

    return <Page>
        <PageHeader controls={controls} scrollRef={pageBodyRef}>
            <Breadcrumbs breadcrumbs={FINANCE_BREADCRUMBS} />
            Money Movements
        </PageHeader>
        <PageBody fullHeight={true} withPageHeader={true} pageBodyRef={pageBodyRef}>
            <MoneyMovementsTable finance={finance} moneyMovements={moneyMovements} />
        </PageBody>
    </Page>;
}


function Controls() {
    const baseClass = 'ui-button ui-button--small';
    return <Fragment>
        <Link
            to={`${MONEY_MOVEMENTS_BASE_URL}/add`}
            className={`${baseClass} ui-button--primary`}
        >Add Movement</Link>
        <Link
            to={`${MONEY_MOVEMENTS_BASE_URL}/add/batch`}
            className={`${baseClass} ui-button--primary`}
        >Add Batch</Link>
    </Fragment>;
}
