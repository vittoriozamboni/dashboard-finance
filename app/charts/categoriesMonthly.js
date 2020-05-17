import { moneyMovementsByPeriod } from '../data/moneyMovementsDataUtils';
import { timeHistogram } from './histograms';
import { TRANSACTIONS_BASE_URL } from '../components/transactions/constants';

export function categoriesMonthly(chart, { finance, previousMonths, history }) {
    const monthsData = moneyMovementsByPeriod({ finance, previousMonths });
    const monthlyBudget = Object.values(finance.categories).reduce((budget, category) => {
        const catBudgets = category.user_data.budgets;
        if (catBudgets.length > 0 && !category.parent)
            return budget += +catBudgets[0].amount;
        return budget;
    }, 0);

    const data = Object.keys(monthsData).reduce((all, month) => {
        return [...all, {
            date: month + '-01',
            amount: monthsData[month].reduce((tot, m) => tot + parseFloat(m.amount), 0)
        }];
    }, []);

    const { valueAxis, series } = timeHistogram(chart, data);

    if (history)
        series.columns.template.events.on('hit', function(ev) {
            const month = ev.target.dataItem.dataContext.date.substr(0, 7);
            history.push(`${TRANSACTIONS_BASE_URL}?month=${month}`)
        }, this);

    // budget guides
    let axisRange = valueAxis.axisRanges.create();
    axisRange.value = monthlyBudget;
    axisRange.grid.strokeOpacity = 0.1;
    axisRange.label.text = "Current Monthly Budget";
    axisRange.label.align = "right";
    axisRange.label.verticalCenter = "bottom";
    axisRange.label.fillOpacity = 0.8;

}