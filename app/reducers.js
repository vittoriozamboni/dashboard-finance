import { listToObject } from 'utils/data';

import * as actions from './actions';
import { FINANCE_PERIODS_DEFAULT } from './constants';
import { getSavedState, saveState } from './browserStorage';
import { createCategoriesTree, createSubCategoriesTree } from './data/categoriesDataUtils';

const savedState = getSavedState();

const INITIAL_STATE = {
    initialized: false,
    accounts: {},
    categories: {},
    contexts: {},
    categoriesTree: [],
    isReloadingEntities: false,
    subCategoriesTree: {},
    moneyMovements: {},
    tags: {},
    transactions: {},
    users: {},
    vendors: {},
    selectedPeriod: savedState.selectedPeriod || FINANCE_PERIODS_DEFAULT,
};

const updateCategories = (state, categories) => {
    const subCategoriesTree = {};
    const categoriesTree = createCategoriesTree(categories);
    createSubCategoriesTree(categoriesTree, subCategoriesTree);
    return { ...state, categories, categoriesTree, subCategoriesTree, };
};

const finance = (currentState, action) => {
    const state = currentState ? currentState : INITIAL_STATE;

    let accounts;
    let categories;
    let contexts;
    let moneyMovements;
    let tags;
    let transactions;
    let vendors;
    switch (action.type) {
        case actions.INITIALIZE:
            return { ...state, initialized: true };

        case actions.SET_ACCOUNTS:
            accounts = listToObject(action.data, 'id');
            return { ...state, accounts };
        case actions.SET_ACCOUNT:
            const account = action.data;
            accounts = { ...state.accounts };
            accounts[account.id] = account;
            return { ...state, accounts };
        case actions.DELETE_ACCOUNT:
            accounts = { ...state.accounts };
            if (accounts.hasOwnProperty(action.id)) delete accounts[action.id];
            return { ...state, accounts };

        case actions.SET_CATEGORIES:
            categories = listToObject(action.data, 'id');
            return updateCategories(state, categories);
        case actions.SET_CATEGORY:
            const category = action.data;
            categories = { ...state.categories };
            categories[category.id] = category;
            return updateCategories(state, categories);
        case actions.DELETE_CATEGORY:
            categories = { ...state.categories };
            if (categories.hasOwnProperty(action.id)) delete categories[action.id];
            return updateCategories(state, categories);

        case actions.SET_CONTEXTS:
            contexts = listToObject(action.data, 'id');
            return { ...state, contexts };
        case actions.SET_CONTEXT:
            const context = action.data;
            contexts = { ...state.contexts };
            contexts[context.id] = context;
            return { ...state, contexts };
        case actions.DELETE_CONTEXT:
            contexts = { ...state.contexts };
            if (contexts.hasOwnProperty(action.id)) delete contexts[action.id];
            return { ...state, contexts };

        case actions.SET_MONEY_MOVEMENTS:
            moneyMovements = listToObject(action.data, 'id');
            return { ...state, moneyMovements };
        case actions.SET_MONEY_MOVEMENT:
            const moneyMovement = action.data;
            moneyMovements = { ...state.moneyMovements };
            moneyMovements[moneyMovement.id] = moneyMovement;
            return { ...state, moneyMovements };
        case actions.DELETE_MONEY_MOVEMENT:
            moneyMovements = { ...state.moneyMovements };
            if (moneyMovements.hasOwnProperty(action.id)) delete moneyMovements[action.id];
            return { ...state, moneyMovements };

        case actions.SET_TAGS:
            return { ...state, tags: listToObject(action.data, 'id') };
        case actions.SET_TAG:
            const tag = action.data;
            tags = { ...state.tags };
            tags[tag.id] = tag;
            return { ...state, tags };
        case actions.DELETE_TAG:
            tags = { ...state.tags };
            if (tags.hasOwnProperty(action.id)) delete tags[action.id];
            return { ...state, tags };

        case actions.SET_TRANSACTIONS:
            return { ...state, transactions: listToObject(action.data, 'id') };
        case actions.SET_TRANSACTION:
            const transaction = action.data;
            transactions = { ...state.transactions };
            transactions[transaction.id] = transaction;
            return { ...state, transactions };
        case actions.DELETE_TRANSACTION:
            transactions = { ...state.transaction };
            if (transactions.hasOwnProperty(action.id)) delete transactions[action.id];
            return { ...state, transactions };

        case actions.SET_VENDORS:
            vendors = listToObject(action.data, 'id');
            return { ...state, vendors };
        case actions.SET_VENDOR:
            const vendor = action.data;
            vendors = { ...state.vendors };
            vendors[vendor.id] = vendor;
            return { ...state, vendors };
        case actions.DELETE_VENDOR:
            vendors = { ...state.vendors };
            if (vendors.hasOwnProperty(action.id)) delete vendors[action.id];
            return { ...state, vendors };

        case actions.SET_USERS:
            const users = listToObject(action.data, 'id');
            return { ...state, users };

        case actions.SET_SELECTED_PERIOD:
            const newState = { ...state, selectedPeriod: action.selectedPeriod };
            saveState(newState);
            return newState;

        case actions.SET_IS_RELOADING_ENTITIES:
            return { ...state, isReloadingEntities: action.loading };

        default:
            return state;
    }
};

export const reducers = {
    finance,
};
