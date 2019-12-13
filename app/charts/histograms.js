import * as am4charts from "@amcharts/amcharts4/charts";

export function histogram(chart, data, propX, propY ) {
    chart.data = data;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = propX;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
        if (target.dataItem && target.dataItem.index & 2 == 2) {
            return dy + 25;
        }
        return dy;
    });

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = propY;
    series.dataFields.categoryX = propX;
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    return { series, columnTemplate, valueAxis, categoryAxis };
}

export function timeHistogram(chart, data, { propY='amount', propX='date'} = {}) {
    console.log('DATA', data);
    chart.data = data;

    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";
    chart.zoomOutButton.disabled = true;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.strokeOpacity = 0;
    dateAxis.renderer.minGridDistance = 20;
    dateAxis.periodChangeDateFormats.setKey("month", "[bold]yyyy[/]");
    dateAxis.dateFormats.setKey("month", "[font-size: 12px]MMM");
    dateAxis.baseInterval = {
        "timeUnit": "month",
        "count": 1
    }

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.fillOpacity = 0.3;
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.min = 0;
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.renderer.gridContainer.zIndex = 1;

    let series = chart.series.push(new am4charts.ColumnSeries);
    series.dataFields.valueY = propY;
    series.dataFields.dateX = propX;
    series.tooltipText = "{valueY.value}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.hiddenState.properties.opacity = 1;
    series.tooltip.hiddenState.properties.visible = false;

    let columnTemplate = series.columns.template;
    columnTemplate.width = 30;
    columnTemplate.column.cornerRadiusTopLeft = 20;
    columnTemplate.column.cornerRadiusTopRight = 20;
    columnTemplate.strokeOpacity = 0;

    columnTemplate.tooltipText = "{valueY.value}";
    columnTemplate.tooltipY = 0;
    columnTemplate.strokeOpacity = 0;

    let cursor = new am4charts.XYCursor();
    cursor.behavior = "panX";
    cursor.lineX.disabled = true;
    chart.cursor = cursor;

    chart.fontSize = 12;

    return {
        dateAxis,
        valueAxis,
        series,
        columnTemplate,
        cursor,
    }
}