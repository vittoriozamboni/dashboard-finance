import React, { useRef } from 'react';

import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import { Breadcrumbs } from 'components/ui/Breadcrumbs';
import { Button } from 'components/ui/Button';
import { PageBody } from 'components/ui/PageBody';
import { PageHeader } from 'components/ui/PageHeader';

import { TRANSACTIONS_BASE_URL, TRANSACTIONS_BREADCRUMBS } from './constants';
import { TransactionDetail } from './TransactionDetail';


export function TransactionDetailPage() {
    const finance = useSelector(state => state.finance);
    const { id: paramsId } = useParams();
    const pageBodyRef = useRef(null);

    const transaction = finance.transactions[+paramsId];

    const controls = <Button tag={Link}
        to={`${TRANSACTIONS_BASE_URL}/${transaction.id}/edit`}
        classes={['primary']}
    >Edit</Button>;

    return <div>
        <PageHeader controls={controls} scrollRef={pageBodyRef}>
            <Breadcrumbs breadcrumbs={TRANSACTIONS_BREADCRUMBS} />
            {transaction.name}
        </PageHeader>
        <PageBody fullHeight={true} withPageHeader={true} pageBodyRef={pageBodyRef}>
            <TransactionDetail transaction={transaction} />
        </PageBody>
    </div>;
}

