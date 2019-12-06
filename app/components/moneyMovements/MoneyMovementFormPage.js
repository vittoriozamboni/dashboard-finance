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

import { MONEY_MOVEMENTS_BASE_URL, MONEY_MOVEMENTS_BREADCRUMBS } from './constants';
import { categoriesEntity } from '../../models/category';
import { moneyMovementsEntity, newMoneyMovement } from '../../models/moneyMovement';
import { MoneyMovementForm } from './MoneyMovementForm';


export function MoneyMovementFormPage() {
    const finance = useSelector(state => state.finance);
    const history = useHistory();
    const { id: paramsId } = useParams();

    const pageBodyRef = useRef(null);
    const { moneyMovements } = finance;
    const loggedUser = getCurrentUser();

    const initialMoneyMovement = paramsId
        ? moneyMovements[+paramsId] || newMoneyMovement()
        : newMoneyMovement();
    initialMoneyMovement.amount = initialMoneyMovement.amount + '';
    if (!initialMoneyMovement.user) initialMoneyMovement.user = loggedUser.id;

    const [moneyMovement, setMoneyMovement] = useState(initialMoneyMovement);

    return <Formik
        enableReinitialize={true}
        initialValues={{ ...moneyMovement }}
        onSubmit={(values, { setSubmitting }) => {
            moneyMovementsEntity.save(values).then(response => {
                setMoneyMovement(response);
                setSubmitting(false);
                postRequest(`finance/api/category/calculate-totals/`, {}).then(resp => {
                    categoriesEntity.get(response.category).then(() => {
                        history.push(MONEY_MOVEMENTS_BASE_URL);
                    });
                });
            }).catch(() => {
                setSubmitting(false);
            });
        }}
    >
        {props => {
            const { values, isSubmitting, handleSubmit, setSubmitting } = props;

            const deleteMoneyMovement = () => {
                setSubmitting(true);
                moneyMovementsEntity.delete(moneyMovement.id).then(() => {
                    setSubmitting(false);
                    history.push(MONEY_MOVEMENTS_BASE_URL);
                });
            };

            const controls = <Controls
                isSubmitting={isSubmitting}
                deleteMoneyMovement={initialMoneyMovement.id ? deleteMoneyMovement : null}
            />;
            return <form onSubmit={handleSubmit}>
                <Page>
                    <PageHeader controls={controls} scrollRef={pageBodyRef}>
                        <Breadcrumbs breadcrumbs={MONEY_MOVEMENTS_BREADCRUMBS} />
                        {moneyMovement.id ? `Edit Money Movement` : 'Add Money Movement'}
                    </PageHeader>
                    <PageBody fullHeight={true} withPageHeader={true} pageBodyRef={pageBodyRef}>
                        <MoneyMovementForm {...props} moneyMovement={moneyMovement} />
                        {loggedUser.is_superuser && <CodeHighlight toggle={{ initial: false }}>
                            {JSON.stringify(values, null, 2)}
                        </CodeHighlight>}
                    </PageBody>
                </Page>
            </form>;
        }}
    </Formik>;
}


function Controls({ isSubmitting, deleteMoneyMovement }) {
    return <Fragment>
        {deleteMoneyMovement &&
            <Button
                disabled={!!isSubmitting}
                onClick={() => deleteMoneyMovement()}
                classes={['small', 'negative']}
            >Delete</Button>
        }
        <Link to={MONEY_MOVEMENTS_BASE_URL} className="ui-button ui-button--small">Cancel</Link>
        <Button
            disabled={!!isSubmitting}
            type="submit"
            classes={['small', 'positive']}
        >Save</Button>
    </Fragment>;
}

Controls.propTypes = {
    isSubmitting: PropTypes.bool,
    deleteMoneyMovement: PropTypes.func,
};

