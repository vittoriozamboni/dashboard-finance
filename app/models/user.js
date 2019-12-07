import BaseEntity from "models/common/base";

import { SET_USERS } from '../actions';
export const BASE_URL = 'finance/api/user/';

export class UserEntity extends BaseEntity {
    constructor (properties) {
        super('FinanceUser', {
            baseUrl: BASE_URL,
            hasPagination: false,
            ...properties
        });
    }

    static emptyEntry () {
        throw new Error('User entity is read only');
    }

    fetch (options) {
        return super.fetch({
            fetchActionSet: SET_USERS,
            mapData: data => data.map(user => {
                const splittedName = user.full_name.split(' ');
                const parts = splittedName.length;
                const initials = [
                    splittedName[0].substr(0, 1),
                    parts > 1 ? splittedName[parts - 1].substr(0 , 1) : ''
                ];
                return {
                    ...user,
                    initials: initials.join('').toUpperCase(),
                }
            }),
            ...options
        });
    }

    save () {
        throw new Error('User entity is read only');
    }

    delete () {
        throw new Error('User entity is read only');
    }
}

export const usersEntity = new UserEntity();
