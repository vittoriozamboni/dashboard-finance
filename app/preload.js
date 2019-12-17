import { store } from 'store/store';
import { SET_APPLICATION_LOADING } from 'store/actions';
import { accountsEntity } from './models/account';
import { categoriesEntity } from './models/category';
import { contextsEntity } from './models/context';
import { moneyMovementsEntity } from './models/moneyMovement';
import { tagsEntity } from './models/tag';
import { transactionsEntity } from './models/transaction';
import { usersEntity } from './models/user';
import { vendorsEntity } from './models/vendor';
import { INITIALIZE } from './actions';


export function preload() {
    return new Promise(resolve => {
        store.dispatch({ type: SET_APPLICATION_LOADING, loading: true });

        const preloadPromises = [
            accountsEntity.fetch(),
            categoriesEntity.fetch(),
            contextsEntity.fetch(),
            moneyMovementsEntity.fetch(),
            tagsEntity.fetch(),
            transactionsEntity.fetch(),
            usersEntity.fetch(),
            vendorsEntity.fetch(),
        ];

        Promise.all(preloadPromises).then(() => {
            store.dispatch({ type: SET_APPLICATION_LOADING, loading: false });
            store.dispatch({ type: INITIALIZE });
            resolve();
        });
    });
}