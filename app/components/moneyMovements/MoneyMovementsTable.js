import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { ALink } from 'components/ui/ALink';
import { Button } from 'components/ui/Button';
import { Icon } from 'components/ui/Icon';
import { SidePanel } from 'components/ui/SidePanel';
import { Table } from 'components/ui/table/Table';

import { CATEGORIES_BASE_URL } from '../categories/constants';
import { MONEY_MOVEMENTS_BASE_URL } from '../moneyMovements/constants';
import { MoneyMovementDetail } from './MoneyMovementDetail';
import { Badge } from 'components/ui/Badge';


export function MoneyMovementsTable({ moneyMovements, finance }) {

    const numberStyle = { textAlign: 'right', paddingRight: '10px' };
    const columns = [
        { prop: 'actions', title: '', width: 50, padding: 0 },
        { prop: 'user', title: '', width: 50, padding: 0 },
        { prop: 'movement_icon', title: '', width: 30, padding: 0 },
        { prop: 'amount', title: 'Amount', width: 100, style: numberStyle },
        { prop: 'movement_date', title: 'Date', width: 120 },
        { prop: 'category', title: 'Category', width: 200, },
        { prop: 'master_total', title: 'Total', width: 100, style: numberStyle },
        { prop: 'description', title: 'Description' },
        { prop: 'tags', title: 'Tags', width: 200 },
        { prop: 'id', title: 'ID', width: 40 },
    ];

    const entries = moneyMovements
        .sort((mm1, mm2) => mm1.movement_date > mm2.movement_date ? -1 : 1)
        .map(mm => ({
            ...mm,
            user: <Badge type="circular">{finance.users[mm.user].initials}</Badge>,
            category: <ALink to={`${CATEGORIES_BASE_URL}/${mm.category}`}>{finance.categories[mm.category].full_name}</ALink>,
            movement_icon: mm.movement === '-' ? <Icon name="arrow_downward" className="red" size="small" /> : <Icon name="arrow_upward" className="teal" size="small" />,
            master_total: parseFloat(mm.master_total) ? mm.master_total : '',
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
                                    <Link
                                        to={`${MONEY_MOVEMENTS_BASE_URL}/${mm.id}/edit`}
                                        className="ui-button ui-button--small"
                                    >Edit</Link>
                                    <Button
                                        classes={['primary', 'small']}
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
    />;
}

MoneyMovementsTable.propTypes = {
    moneyMovements: PropTypes.array,
    finance: PropTypes.object.isRequired,
};

