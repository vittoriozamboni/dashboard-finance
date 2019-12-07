import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'components/ui/Icon';
import { Table } from 'components/ui/table/Table';
import { Input } from 'components/ui/form/Input';
import { Select } from 'components/ui/form/Select';

export function UserAssignment({ users, usersRef, values, addNewUserRel, removeUserRel, setUserAmount, disabled, mainAmount, namePrefix='' }) {
    const [state, setState] = useState({
        newUserRel: {}
    });

    const columns = [
        { prop: 'user', title: 'User', width: 200 },
        { prop: 'amount', title: 'Amount', width: 150 },
        { prop: 'controls', title: '', width: 40 },
    ];

    const showControls = !disabled && state.newUserRel.user && state.newUserRel.amount && parseFloat(state.newUserRel.amount);

    const valuesRows = values.other_users.map((ur, index) => {
        return {
            user: usersRef[ur.user].full_name,
            amount: <Input value={ur.amount || ''}
                name={`${namePrefix}new-user-rel-user-${index}-amount`}
                style={{ textAlign: 'right' }}
                disabled={disabled}
                onChange={e => setUserAmount(e.target.value ? e.target.value : null, index)}
            />,
            controls: !disabled ? <Icon size="smaller" name="remove" className="ui-icon__control" onClick={() => removeUserRel(index)} /> : '',
        };
    });

    const entries = [
        {
            user: <select value={state.newUserRel.user || ''}
                name={`${namePrefix}new-user-rel-user`}
                className="ui-form-v__select"
                disabled={disabled}
                onChange={e => setState({ ...state, newUserRel: { ...state.newUserRel, user: e.target.value ? +e.target.value : null }})}
            >
                <option value={null}>No split</option>
                {users.map(user => {
                    return <option value={user.id} key={user.id}>{user.full_name}</option>;
                })}
            </select>,
            amount: <Input value={state.newUserRel.amount || ''}
                style={{ textAlign: 'right' }}
                name={`${namePrefix}new-user-rel-amount`}
                disabled={disabled}
                onChange={e => setState({ ...state, newUserRel: { ...state.newUserRel, amount: e.target.value ? e.target.value : null }})}
            />,
            controls: showControls ?
                <Icon name="add" size="smaller" className="ui-icon__control"
                    data-control={`${namePrefix}new-user-rel-add`}
                    onClick={() => {
                        addNewUserRel(state.newUserRel);
                        setState({ ...state, newUserRel: {} });
                    }}
                /> : undefined,
        },
        ...valuesRows,
        {
            user: 'Master Total',
            amount: <div style={{ textAlign: 'right', paddingRight: 5 }}>
                {values.other_users.reduce((tot, u) => { return tot + parseFloat(u.amount || 0); }, parseFloat(mainAmount || 0))}
            </div>
        }
    ];

    return <Table columns={columns} entries={entries} config={{ borderType: 'none' }} />;
}

UserAssignment.propTypes = {
    users: PropTypes.array,
    usersRef: PropTypes.object,
    values: PropTypes.object,
    addNewUserRel: PropTypes.func,
    removeUserRel: PropTypes.func,
    setUserAmount: PropTypes.func,
    disabled: PropTypes.bool,
    mainAmount: PropTypes.string,
    namePrefix: PropTypes.string,
};

UserAssignment.defaultProps = {
    disabled: false
};
