import { moneyMovementsByPeriod } from '../data/moneyMovementsDataUtils';
import { timeHistogram } from './histograms';

export function categoriesMonthly(chart, { finance, previousMonths }) {
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

    const { valueAxis } = timeHistogram(chart, data);

    // budget guides
    let axisRange = valueAxis.axisRanges.create();
    axisRange.value = monthlyBudget;
    axisRange.grid.strokeOpacity = 0.1;
    axisRange.label.text = "Current Monthly Budget";
    axisRange.label.align = "right";
    axisRange.label.verticalCenter = "bottom";
    axisRange.label.fillOpacity = 0.8;

}