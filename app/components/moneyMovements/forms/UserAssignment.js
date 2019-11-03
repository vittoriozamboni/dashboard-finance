import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'components/ui/Icon';


export function UserAssignment({ users, usersRef, values, addNewUserRel, removeUserRel, setUserAmount, disabled, mainAmount, namePrefix='' }) {
    const [state, setState] = useState({
        newUserRel: {}
    });

    return <table>
        <thead>
            <tr>
                <th className="p-b-5">User</th>
                <th className="p-b-5">Amount</th>
                <th width="30"></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <select value={state.newUserRel.user || ''}
                        name={`${namePrefix}new-user-rel-user`}
                        className="ui-form-v__select"
                        disabled={disabled}
                        onChange={e => setState({ ...state, newUserRel: { ...state.newUserRel, user: e.target.value ? +e.target.value : null }})}
                    >
                        <option value={null}>No split</option>
                        {users.map(user => {
                            return <option value={user.id} key={user.id}>{user.full_name}</option>;
                        })}
                    </select>
                </td>
                <td>
                    <input value={state.newUserRel.amount || ''}
                        name={`${namePrefix}new-user-rel-amount`}
                        className="ui-form-v__input"
                        disabled={disabled}
                        onChange={e => setState({ ...state, newUserRel: { ...state.newUserRel, amount: e.target.value ? e.target.value : null }})}
                    />
                </td>
                <td>
                    {!disabled && state.newUserRel.user && state.newUserRel.amount && parseFloat(state.newUserRel.amount) &&
                        <Icon name="plus" extraClasses="icon-control"
                            data-control={`${namePrefix}new-user-rel-add`}
                            onClick={() => {
                                addNewUserRel(state.newUserRel);
                                setState({ ...state, newUserRel: {} });
                            }}
                        />
                    }
                </td>
            </tr>
            {values.other_users.map((ur, index) => {
                return <tr key={`user-relation-${index}`}>
                    <td>
                        {usersRef[ur.user].full_name}
                    </td>
                    <td>
                        <input value={ur.amount || ''}
                            name={`${namePrefix}new-user-rel-user-${index}-amount`}
                            className="ui-form-v__input"
                            style={{ textAlign: 'right' }}
                            disabled={disabled}
                            onChange={e => setUserAmount(e.target.value ? e.target.value : null, index)}
                        />
                    </td>
                    <td>
                        {!disabled && <Icon name="minus" extraClasses="icon-control" onClick={() => removeUserRel(index)} />}
                    </td>
                </tr>;
            })}
            <tr>
                <td>Master Total</td>
                <td>
                    <div style={{ textAlign: 'right', paddingRight: '8px', paddingTop: '5px', marginTop: '5px', borderTop: '1px solid #9aa5b1' }}>
                        {values.other_users.reduce((tot, u) => { return tot + parseFloat(u.amount || 0); }, parseFloat(mainAmount || 0))}
                    </div>
                </td>
                <td></td>
            </tr>
        </tbody>
    </table>;
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
