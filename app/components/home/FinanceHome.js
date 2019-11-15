import React, { Fragment, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";

import { Page } from 'components/ui/Page';
import { PageHeader } from 'components/ui/PageHeader';
import { PageBody } from 'components/ui/PageBody';

import '../categories/categories.scss';

import { FINANCE_BASE_URL } from '../../constants';
import { withFinance } from '../../storeConnection';
import { MainGraph } from './MainGraph';
import { BrowseCard } from './BrowseCard';
import { RowBlock, ColumnBlock } from 'components/ui/Blocks';


function FinanceHome({ history }) {

    return <Page>
        <PageHeader>Finance</PageHeader>
        <PageBody>
            <div>
                <MainGraph />
            </div>
            <RowBlock>
                <ColumnBlock>
                    <h3>Actions</h3>
                    <BrowseCard
                        title="Add Batch"
                        description="Add a batch of Money Movements"
                        onClick={() => history.push(`${FINANCE_BASE_URL}/money-movements/add/batch`)}
                        icon="import_export"
                        width="50%"
                    />
                </ColumnBlock>
                <ColumnBlock>
                    <h3>Browse</h3>
                    <BrowseCard
                        title="Categories"
                        description="View all Categories"
                        onClick={() => history.push(`${FINANCE_BASE_URL}/categories`)}
                        icon="device_hub"
                        color="#dc6967"
                        width="30%"
                    />
                    <BrowseCard
                        title="Contexts"
                        description="Browse Contexts and see them in the timeline"
                        onClick={() => history.push(`${FINANCE_BASE_URL}/contexts`)}
                        icon="adjust"
                        color="#dc8c67"
                        width="30%"
                    />
                    <BrowseCard
                        title="Money Movements"
                        description="View all Money Movements"
                        onClick={() => history.push(`${FINANCE_BASE_URL}/money-movements`)}
                        icon="import_export"
                        color="#dcaf67"
                        width="30%"
                    />
                </ColumnBlock>
            </RowBlock>
        </PageBody>
    </Page>;
};

const connectedFinanceHome = withRouter(withFinance(FinanceHome));
export { connectedFinanceHome as FinanceHome };