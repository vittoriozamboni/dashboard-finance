import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import { VENDORS_BASE_URL } from './constants';

import { Vendors } from './Vendors';
import { VendorFormPage } from './VendorFormPage';
import { VendorDetail } from './VendorDetail';

function VendorsLanding() {
    return <Switch>
        <Route exact path={`${VENDORS_BASE_URL}`} component={Vendors} />
        <Route exact path={`${VENDORS_BASE_URL}/add`} component={VendorFormPage} />
        <Route exact path={`${VENDORS_BASE_URL}/:id/edit`} component={VendorFormPage} />
        <Route exact path={`${VENDORS_BASE_URL}/:id`} component={VendorDetail} />
    </Switch>;
}

const connectedVendorsLanding = withRouter(VendorsLanding);
export { connectedVendorsLanding as VendorsLanding };
