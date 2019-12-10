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
import { ACCOUNTS_BASE_URL } from './constants';


export function Accounts() {
    const pageBodyRef = useRef(null);
    const finance = useSelector(state => state.finance);

    const controls = <Controls />;

    return <Fragment>
        <PageHeader controls={controls} scrollRef={pageBodyRef}>
            <Breadcrumbs breadcrumbs={FINANCE_BREADCRUMBS} />
            Accounts
        </PageHeader>
        <PageBody fullHeight={true} withPageHeader={true} pageBodyRef={pageBodyRef}>
            <AccountsList accounts={finance.accounts} users={finance.users} />
        </PageBody>
    </Fragment>;
}


function Controls() {
    return <Fragment>
        <Button tag={Link}
            to={`${ACCOUNTS_BASE_URL}/add`}
            classes={['primary']}
        >Add Account</Button>
    </Fragment>;
}


function AccountsList({ accounts, users }) {
    const columns = [
        { prop: 'id', title: 'ID', width: 50 },
        { prop: 'name', title: 'Name', width: 200 },
        { prop: 'short_name', title: 'Short', width: 70 },
        { prop: 'users', title: 'Users', },
    ];

    const entries = Object.values(accounts).map(account => ({
        ...account,
        name: <ALink to={`${ACCOUNTS_BASE_URL}/${account.id}`}>{account.name}</ALink>,
        users: account.users_relation.map(
            ur => `${users[ur.user].full_name} - ${ur.percentage}%`).join(', '),
    }))

    const config = {
        bodyContainerProps: { style: { backgroundColor: '#f8fafb' } },
        verticalAlignment: 'middle',
    };

    return <Table columns={columns} entries={entries} config={config} />;
}

AccountsList.propTypes = {
    accounts: PropTypes.object,
    users: PropTypes.object,
};
