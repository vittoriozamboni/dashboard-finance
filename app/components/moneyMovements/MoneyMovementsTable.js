import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { ALink } from 'components/ui/ALink';
import { Button } from 'components/ui/Button';
import { Icon } from 'components/ui/Icon';
import { SidePanel } from 'components/ui/SidePanel';
import { Table } from 'components/ui/table/Table';

import { ACCOUNTS_BASE_URL } from '../accounts/constants';
import { CATEGORIES_BASE_URL } from '../categories/constants';
import { MONEY_MOVEMENTS_BASE_URL } from '../moneyMovements/constants';
import { MoneyMovementDetail } from './MoneyMovementDetail';
import { Badge } from 'components/ui/Badge';
import { TRANSACTIONS_BASE_URL } from '../transactions/constants';


export function MoneyMovementsTable({ moneyMovements, finance }) {

    const numberStyle = { textAlign: 'right', paddingRight: '10px' };
    const columns = [
        { prop: 'actions', title: '', width: 50, padding: 0 },
        { prop: 'user', title: '', width: 50, padding: 0 },
        { prop: 'movement_icon', title: '', width: 30, padding: 0 },
        { prop: 'amount', title: 'Amount', width: 100, style: numberStyle },
        { prop: 'movement_date', title: 'Date', width: 120 },
        { prop: 'category', title: 'Category', width: 200, },
        { prop: 'tags', title: 'Tags' },
        { prop: 'id', title: 'ID', width: 40 },
        { prop: 'transaction', title: 'TR-ID', width: 70 },
    ];

    const entries = moneyMovements
        .sort((mm1, mm2) => mm1.movement_date > mm2.movement_date ? -1 : 1)
        .map(mm => ({
            ...mm,
            account: mm.account && <ALink to={`${ACCOUNTS_BASE_URL}/${mm.account}`} classes={['borderless']}>
                <Badge type="circular">{finance.accounts[mm.account].short_name}</Badge>
            </ALink>,
            category: <ALink to={`${CATEGORIES_BASE_URL}/${mm.category}`}>{finance.categories[mm.category].full_name}</ALink>,
            transaction: <ALink to={`${TRANSACTIONS_BASE_URL}/${mm.transaction}`}>{mm.transaction}</ALink>,
            movement_icon: mm.movement === '-' ? <Icon name="arrow_downward" className="red" size="small" /> : <Icon name="arrow_upward" className="teal" size="small" />,
            actions: <Fragment>
                <SidePanel
                    Trigger={({ setVisible, visible }) =>
                        <Icon name="my_library_books" modifiers="clickable" size="small" onClick={() => setVisible(!visible)} />
                    }
                    getSidePanelContentProps={({ setVisible }) => {
                        return {
                            title: 'Money Movement Detail',
                            content: <MoneyMovementDetail moneyMovement={mm} />,
                            footer: <Fragment>
                                <div></div>
                                <div>
                                    <Button tag={Link} to={`${MONEY_MOVEMENTS_BASE_URL}/${mm.id}/edit`}>Edit</Button>
                                    <Button
                                        classes={['primary']}
                                        style={{ marginLeft: '1rem' }}
                                        onClick={() => setVisible(false)}
                                    >Close</Button>
                                </div>
                            </Fragment>
                        };
                    }}
                />
            </Fragment>
        }));

    return <Table
        columns={columns}
        entries={entries}
        config={{ pagination: true }}
    />;
}

MoneyMovementsTable.propTypes = {
    moneyMovements: PropTypes.array,
    finance: PropTypes.object.isRequired,
};

