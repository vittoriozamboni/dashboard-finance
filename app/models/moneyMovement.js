import BaseEntity from "models/common/base";

import { SET_MONEY_MOVEMENTS, SET_MONEY_MOVEMENT, DELETE_MONEY_MOVEMENT } from '../actions';
export const BASE_URL = 'finance/api/money-movement/';

export function newMoneyMovement() {
    return {
        id: null,
        amount: 0,
        movement: '-',
        description: '',
        tags: [],
        movement_date: null,
        context: null,
        category: null,
        user: null,
        other_users: [],
        one_time: false,
        master: null,
        master_total: 0,
        incomplete_total: false,
    };
}

export class MoneyMovementEntity extends BaseEntity {
    constructor (properties) {
        super('FinanceMoneyMovement', {
            baseUrl: BASE_URL,
            hasPagination: false,
            ...properties
        });
    }

    static emptyEntry () {
        return newMoneyMovement();
    }

    fetch (options) {
        return super.fetch({
            fetchActionSet: SET_MONEY_MOVEMENTS,
            ...options
        });
    }

    save (entry) {
        const saveEntry = { ...entry };
        saveEntry.amount = parseFloat(saveEntry.amount);
        saveEntry.other_users = [...entry.other_users].map(ou => {
            ou.amount = parseFloat(ou.amount);
            return ou;
        });
        return super.save(saveEntry, { autoGet: true, actionSingleSet: SET_MONEY_MOVEMENT });
    }

    delete (id) {
        return super.delete(id, { deleteAction: DELETE_MONEY_MOVEMENT });
    }

    getByCategory(categoryId, moneyMovementsList) {
        return moneyMovementsList.filter(mm => mm.category === categoryId);
    }

    getByCategories(categoriesId, moneyMovementsList) {
        return moneyMovementsList.filter(mm => categoriesId.includes(mm.category));
    }

    getByContext(contextId, moneyMovementsList) {
        return moneyMovementsList.filter(mm => mm.context === contextId);
    }
}

export const moneyMovementsEntity = new MoneyMovementEntity();
