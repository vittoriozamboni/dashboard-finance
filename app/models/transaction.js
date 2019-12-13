import BaseEntity from "models/common/base";

import { SET_TRANSACTIONS, SET_TRANSACTION, DELETE_TRANSACTION } from '../actions';
export const BASE_URL = 'finance/api/transaction/';

export function newTransaction() {
    return {
        id: null,
        amount: 0,
        movement: '-',
        description: '',
        tags: [],
        movement_date: null,
        context: null,
        category: null,
        account: null,
        vendor: null,
    };
}

export class TransactionEntity extends BaseEntity {
    constructor (properties) {
        super('FinanceTransaction', {
            baseUrl: BASE_URL,
            hasPagination: false,
            ...properties
        });
    }

    static emptyEntry () {
        return newTransaction();
    }

    fetch (options) {
        return super.fetch({
            fetchActionSet: SET_TRANSACTIONS,
            ...options
        });
    }

    save (entry) {
        const saveEntry = { ...entry };
        saveEntry.amount = parseFloat(saveEntry.amount);
        return super.save(saveEntry, { autoGet: true, actionSingleSet: SET_TRANSACTION });
    }

    delete (id) {
        return super.delete(id, { deleteAction: DELETE_TRANSACTION });
    }

    getByAccount(accountId, transactionsList) {
        return transactionsList.filter(mm => mm.account === accountId);
    }

    getByContext(contextId, transactionsList) {
        return transactionsList.filter(mm => mm.context === contextId);
    }
}

export const transactionsEntity = new TransactionEntity();
