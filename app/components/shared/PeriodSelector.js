import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { FINANCE_PERIODS } from '../../constants';
import { SET_SELECTED_PERIOD } from '../../actions';


export function PeriodSelector() {
    const dispatch = useDispatch();
    const finance = useSelector(state => state.finance);


    return  <select className="finance__main-graph__select"
        value={finance.selectedPeriod}
        onChange={e => dispatch({ type: SET_SELECTED_PERIOD, selectedPeriod: e.target.value })}
    >
        {Object.values(FINANCE_PERIODS).sort((p1, p2) => p1.order > p2.order ? 1 : -1).map(period => {
            return <option key={`finance__period__${period.key}`} value={period.key}>
                {period.label}
            </option>
        })}
    </select>;
}

