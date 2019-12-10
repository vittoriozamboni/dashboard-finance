import React from 'react';
import PropTypes from 'prop-types';

import { Form, Field, Input } from 'components/ui/form';
import { AccountUsersRelation } from './forms/AccountUsersRelation';


export function AccountForm({ values, setFieldValue, handleBlur, finance, canEditUser=false }) {
    const users = Object.values(finance.users).sort((u1, u2) => u1.full_name > u2.full_name ? 1 : -1);

    const addNewUserRel = (newUserRel) => {
        if (newUserRel.user && newUserRel.percentage) {
            setFieldValue('users_relation', [...values.users_relation, { ...newUserRel }]);
        }
    };

    const setUserPercentage = (percentage, index) => {
        setFieldValue('users_relation', values.users_relation.map((ur, urIndex) => {
            if (urIndex === index) {
                return { ...ur, percentage };
            } else {
                return ur;
            }
        }));
    };

    const removeUserRel = (index) => {
        setFieldValue('users_relation', values.users_relation.filter((_, urIndex) => index !== urIndex));
    };

    return <Form>
        <Field label="Name">
            <Input id="account-name" value={values.name}
                onChange={e => setFieldValue('name', e.target.value)}
                onBlur={handleBlur}
            />
        </Field>
        <Field label="Short Name">
            <Input id="short-name" value={values.short_name}
                onChange={e => setFieldValue('short_name', e.target.value)}
                onBlur={handleBlur}
            />
        </Field>
        <Field label="Users">
            <AccountUsersRelation
                users={users}
                usersRef={finance.users}
                values={values}
                addNewUserRel={addNewUserRel}
                removeUserRel={removeUserRel}
                setUserPercentage={setUserPercentage}
                disabled={!canEditUser}
            />
        </Field>
    </Form>;
}

AccountForm.propTypes = {
    values: PropTypes.object,
    setFieldValue: PropTypes.func,
    handleBlur: PropTypes.func,
    finance: PropTypes.object,
    canEditUser: PropTypes.bool,
};
