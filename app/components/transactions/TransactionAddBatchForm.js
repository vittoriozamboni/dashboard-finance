import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { getFormReactSelectStyles } from 'components/style/formReactSelect';
import { Icon, IconControl } from 'components/ui/Icon';
import { Form, HField, VField, Input, Select, Textarea, DatePicker } from 'components/ui/form';
import { ColumnBlock, RowBlock } from 'components/ui/Blocks';

import { withFinance } from '../../storeConnection';
import { InlineLoader } from 'components/ui/Loader';


function getAccountLabel(finance, accId) {
    return finance.accounts[accId].short_name + ' - ' + finance.accounts[accId].name;
}

function TransactionAddBatchForm({ values, setFieldValue, handleBlur, finance, addTransaction, cloneTransaction, deleteTransaction, isSubmitting, fullFormState }) {
    const [formState, setFormState] = useState({
        viewAdvancedOptions: {},
    });

    const categories = Object.values(finance.categories).sort((c1, c2) => c1.full_name > c2.full_name ? 1 : -1);
    const contexts = Object.values(finance.contexts).sort((c1, c2) => c1.start_date > c2.start_date ? -1 : 1);
    const tags = Object.values(finance.tags).map(t => t.name).sort().map(t => ({ value: t, label: t }));
    const accounts = Object.values(finance.accounts).sort((a1, a2) => a1.name > a2.name ? 1 : -1);
    const vendors = Object.values(finance.vendors).sort((v1, v2) => v1.name > v2.name ? 1 : -1);

    const onMultiSelectChange = (options, action, batchIndex, fieldName) => {
        const newValues = options ? options.map(o => o.value) : [];

        setFieldValue(fieldName, batchIndex, newValues);
    };

    const toggleAdvancedOptions = (batchIndex) => {
        setFormState({
            ...formState,
            viewAdvancedOptions: { ...viewAdvancedOptions, [batchIndex]: !!!viewAdvancedOptions[batchIndex] }
        });
    };

    const formReactSelectStyles = getFormReactSelectStyles();

    const { viewAdvancedOptions } = formState;

    return <div style={{ width: '100%' }}>
        {values.map((transactionValues, batchIndex) => {
            const disableEntry = isSubmitting || fullFormState.saving[batchIndex] || fullFormState.saved[batchIndex];

            return <Form key={batchIndex}>
            <RowBlock className="p-t-10">
                <ColumnBlock style={{ maxWidth: 560 }}>{/* Basic */}
                    <div className="ui-form-v__field-group">
                        <HField style={{ minWidth: 200, maxWidth: 250, marginRight: 10 }}>{/* Category */}
                            <Select
                                name={`tr-${batchIndex}-account`}
                                disabled={disableEntry}
                                placeholder="Account"
                                value={transactionValues.account}
                                onChange={entry => setFieldValue('account', batchIndex, entry.value)}
                                options={accounts.map(a => ({ value: a.id, label: getAccountLabel(finance, a.id)}))}
                            />
                        </HField>
                        <HField style={{ width: 70, marginRight: 10 }}>
                            <Select id="transaction-movement" value={transactionValues.movement || ''}
                                name={`tr-${batchIndex}-movement`}
                                disabled={disableEntry}
                                options={[{value: '-', label: '-' }, { value: '+', label: '+' }]}
                                onChange={e => setFieldValue('movement', batchIndex, e.value)}
                                isSearchable={false}
                                placeholder=""
                            />
                        </HField>
                        <HField style={{ maxWidth: 120, marginRight: 10 }}>
                            <Input value={transactionValues.amount}
                                name={`tr-${batchIndex}-amount`}
                                style={{ textAlign: 'right' }}
                                disabled={disableEntry}
                                placeholder="Amount"
                                onChange={e => setFieldValue('amount', batchIndex, e.target.value)}
                                onFocus={e => {
                                    if (e.target.value === '0') setFieldValue('amount', batchIndex, '');
                                }}
                                onBlur={e => {
                                    if (e.target.value === '') setFieldValue('amount', batchIndex, '0');
                                    handleBlur(e);
                                }}
                            />
                        </HField>
                        <HField style={{ maxWidth: 110 }}>
                            <DatePicker value={transactionValues.movement_date || ''}
                                name={`tr-${batchIndex}-movement_date`}
                                disabled={disableEntry}
                                placeholder="YYYY-MM-DD"
                                onBlur={handleBlur}
                                onDayChange={dateString => setFieldValue('movement_date', batchIndex, dateString)}
                                inputProps={{ style: { width: 110 } }}
                                />
                        </HField>
                    </div>
                </ColumnBlock>
                <ColumnBlock>
                    <div className="ui-form-v__field-group">
                        <HField style={{ minWidth: 200, maxWidth: 250, marginRight: 10 }}>{/* Category */}
                            <Select
                                name={`tr-${batchIndex}-category`}
                                disabled={disableEntry}
                                placeholder="Category"
                                value={transactionValues.category}
                                onChange={entry => setFieldValue('category', batchIndex, entry.value)}
                                options={categories.map(c => ({ value: c.id, label: c.full_name}))}
                            />
                        </HField>
                        <HField style={{ minWidth: 200, maxWidth: 250, marginRight: 10 }}>{/* Category */}
                            <Select
                                creatable={true}
                                name={`tr-${batchIndex}-vendor`}
                                disabled={disableEntry}
                                placeholder="Vendor"
                                value={transactionValues.vendor}
                                onChange={entry => setFieldValue('vendor', batchIndex, entry.value)}
                                options={vendors.map(v => ({ value: v.id, label: v.name }))}
                            />
                        </HField>
                        <HField style={{ maxWidth: '140px', padding: 0 }}>{/* Actions */}
                            <IconControl name="settings" tabIndex="0"
                                onClick={() => toggleAdvancedOptions(batchIndex)}
                                data-control={`tr-${batchIndex}-advanced-options`}
                            />
                            <IconControl name="content_copy" tabIndex="0"
                                onClick={() => cloneTransaction(batchIndex)}
                                data-control={`tr-${batchIndex}-copy`}
                            />
                            {values.length > 1 &&
                                <IconControl name="delete" tabIndex="0"
                                    onClick={() => !disableEntry && deleteTransaction(batchIndex)}
                                    data-control={`tr-${batchIndex}-copy`}
                                />
                            }
                            {isSubmitting && fullFormState.saving[batchIndex] && <InlineLoader />}
                            {fullFormState.saved[batchIndex] &&
                                <Icon name="check" size="smaller" className="teal-l1" />
                            }
                            {!isSubmitting && batchIndex === values.length - 1 &&
                                <IconControl name="add" tabIndex="0"
                                    onClick={() => addTransaction()}
                                    data-control={`add-transaction`}
                                />
                            }
                        </HField>
                    </div>
                </ColumnBlock>
                <ColumnBlock className="col-xs-12">{/* Advanced */}
                    {viewAdvancedOptions[batchIndex] && <div>
                        <h3 className="primary">Advanced</h3>
                        <RowBlock style={{ margin: 0 }}>
                            <ColumnBlock style={{ paddingLeft: 0, paddingRight: 0 }}>
                                <div>
                                    <HField style={{ width: '100%' }}>
                                        <Select
                                            name={`tr-${batchIndex}-context`}
                                            disabled={disableEntry}
                                            placeholder="Context"
                                            value={transactionValues.context}
                                            onChange={entry => setFieldValue('context', batchIndex, entry.value)}
                                            options={contexts.map(c => ({ value: c.id, label: c.name}))}
                                        />
                                    </HField>
                                </div>
                                <div>
                                    <VField label="Description">
                                        <Textarea
                                            name={`tr-${batchIndex}-description`}
                                            value={transactionValues.description || ''}
                                            disabled={disableEntry}
                                            onChange={e => setFieldValue('description', batchIndex, e.target.value)}
                                            onBlur={handleBlur}
                                        />
                                    </VField>
                                </div>
                            </ColumnBlock>
                            <ColumnBlock>
                                <HField style={{ minWidth: 200, maxWidth: 300, marginRight: 10 }}>{/* Tags */}
                                    <Select
                                        creatable={true}
                                        name={`tr-${batchIndex}-tags`}
                                        isMulti={true}
                                        isDisabled={disableEntry}
                                        options={tags}
                                        onChange={(options, action) => onMultiSelectChange(options, action, batchIndex, 'tags')}
                                        value={transactionValues.tags}
                                        placeholder="Select tags"
                                    />
                                </HField>
                            </ColumnBlock>
                        </RowBlock>
                    </div>
                    }
                </ColumnBlock>
            </RowBlock>
            <hr className="ui-divider" />
            </Form>;
        })}
    </div>;
}

TransactionAddBatchForm.propTypes = {
    values: PropTypes.arrayOf(PropTypes.object),
    setFieldValue: PropTypes.func,
    addTransaction: PropTypes.func,
    cloneTransaction: PropTypes.func,
    deleteTransaction: PropTypes.func,
    handleBlur: PropTypes.func,
    finance: PropTypes.object,
    isSubmitting: PropTypes.bool,
    fullFormState: PropTypes.object,
};

const connectedTransactionAddBatchForm = withFinance(TransactionAddBatchForm);
export { connectedTransactionAddBatchForm as TransactionAddBatchForm };

