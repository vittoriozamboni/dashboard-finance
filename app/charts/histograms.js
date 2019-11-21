import * as am4charts from "@amcharts/amcharts4/charts";

export function timeHistogram(chart, data, { propY='amount', propX='date'} = {}) {
    chart.data = data;

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

    let series = chart.series.push(new am4charts.ColumnSeries);
    series.dataFields.valueY = propY;
    series.dataFields.dateX = propX;
    series.tooltipText = "{valueY.value}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.hiddenState.properties.opacity = 1;
    series.tooltip.hiddenState.properties.visible = true;

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