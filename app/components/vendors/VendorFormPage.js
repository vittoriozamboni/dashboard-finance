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

import { VENDORS_BREADCRUMBS, VENDORS_BASE_URL } from './constants';
import { VendorEntity, newVendor } from '../../models/vendor';
import { VendorForm } from './VendorForm';

export function VendorFormPage() {
    const finance = useSelector(state => state.finance);
    const history = useHistory();
    const { id: paramsId } = useParams();
    const loggedUser = getCurrentUser();
    const { vendors } = finance;

    const initialVendor = paramsId
        ? vendors[+paramsId] || newVendor()
        : newVendor();

    const [vendor, setVendor] = useState(initialVendor);

    return <Formik
        enableReinitialize={true}
        initialValues={{ ...vendor }}
        onSubmit={(values, { setSubmitting }) => {
            const vendorObj = new VendorEntity();
            vendorObj.save(values).then(response => {
                setVendor(response);
                setSubmitting(false);
                history.push(VENDORS_BASE_URL);
            });
        }}
    >
        {props => {
            const { values, isSubmitting, handleSubmit, setSubmitting } = props;

            const deleteVendor = () => {
                const vendorObj = new VendorEntity();
                setSubmitting(true);
                vendorObj.delete(vendor.id).then(() => {
                    setSubmitting(false);
                    history.push(VENDORS_BASE_URL);
                });
            };

            const controls = <Controls
                isSubmitting={isSubmitting}
                deleteVendor={initialVendor.id ? deleteVendor : null}
            />;
            return <form onSubmit={handleSubmit}>
                <Page>
                    <PageHeader controls={controls}>
                        <Breadcrumbs breadcrumbs={VENDORS_BREADCRUMBS} />
                        {vendor.id ? `Edit ${vendor.name}` : 'Add Vendor'}
                    </PageHeader>
                </Page>
                <PageBody>
                    <div style={{ maxWidth: 600 }}>
                        <VendorForm {...props} vendor={vendor} finance={finance} />
                        {loggedUser.is_superuser && <CodeHighlight toggle={{ initial: false }}>
                            {JSON.stringify(values, null, 2)}
                        </CodeHighlight>}
                    </div>
                </PageBody>
            </form>;
        }}
    </Formik>;
}

function Controls({ isSubmitting, deleteVendor }) {
    return <Fragment>
        {deleteVendor &&
            <Button
                disabled={!!isSubmitting} onClick={() => deleteVendor()}
                classes={['negative']}
            >Delete</Button>
        }
        <Button tag={Link}
            to={VENDORS_BASE_URL}
        >Cancel</Button>
        <Button
            disabled={!!isSubmitting} type="submit"
            classes={['positive']}
        >Save</Button>
    </Fragment>;
}

Controls.propTypes = {
    isSubmitting: PropTypes.bool,
    deleteVendor: PropTypes.func,
};

