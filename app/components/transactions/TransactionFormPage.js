import React, { Fragment, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Formik } from 'formik';

import { getCurrentUser } from 'libs/authentication/utils';
import { postRequest } from 'libs/requests/requests';
import { Breadcrumbs } from 'components/ui/Breadcrumbs';
import { Button } from 'components/ui/Button';
import { Page } from 'components/ui/Page';
import { PageHeader } from 'components/ui/PageHeader';
import { PageBody } from 'components/ui/PageBody';
import { CodeHighlight } from 'components/style/CodeHighlight';

import { TRANSACTIONS_BASE_URL, TRANSACTIONS_BREADCRUMBS } from './constants';
import { categoriesEntity } from '../../models/category';
import { transactionsEntity, newTransaction } from '../../models/transaction';
import { TransactionForm } from './TransactionForm';


function hasValue(value) {
    if (value && value.length !== undefined) return value.length > 0;

    return !!value;
}


function requiredFields(values, fields) {
    const missing = {};
    for (let field of fields) {
        if (typeof field === 'string') {
            if (!hasValue(values[field])) missing[field] = 'Required';
        } else if (typeof field === 'object') {
            if (field.field) {
                const val = field.type === 'number'
                    ? parseFloat(values[field.field]) : values[field.field];
                if (!hasValue(val)) missing[field.field] = 'Required';
            } else if (field.length !== undefined) {
                const atLeastOne = field.map(f => values[f]).some(hasValue);
                if (!atLeastOne) {
                    for (let subField of field) {
                        missing[subField] = `Required at least one of ${field.join(', ')}`;
                    }
                }
            }
        }
    }
    return missing;
}


export function TransactionFormPage() {
    const finance = useSelector(state => state.finance);
    const history = useHistory();
    const { id: paramsId } = useParams();

    const pageBodyRef = useRef(null);
    const { transactions } = finance;
    const loggedUser = getCurrentUser();

    const initialTransaction = paramsId
        ? transactions[+paramsId] || newTransaction()
        : newTransaction();
    initialTransaction.amount = initialTransaction.amount + '';
    initialTransaction.categories = [];

    const [transaction, setTransaction] = useState(initialTransaction);

    return <Formik
        enableReinitialize={true}
        initialValues={{ ...transaction }}
        validate={(values) => {
            const required = requiredFields(values, [{ field: 'amount', type: 'number' }, 'movement_date', 'account', ['category', 'categories']]);
            const errors = {
                ...required,
            };
            if (values.categories.length > 0) {
                const sum = values.categories.reduce((tot, c) => tot + c.amount, 0);
                if (sum !== parseFloat(values.amount)) {
                    errors['amount_total'] = 'Amount and categories total should match';
                }
            }
            return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);
            transactionsEntity.save(values).then(response => {
                setSubmitting(false);
                postRequest(`finance/api/category/calculate-totals/`, {}).then(resp => {
                    const categoriesUpdate = [];
                    if (values.categories && values.categories.length > 0) {
                        for (categoryAmount of values.categories) {
                            categoriesUpdate.push(categoriesEntity.get(categoryAmount.category));
                        }
                    } else {
                        categoriesUpdate.push(categoriesEntity.get(values.category));
                    }
                    Promise.all(categoriesUpdate).then(() => {
                        history.push(TRANSACTIONS_BASE_URL);
                    });
                });
            }).catch(() => {
                setSubmitting(false);
            });
        }}
    >
        {props => {
            const { values, isSubmitting, isValid, handleSubmit, setSubmitting, errors, submitCount } = props;

            const deleteTransaction = () => {
                setSubmitting(true);
                transactionsEntity.delete(transaction.id).then(() => {
                    setSubmitting(false);
                    history.push(TRANSACTIONS_BASE_URL);
                });
            };

            const controls = <Controls
                isSubmitting={isSubmitting}
                isValid={isValid}
                deleteTransaction={initialTransaction.id ? deleteTransaction : null}
            />;
            return <form onSubmit={handleSubmit}>
                <Page>
                    <PageHeader controls={controls} scrollRef={pageBodyRef}>
                        <Breadcrumbs breadcrumbs={TRANSACTIONS_BREADCRUMBS} />
                        {transaction.id ? `Edit Transaction` : 'Add Transaction'}
                    </PageHeader>
                    <PageBody fullHeight={true} withPageHeader={true} pageBodyRef={pageBodyRef}>
                        {submitCount && errors.amount_total &&
                            <h2>{errors.amount_total}</h2>
                        }
                        <TransactionForm {...props} transaction={transaction} />
                        {loggedUser.is_superuser && <CodeHighlight toggle={{ initial: false }}>
                            {JSON.stringify(values, null, 2)}
                        </CodeHighlight>}
                    </PageBody>
                </Page>
            </form>;
        }}
    </Formik>;
}


function Controls({ isSubmitting, isValid, deleteTransaction }) {
    return <Fragment>
        {deleteTransaction &&
            <Button
                disabled={!!isSubmitting}
                onClick={() => deleteTransaction()}
                classes={['negative']}
            >Delete</Button>
        }
        <Button tag={Link} to={TRANSACTIONS_BASE_URL}>Cancel</Button>
        <Button
            disabled={!!isSubmitting || !isValid}
            type="submit"
            classes={['positive']}
        >Save</Button>
    </Fragment>;
}

Controls.propTypes = {
    isSubmitting: PropTypes.bool,
    isValid: PropTypes.bool,
    deleteTransaction: PropTypes.func,
};

