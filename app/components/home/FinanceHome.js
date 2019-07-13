import React, { Fragment, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";

import { PageHeader } from 'components/ui/PageHeader';

import '../categories/categories.scss';

import { FINANCE_BASE_URL } from '../../constants';
import { withFinance } from '../../storeConnection';
import { MainGraph } from './MainGraph';
import { BrowseCard } from './BrowseCard';


function FinanceHome({ history }) {

    return <Fragment>
        <PageHeader>Finance</PageHeader>        
        <div className="ui-page-body">
            <div>
                <MainGraph />
            </div>
            <div className="row">
                <div className="col-sm-12 col-md-6">
                    <h3>Actions</h3>
                    <BrowseCard
                        title="Add Batch"
                        description="Add a batch of Money Movements"
                        onClick={() => history.push(`${FINANCE_BASE_URL}/money-movements/add/batch`)}
                        icon="fas fa-money-bill-wave-alt"
                        width="50%"
                    />
                </div>
                <div className="col-sm-12 col-md-6">
                    <h3>Browse</h3>
                    <BrowseCard
                        title="Categories"
                        description="View all Categories"
                        onClick={() => history.push(`${FINANCE_BASE_URL}/categories`)}
                        icon="fas fa-sitemap"
                        color="#dc6967"
                        width="30%"
                    />
                    <BrowseCard
                        title="Contexts"
                        description="Browse Contexts and see them in the timeline"
                        onClick={() => history.push(`${FINANCE_BASE_URL}/contexts`)}
                        icon="fas fa-tag"
                        color="#dc8c67"
                        width="30%"
                    />
                    <BrowseCard
                        title="Money Movements"
                        description="View all Money Movements"
                        onClick={() => history.push(`${FINANCE_BASE_URL}/money-movements`)}
                        icon="fas fa-money-bill-wave-alt"
                        color="#dcaf67"
                        width="30%"
                    />
                </div>
            </div>
        </div>
    </Fragment>;
};

const connectedFinanceHome = withRouter(withFinance(FinanceHome));
export { connectedFinanceHome as FinanceHome };