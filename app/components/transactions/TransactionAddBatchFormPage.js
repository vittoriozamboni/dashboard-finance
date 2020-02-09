import React, { Fragment, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';

import { notify } from 'libs/notifications/notifications';
import { postRequest } from 'libs/requests/requests';
import { getCurrentUser } from 'libs/authentication/utils';

import { Breadcrumbs } from 'components/ui/Breadcrumbs';
import { RowBlock, ColumnBlock } from 'components/ui/Blocks';
import { Button } from 'components/ui/Button';
import { Form, HField, Input, Select } from 'components/ui/form';
import { Icon } from 'components/ui/Icon';
import { Page } from 'components/ui/Page';
import { PageBody } from 'components/ui/PageBody';
import { PageHeader } from 'components/ui/PageHeader';
import { CodeHighlight } from 'components/style/CodeHighlight';

import { categoriesEntity } from '../../models/category';
import { transactionsEntity, newTransaction } from '../../models/transaction';
import { TransactionAddBatchForm } from './TransactionAddBatchForm';
import { TRANSACTIONS_BREADCRUMBS, TRANSACTIONS_BASE_URL } from './constants';
import { accountsEntity } from '../../models/account';
import { contextsEntity } from '../../models/context';
import { tagsEntity } from '../../models/tag';
import { vendorsEntity } from '../../models/vendor';
import { InlineLoader } from 'components/ui/Loader';
import { SET_IS_RELOADING_ENTITIES } from '../../actions';


function getInitialValues(finance, loggedUser) {
    return [newTransaction(), newTransaction(), newTransaction()]
        .map(tr => ({
            ...tr,
            account: Object.values(finance.accounts)
                .filter(a => a.primary)
                .map(a => a.users_relation[0].user)
                .filter(u => u === loggedUser.id)[0],
            amount: tr.amount + ''
        }));
}

export function TransactionAddBatchFormPage() {
    const finance = useSelector(state => state.finance);
    const loggedUser = getCurrentUser();
    const pageBodyRef = useRef(null);

    const initialState = {
        values: getInitialValues(finance, loggedUser),
        saving: {},
        saved: {},
        global: {
            context: null,
            currencyConversion: null,
        }
    };

    const [formState, setFormState] = useState(initialState);

    return <Formik
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting }) => {
            const saved = { ...formState.saved };

            const validTransactions = formState.values.map((transaction, index) => {
                if (formState.saved[index]) return null;

                if (transaction.movement_date && transaction.category && transaction.amount && transaction.account)
                    return { transaction, index};
                return null;
            }).filter(v => v);

            function getPromise(values, order, resolve, reject) {
                const { transaction, index } = values[order];
                const enrichedTransaction = { ...transaction };
                if (formState.global.currencyConversion) {
                    enrichedTransaction.amount = Math.round(parseFloat(formState.global.currencyConversion) * transaction.amount, 2);
                }
                if (formState.global.context) {
                    enrichedTransaction.context = formState.global.context;
                }
                setFormState(s => ({ ...s, saving: { ...s.saving, [index]: true }}));
                transactionsEntity
                    .save(enrichedTransaction)
                    .then(response => {
                        setFormState(s => ({
                            ...s,
                            saving: { ...s.saving, [index]: false },
                            saved: { ...s.saved, [index]: true }
                        }));
                        saved[index] = true;
                        if (order < values.length - 1) {
                            getPromise(values, order+1, resolve, reject);
                        } else {
                            resolve({ transaction, response });
                        }
                    }).catch(error => {
                        console.error('Cannot save transaction', index, transaction, error);
                        setFormState(s => ({
                            ...s,
                            saving: { ...s.saving, [index]: false },
                        }));
                        reject({ transaction, error });
                    });
            }

            if (validTransactions.length === 0) {
                setSubmitting(false);
                return;
            }

            return new Promise((resolve, reject) => {
                return getPromise(validTransactions, 0, resolve, reject);
            }).then(responses => {
                postRequest(`finance/api/category/calculate-totals/`, {}).then(resp => {
                    categoriesEntity.fetch().then(() => {
                        const savedEntries = Object.values(saved).filter(s => s).length;
                        if (formState.values.length === validTransactions.length || savedEntries === formState.values.length) {
                            notify.success('All transactions have been added successfully.');
                            setFormState({ values: getInitialValues(finance, loggedUser), saved: {}, saving: {}});
                        } else {
                            const addedTR = validTransactions.length;
                            notify.success(`${addedTR} Transaction${addedTR > 1 ? 's' : ''} added successfully.`);
                        }
                        setSubmitting(false);
                    });
                });
            }).catch(error => {
                notify.error('Something went wrong!');
                console.error(error);
                setSubmitting(false);
            });
        }}
    >
        {props => {
            const { isSubmitting, handleSubmit } = props;
            const { values } = formState;

            const deleteTransaction = (batchIndex) => {
                setFormState({
                    ...formState,
                    values: [...formState.values.map((v, index) => index !== batchIndex ? v : null)].filter(v => v)
                });
            };

            const cloneTransaction = (batchIndex) => {
                const values = [];
                formState.values.forEach((v, index) => {
                    values.push(v);
                    if (index === batchIndex) values.push(JSON.parse(JSON.stringify(v)));
                });
                setFormState({ ...formState, values });
            };

            const addTransaction = () => {
                const lastTransaction = formState.values[formState.values.length - 1];
                setFormState({
                    ...formState,
                    values: [...formState.values,
                        { ...newTransaction(),
                            account: lastTransaction.account,
                            movement_date: lastTransaction.movement_date,
                            category: lastTransaction.category
                        }
                    ]});
            };

            const setFieldValue = (field, batchIndex, value) => {
                const trEdit = formState.values[batchIndex];
                trEdit[field] = value;
                setFormState({
                    ...formState,
                    values: formState.values.map((trValue, index) => index === batchIndex ? trEdit : trValue)
                });
            };

            const reloadEntities = () => {
                store.dispatch({ type: SET_IS_RELOADING_ENTITIES, loading: true });

                const preloadPromises = [
                    accountsEntity.fetch(),
                    categoriesEntity.fetch(),
                    contextsEntity.fetch(),
                    tagsEntity.fetch(),
                    vendorsEntity.fetch(),
                ];

                Promise.all(preloadPromises).then(() => {
                    store.dispatch({ type: SET_IS_RELOADING_ENTITIES, loading: false });
                });
            }

            const controls = <Controls
                reloadEntities={reloadEntities}
                isReloadingEntities={finance.isReloadingEntities}
                isSubmitting={isSubmitting}
            />;
            return <form onSubmit={handleSubmit}>
                <Page>
                    <PageHeader controls={controls} scrollRef={pageBodyRef}>
                        <Breadcrumbs breadcrumbs={TRANSACTIONS_BREADCRUMBS} />
                        Add Batch
                    </PageHeader>
                    <PageBody fullHeight={true} withPageHeader={true} pageBodyRef={pageBodyRef}>
                        <Options finance={finance} formState={formState} setFormState={setFormState} />
                        <TransactionAddBatchForm {...props}
                            values={values}
                            setFieldValue={setFieldValue}
                            addTransaction={addTransaction}
                            cloneTransaction={cloneTransaction}
                            deleteTransaction={deleteTransaction}
                            fullFormState={formState}
                        />
                        {loggedUser.is_superuser && <CodeHighlight toggle={{ initial: false }}>
                            {JSON.stringify(values, null, 2)}
                        </CodeHighlight>}
                    </PageBody>
                </Page>
            </form>;
        }}
    </Formik>;
}


function Controls({ reloadEntities, isReloadingEntities, isSubmitting }) {
    return <Fragment>
        <Button onClick={reloadEntities} disabled={isReloadingEntities}>
            {isReloadingEntities && <InlineLoader />}
            Reload Entities
        </Button>
        <Button tag={Link}
            to={TRANSACTIONS_BASE_URL}
        >Cancel</Button>
        <Button
            disabled={isSubmitting ? true : false}
            type="submit"
            classes={['positive']}
        >Save</Button>
    </Fragment>;
}

Controls.propTypes = {
    reloadEntities: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
};


function Options({ finance, formState, setFormState }) {
    const [viewOptions, setViewOptions] = useState(false);

    if (!viewOptions) {
        const spanClass = 'primary m-l-5 m-r-5';
        const spanStyle = { paddingTop: 3 };
        return <div className="flex-container--middle">
            <Button classes={['small']} onClick={() => setViewOptions(true)}>
                <Icon name="settings" size="small" className="m-r-5 grey-l1" /> Options
            </Button>
            {formState.global.context && <span className={spanClass} style={spanStyle}>
                Context: {finance.contexts[formState.global.context].name}
            </span>}
            {formState.global.currencyConversion && <span className={spanClass} style={spanStyle}>
                Currency Conversion: {formState.global.currencyConversion}
            </span>}
        </div>;
    }

    const contexts = Object.values(finance.contexts).sort((c1, c2) => c1.start_date > c2.start_date ? -1 : 1);

    return <div>
        <h4 className="m-t-0">
            Options
            <Button classes={['small']} className="m-l-10" onClick={() => setViewOptions(false)}>Close</Button>
        </h4>
        <Form>
            <RowBlock>
                <ColumnBlock className="col-xs-12 col-sm-6 col-md-2 col-lg-2">
                    <HField style={{ width: '100%' }}>
                        <Select
                            name={`tr-global-context`}
                            placeholder="Select Context"
                            value={formState.global.context}
                            onChange={entry => {
                                setFormState({ ...formState, global: { ...formState.global, context: entry.value }})
                            }}
                            options={contexts.map(c => ({ value: c.id, label: c.name}))}
                        />
                    </HField>
                </ColumnBlock>
                <ColumnBlock className="col-xs-12 col-sm-6 col-md-2 col-lg-2">
                    <HField style={{ width: '100%' }}>
                        <Input value={formState.global.currencyConversion || ''}
                            name={`tr-global-currency-conversion`}
                            style={{ textAlign: 'right' }}
                            placeholder="Currency Conversion"
                            onChange={e => {
                                setFormState({ ...formState, global: { ...formState.global, currencyConversion: e.target.value || null }})
                            }}
                        />
                    </HField>
                </ColumnBlock>
            </RowBlock>
        </Form>
    </div>
}

Options.propTypes = {
    finance: PropTypes.object.isRequired,
    formState: PropTypes.object.isRequired,
    setFormState: PropTypes.func.isRequired,
};
