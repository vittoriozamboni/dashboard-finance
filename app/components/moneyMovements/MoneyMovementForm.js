import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';

import { getFormReactSelectStyles } from 'components/style/formReactSelect';

import { withFinance } from '../../storeConnection';
import { UserAssignment } from './forms/UserAssignment';


function MoneyMovementForm({ values, setFieldValue, handleBlur, finance }) {

    const categories = Object.values(finance.categories).sort((c1, c2) => c1.full_name > c2.full_name ? 1 : -1);
    const contexts = Object.values(finance.contexts).sort((c1, c2) => c1.start_date > c2.start_date ? -1 : 1);
    const tags = Object.values(finance.tags).map(t => t.name).sort();
    const users = Object.values(finance.users).sort((u1, u2) => u1.full_name > u2.full_name ? 1 : -1);

    const addNewUserRel = (newUserRel) => {
        if (newUserRel.user && newUserRel.amount) {
            setFieldValue('other_users', [...values.other_users, { ...newUserRel }]);
        }
    };

    const setUserAmount = (amount, index) => {
        setFieldValue('other_users', values.other_users.map((ur, urIndex) => {
            if (urIndex === index) {
                return { ...ur, amount };
            } else {
                return ur;
            }
        }));
    };

    const removeUserRel = (index) => {
        setFieldValue('other_users', values.other_users.filter((_, urIndex) => index !== urIndex));
    };

    const onMultiSelectChange = (options, action, fieldName) => {
        const newValues = options.map(o => o.value);

        setFieldValue(fieldName, newValues);
    };

    return <div style={{ width: '100%' }}>
        <div className="row ui-form">
            <div className="col-xs-12 col-lg-6">
                <div className="ui-form-v__field-group">
                    <div className="ui-form-v__field" style={{ maxWidth: '120px' }}>
                        <label className="ui-form-v__label" htmlFor="money-movement-movement">Movement</label>
                        <div className="ui-form-v__field-input">
                            <select id="money-movement-movement" value={values.movement || ''}
                                name="mm-movement"
                                className="ui-form-v__select"
                                onChange={e => setFieldValue('movement', e.target.value)}
                            >
                                <option value="-">-</option>
                                <option value="+">+</option>
                            </select>
                        </div>
                    </div>
                    <div className="ui-form-v__field">
                        <label className="ui-form-v__label" htmlFor="money-movement-amount">Amount</label>
                        <div className="ui-form-v__field-input">
                            <input id="money-movement-amount" value={values.amount}
                                name="mm-amount"
                                className="ui-form-v__input"
                                onChange={e => setFieldValue('amount', e.target.value)}
                                onFocus={e => {
                                    if (e.target.value === '0') setFieldValue('amount', '');
                                }}
                                onBlur={e => {
                                    if (e.target.value === '') setFieldValue('amount', '0');
                                    handleBlur(e);
                                }}
                        />
                        </div>
                    </div>
                    <div className="ui-form-v__field">
                        <label className="ui-form-v__label" htmlFor="money-movement-movement-date">Movement Date</label>
                        <div className="ui-form-v__field-input">
                            <input id="money-movement-movement-date" value={values.movement_date || ''}
                                name="mm-movement_date"
                                placeholder="YYYY-MM-DD"
                                className="ui-form-v__input"
                                onChange={e => setFieldValue('movement_date', e.target.value)}
                                onBlur={handleBlur}
                            />
                        </div>
                    </div>
                </div>
                <div className="ui-form-v__field">
                    <label className="ui-form-v__label" htmlFor="money-movement-category">Category</label>
                    <div className="ui-form-v__field-input">
                        <Select
                            id="money-movement-category"
                            name={`mm-category`}
                            classNamePrefix="react-select"
                            className="ui-form__react-select"
                            value={values.category ? { value: values.category, label: finance.categories[values.category].full_name } : null}
                            onChange={entry => setFieldValue('category', entry.value)}
                            options={categories.map(c => ({ value: c.id, label: c.full_name}))}
                        />
                    </div>
                </div>
                <div className="ui-form-v__field">
                    <label className="ui-form-v__label" htmlFor="money-movement-context">Context</label>
                    <div className="ui-form-v__field-input">
                        <Select
                            id="money-movement-context"
                            name={`mm-context`}
                            classNamePrefix="react-select"
                            className="ui-form__react-select"
                            value={values.context ? { value: values.context, label: finance.contexts[values.context].name } : null}
                            onChange={entry => setFieldValue('context', entry.value)}
                            options={contexts.map(c => ({ value: c.id, label: c.name}))}
                        />
                    </div>
                </div>
                <div className="ui-form-v__field">
                    <label className="ui-form-v__label" htmlFor="money-movement-description">Description</label>
                    <div className="ui-form-v__field-input">
                        <textarea id="money-movement-description" value={values.description || ''}
                            name="mm-description"
                            className="ui-form-v__textarea"
                            onChange={e => setFieldValue('description', e.target.value)}
                            onBlur={handleBlur}
                        />
                    </div>
                </div>
            </div>
            <div className="col-xs-12 col-lg-6">
                <div className="ui-form-v__field">
                    <label className="ui-form-v__label" htmlFor="money-movement-tags">Tags</label>
                    <div className="ui-form-v__field-input">
                        <CreatableSelect
                            name={`mm-tags`}
                            className="ui-form__react-select"
                            classNamePrefix="react-select"
                            styles={getFormReactSelectStyles()}
                            isMulti={true}
                            options={tags.map(tag => ({ value: tag, label: tag }))}
                            onChange={(options, action) => onMultiSelectChange(options, action, 'tags')}
                            value={values.tags ? values.tags.map(t => ({ value: t, label: t})) : []}
                            placeholder="Select tags"
                        />
                    </div>
                </div>
                <div className="ui-form-v__field">{/* Users */}
                    <div className="ui-form-v__field-input">
                        <UserAssignment
                            namePrefix={`mm-`}
                            users={users}
                            usersRef={finance.users}
                            values={values}
                            addNewUserRel={addNewUserRel}
                            removeUserRel={removeUserRel}
                            setUserAmount={setUserAmount}
                            mainAmount={values.amount}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>;
}

MoneyMovementForm.propTypes = {
    values: PropTypes.object,
    setFieldValue: PropTypes.func,
    handleBlur: PropTypes.func,
    finance: PropTypes.object,
};

const connectedMoneyMovementForm = withFinance(MoneyMovementForm);
export { connectedMoneyMovementForm as MoneyMovementForm };
