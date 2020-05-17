import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';

import { getFormReactSelectStyles } from 'components/style/formReactSelect';
import { Form, VField, DatePicker, Input, Textarea, Select, Toggle } from 'components/ui/form';
import { ColumnBlock, RowBlock } from 'components/ui/Blocks';
import { IconControl, Icon } from 'components/ui/Icon';

import { withFinance } from '../../storeConnection';

import './transaction_form.scss';


const TRANSACTION_CATEGORY_SELECTOR = 'finance__transaction-form__category-selector';
const TRANSACTION_CATEGORY_SELECTOR_ACTIVE = `${TRANSACTION_CATEGORY_SELECTOR}--active`;


function getAccountLabel(finance, accId) {
    return finance.accounts[accId].short_name + ' - ' + finance.accounts[accId].name;
}

function TransactionForm({ values, finance, setFieldValue, handleBlur, errors, submitCount }) {
    const [state, setState] = useState({
        multiple_categories: true,
        newCategoryId: null,
        newCategoryAmount: '',
    });

    const categories = Object.values(finance.categories).sort((c1, c2) => c1.full_name > c2.full_name ? 1 : -1);
    const contexts = Object.values(finance.contexts).sort((c1, c2) => c1.start_date > c2.start_date ? -1 : 1);
    const tags = Object.values(finance.tags).map(t => t.name).sort().map(t => ({ value: t, label: t }));
    const accounts = Object.values(finance.accounts).sort((a1, a2) => a1.name > a2.name ? 1 : -1);
    const vendors = Object.values(finance.vendors).sort((v1, v2) => v1.name > v2.name ? 1 : -1);

    const onMultiSelectChange = (options, action, fieldName) => {
        const newValues = options ? options.map(o => o.value) : [];

        setFieldValue(fieldName, newValues);
    };

    const addNewCategory = () => {
        const newCategory = {
            amount: parseFloat(state.newCategoryAmount),
            category: state.newCategoryId,
        }
        setFieldValue('categories', [...values.categories, newCategory]);
    }

    const deleteCategory = (index) => {
        setFieldValue('categories', values.categories.filter((_, i) => i !== index));
    }

    const categoriesSum = values.categories && values.categories.reduce((tot, c) => tot + c.amount, 0);

    return <Form>
        <RowBlock>
            <ColumnBlock className="col-xs-12 col-lg-6">
                <div className="ui-form__row">
                    <VField label="Movement" style={{ maxWidth: 100 }}>
                        <select id="transaction-movement" value={values.movement || ''}
                            name="transaction-movement"
                            className="ui-form__field__select ui-form__field__select--vertical"
                            onChange={e => setFieldValue('movement', e.target.value)}
                        >
                            <option value="-">-</option>
                            <option value="+">+</option>
                        </select>
                    </VField>
                    <VField label="Amount" required={true} style={{ flexGrow: 1 }}>
                        <Input id="transaction-amount" value={values.amount}
                            name="mm-amount"
                            invalid={submitCount && errors.amount}
                            onChange={e => setFieldValue('amount', e.target.value)}
                            onFocus={e => {
                                if (e.target.value === '0') setFieldValue('amount', '');
                            }}
                            onBlur={e => {
                                if (e.target.value === '') setFieldValue('amount', '0');
                                handleBlur(e);
                            }}
                        />
                    </VField>
                    <VField label="Movement Date" required={true} style={{ width: 150 }}>
                        <DatePicker id="transaction-movement-date" value={values.movement_date || ''}
                            name="transaction-movement_date"
                            placeholder="YYYY-MM-DD"
                            invalid={submitCount && errors.movement_date}
                            onBlur={handleBlur}
                            onDayChange={dateString => setFieldValue('movement_date', dateString)}
                            inputProps={{ style: { width: 150 } }}
                            overlayWrapperProps={{ style: { marginLeft: -130 } }}
                        />
                    </VField>
                </div>

                <VField label="Category" required={true}>
                    <div style={{ display: 'flex', width: '100%' }}>
                        <div style={{ width: 110 }}>
                            <span className={`${TRANSACTION_CATEGORY_SELECTOR} ${!state.multiple_categories ? TRANSACTION_CATEGORY_SELECTOR_ACTIVE : ''}`}
                                onClick={() => setState(() => ({ ...state, multiple_categories: false }))}
                            >1</span>
                            <span className={`${TRANSACTION_CATEGORY_SELECTOR} ${state.multiple_categories ? TRANSACTION_CATEGORY_SELECTOR_ACTIVE : ''}`}
                                onClick={() => setState(() => ({ ...state, multiple_categories: true }))}
                            >2+</span>
                        </div>
                        <div style={{ flexGrow: 1 }}>
                            {!state.multiple_categories &&
                                <VField style={{ paddingTop: 0 }}>
                                    <Select
                                        id="transaction-category"
                                        name={`transaction-category`}
                                        classNamePrefix="react-select"
                                        className="w-100pc"
                                        invalid={submitCount && errors.category && !state.multiple_categories}
                                        value={values.category || null}
                                        onChange={entry => setFieldValue('category', entry.value)}
                                        options={categories.map(c => ({ value: c.id, label: c.full_name}))}
                                    />
                                </VField>
                            }
                            {state.multiple_categories && <Fragment>
                                <div className="flex-container--middle">
                                    <VField style={{ width: 'calc(100% - 118px - 40px)', paddingTop: 0 }}>
                                        <Select
                                            id="transaction-new-category-category"
                                            name="transaction-new-category-category"
                                            classNamePrefix="react-select"
                                            className="w-100pc"
                                            invalid={submitCount && errors.categories && state.multiple_categories}
                                            value={state.newCategoryId || null}
                                            onChange={entry => setState({ ...state, newCategoryId: entry.value })}
                                            options={categories.map(c => ({ value: c.id, label: c.full_name}))}
                                        />
                                    </VField>
                                    <VField style={{ width: 110, paddingTop: 0  }}>
                                        <Input
                                            id="transaction-new-category-amount"
                                            name="transaction-new-category-amount"
                                            value={state.newCategoryAmount}
                                            style={{ textAlign: 'right' }}
                                            onChange={e => setState({ ...state, newCategoryAmount: e.target.value || ''})}
                                        />
                                    </VField>
                                    <span style={{ width: 40, textAlign: 'center' }}>
                                        {!!(!state.newCategoryAmount && categoriesSum && parseFloat(values.amount)) &&
                                            <IconControl name="offline_bolt"
                                                onClick={() => {
                                                    setState({ ...state, newCategoryAmount: '' + (parseFloat(values.amount) - categoriesSum).toFixed(2) });
                                                }}
                                            />
                                        }
                                        {state.newCategoryAmount && state.newCategoryAmount.indexOf('+') >= 0 &&
                                            <IconControl name="playlist_add"
                                                onClick={() => {
                                                    setState({ ...state, newCategoryAmount: '' +
                                                        state.newCategoryAmount.split('+').map(n => parseFloat(n)).reduce((t, v) => t + v, 0) });
                                                }}
                                            />
                                        }
                                        {state.newCategoryAmount && state.newCategoryId && state.newCategoryAmount.indexOf('+') === -1 &&
                                            <IconControl name="add"
                                                onClick={() => {
                                                    addNewCategory();
                                                    setState({ ...state, newCategoryId: null, newCategoryAmount: '' });
                                                }}
                                            />
                                        }
                                    </span>
                                </div>
                                {values.categories.map((category, index) => {
                                    return <div
                                        className={`flex-container--middle m-t-10 ${index % 2 === 0 ? 'background-grey-light-l2' : ''}`}
                                        key={`transaction-categories-${index}`}
                                        style={{ padding: '5px 0 5px 5px' }}
                                    >
                                        <span style={{ width: 'calc(100% - 118px - 40px)', marginRight: 8 }}>
                                            {finance.categories[category.category].full_name}
                                        </span>
                                        <span style={{ width: 110, textAlign: 'right' }}>
                                            {category.amount}
                                        </span>
                                        <span style={{ width: 40, textAlign: 'center' }}>
                                            <IconControl name="remove"
                                                onClick={() => deleteCategory(index)}
                                            />
                                        </span>
                                    </div>
                                })}
                                {values.categories.length > 0 && <div className="flex-container--middle m-t-10">
                                    <span style={{ width: 'calc(100% - 118px - 40px)', textAlign: 'right', marginRight: 8, paddingTop: 5 }}>
                                        Total
                                    </span>
                                    <span style={{ width: 110, textAlign: 'right', borderTop: '1px solid #ddd', paddingTop: 5 }}>
                                        {categoriesSum}
                                    </span>
                                    <span style={{ width: 40, textAlign: 'center' }}>
                                        {categoriesSum === parseFloat(values.amount) &&
                                            <Icon name="check" size="smaller" className="green-l1" />
                                        }
                                        {(!values.amount || categoriesSum !== parseFloat(values.amount)) &&
                                            <Icon name="warning" size="smaller" className="yellow-d1" />
                                        }
                                    </span>
                                </div>}

                            </Fragment>}
                        </div>
                    </div>
                </VField>
                <VField label="Description">
                    <Textarea id="transaction-description" value={values.description || ''}
                        name="transaction-description"
                        onChange={e => setFieldValue('description', e.target.value)}
                        onBlur={handleBlur}
                        style={{ minHeight: 81 }}
                    />
                </VField>
            </ColumnBlock>
            <ColumnBlock className="col-xs-12 col-lg-6">
                <VField label="Account" required={true}>
                    <Select
                        id="transaction-account"
                        name={`transaction-account`}
                        classNamePrefix="react-select"
                        className="w-100pc"
                        value={values.account ? { value: values.account, label: getAccountLabel(finance, values.account) } : null}
                        onChange={entry => setFieldValue('account', entry.value)}
                        options={accounts.map(a => ({ value: a.id, label: getAccountLabel(finance, a.id)}))}
                    />
                </VField>
                <VField label="Vendor">
                    <Select
                        creatable={true}
                        id="transaction-vendor"
                        name={`transaction-vendor`}
                        classNamePrefix="react-select"
                        className="w-100pc"
                        value={values.vendor}
                        onChange={entry => setFieldValue('vendor', entry.value)}
                        options={vendors.map(v => ({ value: v.id, label: v.name }))}
                    />
                </VField>
                <VField label="Tags">
                    <Select
                        creatable={true}
                        name={`transaction-tags`}
                        className="w-100pc"
                        isMulti={true}
                        options={tags}
                        onChange={(options, action) => onMultiSelectChange(options, action, 'tags')}
                        value={values.tags || []}
                        placeholder="Select tags"
                    />
                </VField>
                <VField label="Context">
                    <Select
                        id="transaction-context"
                        name={`transaction-context`}
                        classNamePrefix="react-select"
                        className="w-100pc"
                        value={values.context ? { value: values.context, label: finance.contexts[values.context].name } : null}
                        onChange={entry => setFieldValue('context', entry.value)}
                        options={contexts.map(c => ({ value: c.id, label: c.name}))}
                    />
                </VField>
            </ColumnBlock>
        </RowBlock>
    </Form>;
}

TransactionForm.propTypes = {
    values: PropTypes.object,
    setFieldValue: PropTypes.func,
    handleBlur: PropTypes.func,
    finance: PropTypes.object,
    errors: PropTypes.object,
    submitCount: PropTypes.number,
};

const connectedTransactionForm = withFinance(TransactionForm);
export { connectedTransactionForm as TransactionForm };
