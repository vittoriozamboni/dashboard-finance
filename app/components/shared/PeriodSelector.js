import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Select } from 'components/ui/form/Select';

import { FINANCE_PERIODS } from '../../constants';
import { SET_SELECTED_PERIOD } from '../../actions';


const periods = Object.values(FINANCE_PERIODS).sort((p1, p2) => p1.order > p2.order ? 1 : -1).map(period => {
    return {
        value: period.key,
        label: period.label,
    };
})

export function PeriodSelector() {
    const dispatch = useDispatch();
    const finance = useSelector(state => state.finance);


    return  <Select className="finance__period-selector__select"
        value={finance.selectedPeriod}
        onChange={period => dispatch({ type: SET_SELECTED_PERIOD, selectedPeriod: period.value })}
        options={periods}
    />;
}

