import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Formik } from 'formik';

import { Breadcrumbs } from 'components/ui/Breadcrumbs';
import { Button } from 'components/ui/Button';
import { Page } from 'components/ui/Page';
import { PageBody } from 'components/ui/PageBody';
import { PageHeader } from 'components/ui/PageHeader';
import { CodeHighlight } from 'components/style/CodeHighlight';
import { getCurrentUser } from 'libs/authentication/utils';

import { ACCOUNTS_BREADCRUMBS, ACCOUNTS_BASE_URL } from './constants';
import { AccountEntity, newAccount } from '../../models/account';
import { AccountForm } from './AccountForm';

export function AccountFormPage() {
    const finance = useSelector(state => state.finance);
    const history = useHistory();
    const { id: paramsId } = useParams();
    const loggedUser = getCurrentUser();
    const { accounts } = finance;

    const initialAccount = paramsId
        ? accounts[+paramsId] || newAccount()
        : newAccount();

    const [account, setAccount] = useState(initialAccount);

    return <Formik
        enableReinitialize={true}
        initialValues={{ ...account }}
        onSubmit={(values, { setSubmitting }) => {
            const accountObj = new AccountEntity();
            accountObj.save(values).then(response => {
                setAccount(response);
                setSubmitting(false);
                history.push(ACCOUNTS_BASE_URL);
            });
        }}
    >
        {props => {
            const { values, isSubmitting, handleSubmit, setSubmitting } = props;

            const deleteAccount = () => {
                const accountObj = new AccountEntity();
                setSubmitting(true);
                accountObj.delete(account.id).then(() => {
                    setSubmitting(false);
                    history.push(ACCOUNTS_BASE_URL);
                });
            };

            const controls = <Controls
                isSubmitting={isSubmitting}
                deleteAccount={initialAccount.id ? deleteAccount : null}
            />;
            return <form onSubmit={handleSubmit}>
                <Page>
                    <PageHeader controls={controls}>
                        <Breadcrumbs breadcrumbs={ACCOUNTS_BREADCRUMBS} />
                        {account.id ? `Edit ${account.name}` : 'Add account'}
                    </PageHeader>
                </Page>
                <PageBody>
                    <div style={{ maxWidth: 600 }}>
                        <AccountForm {...props} account={account} finance={finance} canEditUser={!account.id} />
                        {loggedUser.is_superuser && <CodeHighlight toggle={{ initial: false }}>
                            {JSON.stringify(values, null, 2)}
                        </CodeHighlight>}
                    </div>
                </PageBody>
            </form>;
        }}
    </Formik>;
}

function Controls({ isSubmitting, deleteAccount }) {
    return <Fragment>
        {deleteAccount &&
            <Button
                disabled={!!isSubmitting} onClick={() => deleteAccount()}
                classes={['negative']}
            >Delete</Button>
        }
        <Button tag={Link}
            to={ACCOUNTS_BASE_URL}
        >Cancel</Button>
        <Button
            disabled={!!isSubmitting} type="submit"
            classes={['positive']}
        >Save</Button>
    </Fragment>;
}

Controls.propTypes = {
    isSubmitting: PropTypes.bool,
    deleteAccount: PropTypes.func,
};

