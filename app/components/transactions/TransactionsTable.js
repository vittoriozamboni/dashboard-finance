import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { ALink } from 'components/ui/ALink';
import { Button } from 'components/ui/Button';
import { Icon } from 'components/ui/Icon';
import { SidePanel } from 'components/ui/SidePanel';
import { Table } from 'components/ui/table/Table';

import { ACCOUNTS_BASE_URL } from '../accounts/constants';
import { TRANSACTIONS_BASE_URL } from './constants';
import { Badge } from 'components/ui/Badge';

import { TransactionDetail } from './TransactionDetail';


export function TransactionsTable({ transactions, finance }) {

    const numberStyle = { textAlign: 'right', paddingRight: '10px' };
    const columns = [
        { prop: 'actions', title: '', width: 50, padding: 0 },
        { prop: 'account', title: '', width: 50, padding: 0 },
        { prop: 'movement_icon', title: '', width: 30, padding: 0 },
        { prop: 'amount', title: 'Amount', width: 100, style: numberStyle },
        { prop: 'movement_date', title: 'Date', width: 120 },
        { prop: 'description', title: 'Description' },
        { prop: 'tags', title: 'Tags', width: 200 },
        { prop: 'id', title: 'ID', width: 40 },
    ];

    const entries = transactions
        .sort((tr1, tr2) => tr1.movement_date > tr2.movement_date ? -1 : 1)
        .map(tr => ({
            ...tr,
            account: tr.account && <ALink to={`${ACCOUNTS_BASE_URL}/${tr.account}`} classes={['borderless']}>
                <Badge type="circular">{finance.accounts[tr.account].short_name}</Badge>
            </ALink>,
            movement_icon: tr.movement === '-' ? <Icon name="arrow_downward" className="red" size="small" /> : <Icon name="arrow_upward" className="teal" size="small" />,
            actions: <Fragment>
                <SidePanel
                    Trigger={({ setVisible, visible }) =>
                        <Icon name="my_library_books" modifiers="clickable" size="small" onClick={() => setVisible(!visible)} />
                    }
                    getSidePanelContentProps={({ setVisible }) => {
                        return {
                            title: <h3 className="primary">Transaction Detail</h3>,
                            content: <TransactionDetail transaction={tr} />,
                            footer: <Fragment>
                                <div></div>
                                <div>
                                    <Button tag={Link} to={`${TRANSACTIONS_BASE_URL}/${tr.id}/edit`}>Edit</Button>
                                    <Button
                                        classes={['primary']}
                                        style={{ marginLeft: '1rem' }}
                                        onClick={() => setVisible(false)}
                                    >Close</Button>
                                </div>
                            </Fragment>,
                            width: window.innerWidth / 2,
                        };
                    }}
                />
            </Fragment>
        }));

    return <Table
        columns={columns}
        entries={entries}
        config={{
            pagination: true,
        }}
    />;
}

TransactionsTable.propTypes = {
    transactions: PropTypes.array,
    finance: PropTypes.object.isRequired,
};

