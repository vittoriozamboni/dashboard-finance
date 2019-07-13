import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

import { FullSectionLoader } from 'components/ui/Loader';

import { withFinance } from '../../storeConnection';


function MainGraph({ finance }) {    
    const monthsOfCurrentYear = new Date().getMonth() + 1;
    const monthChartContainerId = 'finance-home-month-chart-container';

    const [showLastMonths, setShowLastMonths] = useState(monthsOfCurrentYear);

    useEffect(() => {        
        const chart = createChart(
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

function createChart(chart, { finance, showLastMonths }) {
    // Divide by months
    const monthsData = Object.values(finance.moneyMovements).reduce((months, mm) => {
        const month = `${mm.movement_date.split('-')[0]}-${mm.movement_date.split('-')[1]}`;
        if (!months[month]) months[month] = {};
        // Group by first level - if parent is set, use it
        const categoryId = finance.categories[mm.category].parent || mm.category;
        if (!months[month][categoryId]) months[month][categoryId] = 0;
        months[month][categoryId] += parseFloat(mm.amount);
        return months;
    }, {});

    // Get the top 3 and compress other values into "Others"
    chart.data = [];
    const allCategories = {};

    let months = Object.keys(monthsData).sort();
    if (showLastMonths)
        months = months.slice(-1 * showLastMonths);

    months.forEach(month => {
        const data = monthsData[month];
        let categories = Object.keys(data).map(category => ({
            category: parseInt(category), amount: data[category]
        }));
        /*
        if (categories.length > 3) {
            categories.sort((a, b) => a.amount > b.amount ? -1 : 1);
            categories = categories.slice(0, 3).concat(
                { category: 'others', amount: categories.slice(3).reduce((tot, cat) => tot + cat.amount, 0) }
            );            
        }
        */
        categories.forEach(category => allCategories[category.category] = true);
        chart.data.push({
            month,
            ...categories.reduce((dict, cat) => { dict[cat.category] = cat.amount; return dict; }, {}),
        });
    });
    
    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'month';
    categoryAxis.title.text = 'Year - Month';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;
    
    let  valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text = "Amount (Euro)";
    
    // Create series
    function createSeries(field, name) {
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = field;
        series.dataFields.categoryX = 'month';
        series.name = name;
        series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
        series.stacked = true;
        series.columns.template.width = am4core.percent(95);
    }
    
    const incoming = Object.values(finance.categories).filter(c => c.name === 'Incoming')[0];
    
    chart.colors.list = [];

    Object.keys(allCategories).forEach(categoryId => {
        if (categoryId === 'others') {
            chart.colors.list.push(am4core.color('#A9A9A9'));
            createSeries(categoryId, 'Others');        
        } else if (+categoryId !== incoming.id) {
            const category = finance.categories[categoryId];
            chart.colors.list.push(am4core.color(category.attributes_ui.color || '#ccddff'));
            createSeries(categoryId, category.name);
        }
    });

    //create line
    let lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.valueY = incoming.id;
    lineSeries.dataFields.categoryX = "month";
    lineSeries.name = "Incoming";
    lineSeries.strokeWidth = 3;
    lineSeries.stroke = am4core.color(incoming.attributes_ui.color);
    lineSeries.tooltipText = "Incoming in {categoryX}: {valueY.value}";

    //add bullets
    let circleBullet = lineSeries.bullets.push(new am4charts.CircleBullet());
    circleBullet.circle.fill = am4core.color("#fff");
    circleBullet.circle.strokeWidth = 2;

    //add chart cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomX";

    chart.fontSize = 12;

    // Add legend
    chart.legend = new am4charts.Legend();
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 15;
    markerTemplate.height = 15;
}