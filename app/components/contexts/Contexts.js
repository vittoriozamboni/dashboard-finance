import React, { Fragment, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Breadcrumbs } from 'components/ui/Breadcrumbs';
import { PageBody } from 'components/ui/PageBody';
import { PageHeader } from 'components/ui/PageHeader';

import { FINANCE_BASE_URL, FINANCE_BREADCRUMBS } from '../../constants';
import { ContextsTimeline } from './ContextsTimeline';


export function Contexts() {
    const pageBodyRef = useRef(null);
    const finance = useSelector(state => state.finance);

    const controls = <Controls />;

    return <Fragment>
        <PageHeader controls={controls} scrollRef={pageBodyRef}>
        <Breadcrumbs breadcrumbs={FINANCE_BREADCRUMBS} />
            Contexts
        </PageHeader>
        <PageBody fullHeight={true} withPageHeader={true} pageBodyRef={pageBodyRef}>
            <ContextsTimeline contexts={finance.contexts} moneyMovements={finance.moneyMovements} />
        </PageBody>
    </Fragment>;
}

function Controls() {
    const baseClass = 'ui-button ui-button--small';
    return <Fragment>
        <Link
            to={`${FINANCE_BASE_URL}/contexts/add`}
            className={`${baseClass} ui-button--primary`}
        >Add Context</Link>
    </Fragment>;
}

