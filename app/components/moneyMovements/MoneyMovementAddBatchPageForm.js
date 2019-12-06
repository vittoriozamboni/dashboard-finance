import React, { Fragment, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { Formik } from 'formik';

import { notify } from 'libs/notifications/notifications';
import { postRequest } from 'libs/requests/requests';
import { getCurrentUser } from 'libs/authentication/utils';

import { Breadcrumbs } from 'components/ui/Breadcrumbs';
import { Button } from 'components/ui/Button';
import { Page } from 'components/ui/Page';
import { PageBody } from 'components/ui/PageBody';
import { PageHeader } from 'components/ui/PageHeader';
import { CodeHighlight } from 'components/style/CodeHighlight';

import { FINANCE_BASE_URL } from '../../constants';
import { categoriesEntity } from '../../models/category';
import { moneyMovementsEntity, newMoneyMovement } from '../../models/moneyMovement';
import { MoneyMovementAddBatchForm } from './MoneyMovementAddBatchForm';
import { MONEY_MOVEMENTS_BREADCRUMBS, MONEY_MOVEMENTS_BASE_URL } from './constants';


export function MoneyMovementAddBatchPageForm() {
    const history = useHistory();
    const loggedUser = getCurrentUser();
    const pageBodyRef = useRef(null);

    const initialValues = [newMoneyMovement(), newMoneyMovement(), newMoneyMovement()]
        .map(mm => ({ ...mm, user: loggedUser.id, amount: mm.amount + '' }));
    const initialState = { values: initialValues };

    const [formState, setFormState] = useState(initialState);

    return <Formik
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting }) => {
            const promises = [];
            for (let values of formState.values) {
                if (values.movement_date) {
                    promises.push(moneyMovementsEntity.save(values));
                }
            };
            if (promises.lenght === 0) {
                setSubmitting(false);
                return;
            }
            return Promise.all(promises).then(responses => {
                const totalMM = formState.values.length;
                const values = [...formState.values.map((v, index) => !!(responses[index] && responses[index].id) ? null : v)].filter(v => v);
                setFormState({ ...formState, values });
                setSubmitting(false);
                postRequest(`finance/api/category/calculate-totals/`, {}).then(resp => {
                    categoriesEntity.fetch().then(() => {
                        if (values.length === 0) {
                            notify.success('All money movements added successfully.');
                            history.push(`${FINANCE_BASE_URL}/money-movements`);
                        } else if (totalMM > values.length) {
                            const addedMM = totalMM - values.length;
                            notify.success(`${addedMM} Money Movement${addedMM > 1 ? 's' : ''} added successfully.`);
                        }
                    });
                });
            }).catch(() => {
                console.log('Done with error :(');
                notify.error('Something went wrong, check the console.');
                setSubmitting(false);
            });
        }}
    >
        {props => {
            const { isSubmitting, handleSubmit } = props;
            const { values } = formState;

            const deleteMoneyMovement = (batchIndex) => {
                setFormState({
                    ...formState,
                    values: [...formState.values.map((v, index) => index !== batchIndex ? v : null)].filter(v => v)
                });
            };

            const cloneMoneyMovement = (batchIndex) => {
                const values = [];
                formState.values.forEach((v, index) => {
                    values.push(v);
                    if (index === batchIndex) values.push(JSON.parse(JSON.stringify(v)));
                });
                setFormState({ ...formState, values });
            };

            const addMoneyMovement = () => {
                setFormState({
                    ...formState,
                    values: [...formState.values, newMoneyMovement()]
                });
            };

            const setFieldValue = (field, batchIndex, value) => {
                const mmEdit = formState.values[batchIndex];
                mmEdit[field] = value;
                setFormState({
                    ...formState,
                    values: formState.values.map((mmValue, index) => index === batchIndex ? mmEdit : mmValue)
                });
            };

            const controls = <Controls
                isSubmitting={isSubmitting}
            />;
            return <form onSubmit={handleSubmit}>
                <Page>
                    <PageHeader controls={controls} scrollRef={pageBodyRef}>
                        <Breadcrumbs breadcrumbs={MONEY_MOVEMENTS_BREADCRUMBS} />
                        Add Batch
                    </PageHeader>
                    <PageBody fullHeight={true} withPageHeader={true} pageBodyRef={pageBodyRef}>
                        <MoneyMovementAddBatchForm {...props}
                            values={values}
                            setFieldValue={setFieldValue}
                            addMoneyMovement={addMoneyMovement}
                            cloneMoneyMovement={cloneMoneyMovement}
                            deleteMoneyMovement={deleteMoneyMovement}
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


function Controls({ isSubmitting }) {
    return <Fragment>
        <Link
            to={MONEY_MOVEMENTS_BASE_URL}
            className="ui-button ui-button--small"
        >Cancel</Link>
        <Button
            disabled={isSubmitting ? true : false}
            type="submit"
            classes={['small', 'positive']}
        >Save</Button>
    </Fragment>;
}

Controls.propTypes = {
    isSubmitting: PropTypes.bool,
};

