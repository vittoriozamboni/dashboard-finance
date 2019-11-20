import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import { moneyMovementsByPeriod } from '../data/moneyMovementsDataUtils';


export function categoriesDetailedMonthly(chart, { finance, showLastMonths }) {
    const monthsData = moneyMovementsByPeriod({ finance, previousMonths: showLastMonths });

    // Get the top 3 and compress other values into "Others"
    chart.data = [];
    const allCategories = {};

    Object.keys(monthsData).forEach(month => {
        const data = monthsData[month];
        let categories = Object.keys(data).map(category => ({
            category: parseInt(category),
            amount: data[category].reduce((tot, m) => tot + parseFloat(m.amount), 0)
        }));
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


    /* INCOMING */
    /*
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
    */

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