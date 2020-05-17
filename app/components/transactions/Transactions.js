import React, { Fragment, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import { Breadcrumbs } from 'components/ui/Breadcrumbs';
import { Button } from 'components/ui/Button';
import { PageBody } from 'components/ui/PageBody';
import { PageHeader } from 'components/ui/PageHeader';

import { getCurrentMonth, getPreviousMonth, getNextMonth } from '../../utils';
import { CategoriesPieChart } from '../categories/CategoriesPieChart';
import { FINANCE_BREADCRUMBS } from '../../constants';
import { TRANSACTIONS_BASE_URL } from './constants';
import { TransactionsTable } from './TransactionsTable';


export function Transactions() {
    const { search } = useLocation();
    const pageBodyRef = useRef(null);
    const finance = useSelector(state => state.finance);

    const qs = !search ? {} : search.substr(1).split('&').reduce((map, q) => {
        map[q.split('=')[0]] = q.split('=')[1];
        return map;
    }, {});


    const { transactions, moneyMovements } = getTransactionsItems(finance, qs.month);

    const controls = <Controls month={qs.month} finance={finance} transactions={transactions} />;

    return <Fragment>
        <PageHeader controls={controls} scrollRef={pageBodyRef}>
            <Breadcrumbs breadcrumbs={FINANCE_BREADCRUMBS} />
            Transactions
        </PageHeader>

        <PageBody fullHeight={true} withPageHeader={true} pageBodyRef={pageBodyRef}>
            {moneyMovements && <CategoriesPieChart finance={finance} moneyMovementsList={moneyMovements} />}

            <TransactionsTable transactions={transactions} finance={finance} />
        </PageBody>
    </Fragment>;
}


function Controls({ month, finance, transactions }) {
    return <Fragment>
        <span style={{ marginRight: 15 }}>
            Total: {getTransactionsTotal(transactions)}
        </span>
        <span style={{ marginRight: 15 }}>
            Your total: {getUserTotal(finance, transactions)}
        </span>
        <span style={{ marginRight: 15 }}>
            {month && <>
                <Button tag={Link}
                    to={`${TRANSACTIONS_BASE_URL}?month=${getPreviousMonth(month)}`}
                    classes={["small"]}
                >Previous Month</Button>
                <span style={{ marginLeft: 10, marginRight: 5 }} className="primary">{month}</span>
                <Button tag={Link}
                    to={`${TRANSACTIONS_BASE_URL}?month=${getNextMonth(month)}`}
                    classes={["small"]}
                >Next Month</Button>
            </>}
            {!month &&
                <Button tag={Link}
                    to={`${TRANSACTIONS_BASE_URL}?month=${getCurrentMonth()}`}
                >Current Month</Button>
            }
        </span>
        <Button tag={Link}
            to={`${TRANSACTIONS_BASE_URL}/add`}
            classes={['primary']}
        >Add Transaction</Button>
        <Button tag={Link}
            to={`${TRANSACTIONS_BASE_URL}/add/batch`}
            classes={['primary']}
        >Add Batch</Button>
    </Fragment>;
}

function getTransactionsItems(finance, month) {
    let transactions = Object.values(finance.transactions);
    let moneyMovements;

    if(month) {
        transactions = transactions.filter(t => t.movement_date.substr(0, 7) === month);
        moneyMovements = Object.values(finance.moneyMovements).filter(mm => mm.movement_date.substr(0, 7) === month);
    }

    return { transactions, moneyMovements };
}

function getUserTotal(finance, transactions) {
    if (!transactions) return 0;

    return transactions.reduce((tot, tr) =>
        tot + tr.money_movements.reduce((trTot, mmId) =>
            trTot + finance.moneyMovements[mmId]
                ? parseFloat(finance.moneyMovements[mmId].amount)
                : 0
            , 0
        )
    , 0).toFixed(2)
}

function getTransactionsTotal(transactions) {
    if (!transactions) return 0;

    return transactions.reduce((tot, tr) => tot + parseFloat(tr.amount), 0).toFixed(2)
}
