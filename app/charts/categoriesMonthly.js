import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

export function categoriesMonthly(chart, { finance, showLastMonths }) {
    const incoming = Object.values(finance.categories).filter(c => c.name === 'Incoming')[0];

    // Divide by months
    const monthsData = Object.values(finance.moneyMovements).reduce((months, mm) => {
        const month = `${mm.movement_date.split('-')[0]}-${mm.movement_date.split('-')[1]}`;
        if (!months[month]) months[month] = {};
        // Group by first level - if parent is set, use it
        const categoryId = finance.categories[mm.category].parent || mm.category;
        // Ignore "incoming" category
        if (+categoryId === incoming.id) return months;

        months[month] += parseFloat(mm.amount);
        return months;
    }, {});

    const monthlyBudget = Object.values(finance.categories).reduce((budget, category) => {
        const catBudgets = category.user_data.budgets;
        if (catBudgets.length > 0 && !category.parent)
            return budget += +catBudgets[0].amount;
        return budget;
    }, 0);

    let months = Object.keys(monthsData).sort();
    if (showLastMonths)
        months = months.slice(-1 * showLastMonths);

    chart.data = Object.keys(monthsData).reduce((all, month) => {
        if (months.includes(month))
            return [...all, { date: month + '-01', amount: monthsData[month] }];
        return all;
    }, []);

        chart.dateFormatter.inputDateFormat = "YYYY-MM-yy";
    chart.zoomOutButton.disabled = true;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.strokeOpacity = 0;
    dateAxis.renderer.minGridDistance = 5;
    dateAxis.dateFormats.setKey("day", "d");
    dateAxis.tooltip.hiddenState.properties.opacity = 1;
    dateAxis.tooltip.hiddenState.properties.visible = true;


    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.fillOpacity = 0.3;
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.min = 0;
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.renderer.gridContainer.zIndex = 1;

    // budget guides
    let axisRange = valueAxis.axisRanges.create();
    axisRange.value = monthlyBudget;
    axisRange.grid.strokeOpacity = 0.1;
    axisRange.label.text = "Current Monthly Budget";
    axisRange.label.align = "right";
    axisRange.label.verticalCenter = "bottom";
    axisRange.label.fillOpacity = 0.8;

    let series = chart.series.push(new am4charts.ColumnSeries);
    series.dataFields.valueY = "amount";
    series.dataFields.dateX = "date";
    series.tooltipText = "{valueY.value}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.hiddenState.properties.opacity = 1;
    series.tooltip.hiddenState.properties.visible = true;

    let columnTemplate = series.columns.template;
    columnTemplate.width = 30;
    columnTemplate.column.cornerRadiusTopLeft = 20;
    columnTemplate.column.cornerRadiusTopRight = 20;
    columnTemplate.strokeOpacity = 0;

    /*
    columnTemplate.adapter.add("fill", function (fill, target) {
        let dataItem = target.dataItem;
        if (dataItem.valueY > 6000) {
            return chart.colors.getIndex(0);
        }
        else {
            return am4core.color("#a8b3b7");
        }
    })
    */

    let cursor = new am4charts.XYCursor();
    cursor.behavior = "panX";
    chart.cursor = cursor;
    cursor.lineX.disabled = true;

    columnTemplate.tooltipText = "{valueY.value}";
    columnTemplate.tooltipY = 0;
    columnTemplate.strokeOpacity = 0;

    chart.fontSize = 12;

}