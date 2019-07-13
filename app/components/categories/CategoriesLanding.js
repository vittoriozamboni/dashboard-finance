import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import { FINANCE_BASE_URL } from '../../constants';

import { Categories } from './Categories';
import { CategoryPageForm } from './CategoryPageForm';
import { CategoryDetail } from './CategoryDetail';

function CategoriesLanding() {
    return <Switch>
        <Route exact path={`${FINANCE_BASE_URL}/categories`} component={Categories} />
        <Route exact path={`${FINANCE_BASE_URL}/categories/add`} component={CategoryPageForm} />
        <Route exact path={`${FINANCE_BASE_URL}/categories/:id/edit`} component={CategoryPageForm} />
        <Route exact path={`${FINANCE_BASE_URL}/categories/:id`} component={CategoryDetail} />
    </Switch>;
}

const connectedCategoriesLanding = withRouter(CategoriesLanding);
export { connectedCategoriesLanding as CategoriesLanding };
