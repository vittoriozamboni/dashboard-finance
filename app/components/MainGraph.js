import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

import { withFinance } from '../storeConnection';

function MainGraph({ finance }) {

    const currentYear = new Date().getFullYear();
    const lastYearMM = Object.values(finance.moneyMovements);
        // .filter(mm => mm.movement_date.indexOf(`${currentYear}-`) === 0);
    const monthChartContainerId = 'finance-home-month-chart-container';

    useEffect(() => {
        const chart = createChart(
            am4core.create(monthChartContainerId, am4charts.XYChart),
            { lastYearMM, finance }
        );        
        return () => { chart && chart.dispose(); };
    }, []);

    return <div>
        <div id={monthChartContainerId} style={{ width: "100%", height: "300px" }}></div>
    </div>;
}

const connectedMainGraph = withFinance(MainGraph);
export { connectedMainGraph as MainGraph };

MainGraph.propTypes = {
    finance: PropTypes.object.isRequired,
};

function createChart(chart, { lastYearMM, finance }) {
    // Divide by months
    const monthsData = lastYearMM.reduce((months, mm) => {
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
    Object.keys(monthsData).sort().forEach(month => {
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
    function createSeries(field, name, stacked) {
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = field;
        series.dataFields.categoryX = 'month';
        series.name = name;
        series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
        series.stacked = stacked;
        series.columns.template.width = am4core.percent(95);
    }
    
    chart.colors.list = [];
    Object.keys(allCategories).forEach(categoryId => {
        if (categoryId === 'others') {
            chart.colors.list.push(am4core.color('#A9A9A9'));
            createSeries(categoryId, 'Others', true);        
        } else {
            const category = finance.categories[categoryId];
            chart.colors.list.push(am4core.color(category.attributes_ui.color || '#ccddff'));
            createSeries(categoryId, category.name, true);
        }
    });

    // Add legend
    chart.legend = new am4charts.Legend();
}