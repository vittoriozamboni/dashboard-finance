import BaseEntity from "models/common/base";

import { SET_VENDORS, SET_VENDOR, DELETE_VENDOR } from '../actions';
export const BASE_URL = 'finance/api/vendor/';

export function newVendor() {
    return {
        id: null,
        name: '',
        short_name: '',
    };
}

export class VendorEntity extends BaseEntity {
    constructor (properties) {
        super('FinanceVendor', {
            baseUrl: BASE_URL,
            hasPagination: false,
            ...properties
        });
    }

    static emptyEntry () {
        return newVendor();
    }

    fetch (options) {
        return super.fetch({
            fetchActionSet: SET_VENDORS,
            ...options
        });
    }

    save (entry) {
        return super.save(entry, { autoGet: true, actionSingleSet: SET_VENDOR });
    }

    delete (id) {
        return super.delete(id, { deleteAction: DELETE_VENDOR });
    }
}

export const vendorsEntity = new VendorEntity();
