import React, { Fragment, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { ALink } from 'components/ui/ALink';
import { Breadcrumbs } from 'components/ui/Breadcrumbs';
import { Button } from 'components/ui/Button';
import { PageBody } from 'components/ui/PageBody';
import { PageHeader } from 'components/ui/PageHeader';
import { Table } from 'components/ui/table/Table';

import { FINANCE_BREADCRUMBS } from '../../constants';
import { TRANSACTIONS_BASE_URL } from './constants';
import { TransactionsTable } from './TransactionsTable';


export function Transactions() {
    const pageBodyRef = useRef(null);
    const finance = useSelector(state => state.finance);

    const controls = <Controls />;

    return <Fragment>
        <PageHeader controls={controls} scrollRef={pageBodyRef}>
            <Breadcrumbs breadcrumbs={FINANCE_BREADCRUMBS} />
            Transactions
        </PageHeader>
        <PageBody fullHeight={true} withPageHeader={true} pageBodyRef={pageBodyRef}>
            <TransactionsTable transactions={Object.values(finance.transactions)} finance={finance} />
        </PageBody>
    </Fragment>;
}


function Controls() {
    return <Fragment>
        <Button tag={Link}
            to={`${TRANSACTIONS_BASE_URL}/add`}
            classes={['primary']}
        >Add Transaction</Button>
    </Fragment>;
}

