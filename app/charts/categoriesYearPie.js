import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';


export function categoriesYearPie(chart, { finance }) {
    const incoming = Object.values(finance.categories).filter(c => c.name === 'Incoming')[0];
    const currentYear = '2018'; //`${new Date().getFullYear}`;

    const categoriesData = Object.values(finance.moneyMovements).reduce((data, mm) => {
        if (mm.movement_date.indexOf(currentYear) === 0 && mm.category !== incoming.id) {
            if (!data[mm.category]) {
                data[mm.category] = 0;
            }
            data[mm.category] += +mm.amount;
        }
        return data;
    }, {});

    chart.data = Object.keys(categoriesData).map(categoryId => {
        return {
            amount: categoriesData[categoryId],
            category: finance.categories[categoryId].name,
        };
    });

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'amount';
    pieSeries.dataFields.category = 'category';
    pieSeries.slices.template.stroke = am4core.color('#fff');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
}