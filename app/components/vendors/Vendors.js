import React, { Fragment, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { ALink } from 'components/ui/ALink';
import { Breadcrumbs } from 'components/ui/Breadcrumbs';
import { Button } from 'components/ui/Button';
import { PageBody } from 'components/ui/PageBody';
import { PageHeader } from 'components/ui/PageHeader';
import { Table } from 'components/ui/table/Table';

import { FINANCE_BREADCRUMBS } from '../../constants';
import { VENDORS_BASE_URL } from './constants';


export function Vendors() {
    const pageBodyRef = useRef(null);
    const finance = useSelector(state => state.finance);

    const controls = <Controls />;

    return <Fragment>
        <PageHeader controls={controls} scrollRef={pageBodyRef}>
            <Breadcrumbs breadcrumbs={FINANCE_BREADCRUMBS} />
            Vendors
        </PageHeader>
        <PageBody fullHeight={true} withPageHeader={true} pageBodyRef={pageBodyRef}>
            <VendorsList vendors={finance.vendors} users={finance.users} />
        </PageBody>
    </Fragment>;
}


function Controls() {
    return <Fragment>
        <Button tag={Link}
            to={`${VENDORS_BASE_URL}/add`}
            classes={['primary']}
        >Add Vendor</Button>
    </Fragment>;
}


function VendorsList({ vendors, users }) {
    const columns = [
        { prop: 'id', title: 'ID', width: 50 },
        { prop: 'name', title: 'Name' },
        { prop: 'short_name', title: 'Short', width: 70 },
    ];

    const entries = Object.values(vendors).map(vendor => ({
        ...vendor,
        name: <ALink to={`${VENDORS_BASE_URL}/${vendor.id}`}>{vendor.name}</ALink>,
    }))

    const config = {
        bodyContainerProps: { style: { backgroundColor: '#f8fafb' } },
        verticalAlignment: 'middle',
    };

    return <Table columns={columns} entries={entries} config={config} />;
}

VendorsList.propTypes = {
    vendors: PropTypes.object,
    users: PropTypes.object,
};
