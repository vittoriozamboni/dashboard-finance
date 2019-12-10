import BaseEntity from "models/common/base";

import { SET_ACCOUNTS, SET_ACCOUNT, DELETE_ACCOUNT } from '../actions';
export const BASE_URL = 'finance/api/account/';

export function newAccount() {
    return {
        id: null,
        name: '',
        short_name: '',
        users_relation: [],
    };
}

export class AccountEntity extends BaseEntity {
    constructor (properties) {
        super('FinanceAccount', {
            baseUrl: BASE_URL,
            hasPagination: false,
            ...properties
        });
    }

    static emptyEntry () {
        return newAccount();
    }

    fetch (options) {
        return super.fetch({
            fetchActionSet: SET_ACCOUNTS,
            ...options
        });
    }

    save (entry) {
        const saveEntry = { ...entry };
        saveEntry.users_relation = [...entry.users_relation].map(ur => {
            ur.percentage = parseFloat(ur.percentage);
            return ur;
        });
        return super.save(saveEntry, { autoGet: true, actionSingleSet: SET_ACCOUNT });
    }

    delete (id) {
        return super.delete(id, { deleteAction: DELETE_ACCOUNT });
    }
}

export const accountsEntity = new AccountEntity();
