import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'components/ui/Icon';
import { Table } from 'components/ui/table/Table';
import { Input } from 'components/ui/form/Input';

export function AccountUsersRelation({ users, usersRef, values, addNewUserRel, removeUserRel, setUserPercentage, disabled }) {
    const [state, setState] = useState({
        newUserRel: {}
    });

    const columns = [
        { prop: 'user', title: 'User', width: 200 },
        { prop: 'percentage', title: 'Percentage', width: 150 },
        { prop: 'controls', title: '', width: 40 },
    ];

    const showControls = !disabled && state.newUserRel.user && state.newUserRel.percentage && parseFloat(state.newUserRel.percentage);

    const valuesRows = values.users_relation.map((ur, index) => {
        return {
            user: usersRef[ur.user].full_name,
            percentage: <Input value={ur.percentage || ''}
                name={`new-user-rel-user-${index}-percentage`}
                style={{ textAlign: 'right' }}
                disabled={disabled}
                onChange={e => setUserPercentage(e.target.value ? e.target.value : null, index)}
            />,
            controls: !disabled ? <Icon size="smaller" name="remove" className="ui-icon__control" onClick={() => removeUserRel(index)} /> : '',
        };
    });

    const entries = [
        {
            user: <select value={state.newUserRel.user || ''}
                name={`new-user-rel-user`}
                className="ui-form-v__select"
                disabled={disabled}
                onChange={e => setState({ ...state, newUserRel: { ...state.newUserRel, user: e.target.value ? +e.target.value : null }})}
            >
                <option value={null}>Select...</option>
                {users
                    .filter(user => !values.users_relation
                    .map(ur => ur.user).includes(user.id))
                    .map(user => {
                        return <option value={user.id} key={user.id}>{user.full_name}</option>;
                    })
                }
            </select>,
            percentage: <Input value={state.newUserRel.percentage || ''}
                style={{ textAlign: 'right' }}
                name={`new-user-rel-percentage`}
                disabled={disabled}
                onChange={e => setState({ ...state, newUserRel: { ...state.newUserRel, percentage: e.target.value ? e.target.value : null }})}
            />,
            controls: showControls ?
                <Icon name="add" size="smaller" className="ui-icon__control"
                    data-control={`new-user-rel-add`}
                    onClick={() => {
                        addNewUserRel(state.newUserRel);
                        setState({ ...state, newUserRel: {} });
                    }}
                /> : undefined,
        },
        ...valuesRows,
        {
            user: 'Total Percentage',
            percentage: <div style={{ textAlign: 'right', paddingRight: 5 }}>
                {values.users_relation.reduce((tot, u) => { return tot + parseFloat(u.percentage || 0); }, 0)}
            </div>
        }
    ];

    return <Table columns={columns} entries={entries} config={{ borderType: 'none' }} />;
}

AccountUsersRelation.propTypes = {
    users: PropTypes.array,
    usersRef: PropTypes.object,
    values: PropTypes.object,
    addNewUserRel: PropTypes.func,
    removeUserRel: PropTypes.func,
    setUserPercentage: PropTypes.func,
    disabled: PropTypes.bool,
};

AccountUsersRelation.defaultProps = {
    disabled: false
};
