import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

import { FullSectionLoader } from 'components/ui/Loader';

import { categoriesMonthly } from 'apps/dashboard-finance/app/charts/categoriesMonthly';
import { withFinance } from '../../storeConnection';


function MainGraph({ finance }) {
    const monthsOfCurrentYear = new Date().getMonth() + 1;
    const monthChartContainerId = 'finance-home-month-chart-container';

    const [showLastMonths, setShowLastMonths] = useState(monthsOfCurrentYear);

    useEffect(() => {
        const chart = categoriesMonthly(
            am4core.create(monthChartContainerId, am4charts.XYChart),
            { finance, showLastMonths }
        );
        return () => { chart && chart.dispose(); };
    }, [showLastMonths]);

    return <div>
        <div className="finance__main-graph__title-container">
            Show
            <select className="finance__main-graph__select"
                value={showLastMonths}
                onChange={e => setShowLastMonths(+(e.target.value || 0))}
            >
                <option value="">All</option>
                <option value={monthsOfCurrentYear}>Current year</option>
                <option value={3}>Last 3 months</option>
                <option value={6}>Last 6 months</option>
                <option value={monthsOfCurrentYear + 12}>Last 2 years</option>
                <option value={monthsOfCurrentYear + 24}>Last 3 years</option>
            </select>
        </div>
        <div id={monthChartContainerId} style={{ width: "100%", height: "400px" }}><FullSectionLoader /></div>
    </div>;
}

const connectedMainGraph = withFinance(MainGraph);
export { connectedMainGraph as MainGraph };

MainGraph.propTypes = {
    finance: PropTypes.object.isRequired,
};

