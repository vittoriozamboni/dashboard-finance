import React, { useEffect } from 'react';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import { categoriesPie } from '../../charts/categoriesPie';
import { InlineLoader } from 'components/ui/Loader';

export function CategoriesPieChart({ finance, moneyMovementsList }) {
    const pieChartContainerId = 'finance-categories-chart-container';

    useEffect(() => {
        if (!moneyMovementsList) return;

        const chart = categoriesPie(
            am4core.create(pieChartContainerId, am4charts.PieChart),
            { finance, moneyMovementsList }
        );
        return () => { chart && chart.dispose(); };
    }, [moneyMovementsList]);

    if (!moneyMovementsList) return <InlineLoader />;

    return <div id={pieChartContainerId} style={{ width: "100%", height: "400px" }}>
        <InlineLoader />
    </div>;
}