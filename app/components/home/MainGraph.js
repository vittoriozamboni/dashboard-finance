import React, { useEffect } from 'react';
import{ useSelector } from 'react-redux';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

import { FullSectionLoader } from 'components/ui/Loader';

import { categoriesMonthly } from '../../charts/categoriesMonthly';
import { FINANCE_PERIODS } from '../../constants';

am4core.useTheme(am4themes_animated);


export function MainGraph() {
    const finance = useSelector(state => state.finance);
    const monthChartContainerId = 'finance-home-month-chart-container';
    const previousMonths = FINANCE_PERIODS[finance.selectedPeriod].previousMonths;

    useEffect(() => {
        const chart = categoriesMonthly(
            am4core.create(monthChartContainerId, am4charts.XYChart),
            { finance, previousMonths  }
        );
        return () => { chart && chart.dispose(); };
    }, [finance, previousMonths]);

    return <div>
        <div id={monthChartContainerId} style={{ width: "100%", height: "400px" }}><FullSectionLoader /></div>
    </div>;
}


