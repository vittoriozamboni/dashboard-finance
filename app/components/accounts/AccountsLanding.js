import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import { ACCOUNTS_BASE_URL } from './constants';

import { Accounts } from './Accounts';
import { AccountFormPage } from './AccountFormPage';
import { AccountDetail } from './AccountDetail';

function AccountsLanding() {
    return <Switch>
        <Route exact path={`${ACCOUNTS_BASE_URL}`} component={Accounts} />
        <Route exact path={`${ACCOUNTS_BASE_URL}/add`} component={AccountFormPage} />
        <Route exact path={`${ACCOUNTS_BASE_URL}/:id/edit`} component={AccountFormPage} />
        <Route exact path={`${ACCOUNTS_BASE_URL}/:id`} component={AccountDetail} />
    </Switch>;
}

const connectedAccountsLanding = withRouter(AccountsLanding);
export { connectedAccountsLanding as AccountsLanding };
