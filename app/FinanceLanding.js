import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from "react-router-dom";

import { FullSectionLoader } from 'components/ui/Loader';

import './components/categories/categories.scss';
import './components/contexts/contexts.scss';
import './components/home/home.scss';

import { FINANCE_BASE_URL } from './constants';
import { withFinance } from './storeConnection';
import { preload } from './preload';
import { FinanceHome } from './components/home/FinanceHome';
import { CategoriesLanding } from './components/categories/CategoriesLanding';
import { ContextsLanding } from './components/contexts/ContextsLanding';
import { MoneyMovementsLanding } from './components/moneyMovements/MoneyMovementsLanding';

export { FINANCE_BASE_URL };


function FinanceLanding({ finance }) {
    const [state, setState] = useState({ appInitialized: false });

    const setInitialized = () => setState(state => ({ ...state, appInitialized: true }));
    const initialize = () => {
        preload().then(setInitialized);
    };

    useEffect(() => {
        if (!finance.initialized)
            initialize();
        else
            setInitialized();
    }, [])

    const { appInitialized } = state;

    if (!appInitialized) {
        return <FullSectionLoader />;
    }

    return <Switch>
        <Route exact path={FINANCE_BASE_URL} component={FinanceHome} />
        <Route path={`${FINANCE_BASE_URL}/categories`} component={CategoriesLanding} />
        <Route path={`${FINANCE_BASE_URL}/contexts`} component={ContextsLanding} />
        <Route path={`${FINANCE_BASE_URL}/money-movements`} component={MoneyMovementsLanding} />
    </Switch>;
}

FinanceLanding.propTypes = {
    finance: PropTypes.object,
};

const ConnectedFinanceLanding = withFinance(FinanceLanding);
export { ConnectedFinanceLanding as FinanceLanding };