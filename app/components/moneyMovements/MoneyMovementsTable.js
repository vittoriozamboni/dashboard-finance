import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Icon } from 'components/ui/Icon';
import { ModalTrigger } from 'components/ui/Modal';
import { Table } from 'components/ui/table/Table';

import { FINANCE_BASE_URL } from '../../constants';
import { CATEGORIES_BASE_URL } from '../categories/constants';
import { MoneyMovementDetail } from './MoneyMovementDetail';


export function MoneyMovementsTable({ moneyMovements, finance }) {
    const numberStyle = { textAlign: 'right', paddingRight: '10px' };
    const columns = [
        { prop: 'actions', title: '', width: 50, padding: 0 },
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
            category: <Link to={`${CATEGORIES_BASE_URL}/${mm.category}`}>{finance.categories[mm.category].full_name}</Link>,
            movement_icon: mm.movement === '-' ? <Icon name="arrow_downward" className="red" size="small" /> : <Icon name="arrow_upward" className="teal" size="small" />,
            master_total: parseFloat(mm.master_total) ? mm.master_total : '',
            actions: <Fragment>
                <ModalTrigger
                    Trigger={({ setViewModalWindow }) => <Icon name="my_library_books" modifiers="clickable" onClick={() => setViewModalWindow(true)} size="small" />}
                    getModalWindowProps={({ setViewModalWindow }) => {
                        return {
                            title: 'Money Movement Detail',
                            content: <MoneyMovementDetail moneyMovement={mm} />,
                            footer: <Fragment>
                                <div></div>
                                <div>
                                    <Link
                                        to={`${FINANCE_BASE_URL}/money-movements/${mm.id}/edit`}
                                        className="ui-button ui-button--small"
                                    >Edit</Link>
                                    <button
                                        className="ui-button ui-button--primary ui-button--small"
                                        style={{ marginLeft: '1rem' }}
                                        onClick={() => setViewModalWindow(false)}
                                    >Close</button>
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

