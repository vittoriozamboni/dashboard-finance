import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import { TRANSACTIONS_BASE_URL } from './constants';

import { Transactions } from './Transactions';
import { TransactionFormPage } from './TransactionFormPage';
// import { AccountDetail } from './AccountDetail';

function TransactionsLanding() {
    return <Switch>
        <Route exact path={`${TRANSACTIONS_BASE_URL}`} component={Transactions} />
        <Route exact path={`${TRANSACTIONS_BASE_URL}/add`} component={TransactionFormPage} />
        <Route exact path={`${TRANSACTIONS_BASE_URL}/:id/edit`} component={TransactionFormPage} />
        {/*}
        <Route exact path={`${TRANSACTIONS_BASE_URL}/:id`} component={AccountDetail} />
        */}
    </Switch>;
}

const connectedTransactionsLanding = withRouter(TransactionsLanding);
export { connectedTransactionsLanding as TransactionsLanding };
