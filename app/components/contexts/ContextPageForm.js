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

import { CONTEXTS_BREADCRUMBS, CONTEXTS_BASE_URL } from './constants';
import { ContextEntity, newContext } from '../../models/context';
import { ContextForm } from './ContextForm';


export function ContextPageForm() {
    const finance = useSelector(state => state.finance);
    const history = useHistory();
    const { id: paramsId } = useParams();
    const loggedUser = getCurrentUser();
    const { contexts } = finance;

    const initialContext = paramsId
        ? contexts[+paramsId] || newContext()
        : newContext();

    const [context, setContext] = useState(initialContext);

    return <Formik
        enableReinitialize={true}
        initialValues={{ ...context }}
        onSubmit={(values, { setSubmitting }) => {
            const contextObj = new ContextEntity();
            contextObj.save(values).then(response => {
                setContext(response);
                setSubmitting(false);
                history.push(CONTEXTS_BASE_URL);
            });
        }}
    >
        {props => {
            const { values, isSubmitting, handleSubmit, setSubmitting } = props;

            const deleteContext = () => {
                const contextObj = new ContextEntity();
                setSubmitting(true);
                contextObj.delete(context.id).then(() => {
                    setSubmitting(false);
                    history.push(CONTEXTS_BASE_URL);
                });
            };

            const controls = <Controls
                isSubmitting={isSubmitting}
                deleteContext={initialContext.id ? deleteContext : null}
            />;
            return <form onSubmit={handleSubmit}>
                <Page>
                    <PageHeader controls={controls}>
                        <Breadcrumbs breadcrumbs={CONTEXTS_BREADCRUMBS} />
                        {context.id ? `Edit ${context.name}` : 'Add Context'}
                    </PageHeader>
                    <PageBody>
                        <div style={{ maxWidth: 600 }}>
                            <ContextForm {...props} context={context} />
                            {loggedUser.is_superuser && <CodeHighlight toggle={{ initial: false }}>
                                {JSON.stringify(values, null, 2)}
                            </CodeHighlight>}
                        </div>
                    </PageBody>
                </Page>
            </form>;
        }}
    </Formik>;
}


function Controls({ isSubmitting, deleteContext }) {
    return <Fragment>
        {deleteContext &&
            <Button
                disabled={isSubmitting ? true : false}
                onClick={() => deleteContext()}
                classes={['small', 'negative']}
            >Delete</Button>
        }
        <Link
            to={CONTEXTS_BASE_URL}
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
    deleteContext: PropTypes.func,
};

