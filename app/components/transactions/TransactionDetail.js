import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { Form, Field } from 'components/ui/form';
import { CodeHighlight } from 'components/style/CodeHighlight';

import { getCurrentUser } from 'libs/authentication/utils';
import { RowBlock, ColumnBlock } from 'components/ui/Blocks';
import { Table } from 'components/ui/table/Table';
import { Icon } from 'components/ui/Icon';


export function TransactionDetail({ transaction }) {
    const finance = useSelector(state => state.finance);
    const loggedUser = getCurrentUser();

    const context = transaction.context && finance.contexts[transaction.context];
    const account = transaction.account && finance.accounts[transaction.account];
    const vendor = transaction.vendor && finance.vendors[transaction.vendor];

    const mmColumns = [
        { prop: 'category_icon', title: '', width: 50 },
        { prop: 'category', title: 'Category' },
        { prop: 'amount', title: 'Amount', width: 60, style: { textAlign: 'right', paddingRight: '10px' } },
    ];
    const mmEntries = transaction.money_movements.filter(mmId => finance.moneyMovements[mmId]).map(mmId => {
        const mm = finance.moneyMovements[mmId];
        const category = finance.categories[mm.category];
        return {
            ...mm,
            category_icon: category.attributes_ui.icon && <Icon name={category.attributes_ui.icon} size="small" />,
            category: category.full_name,
        };
    });
    const mmConfig = { zebra: true, borderType: 'none', hideHeader: true, statusBarController: { visible: false } };

    return <Form style={{ overflowX: 'hidden' }}>
        <RowBlock>
            <ColumnBlock>
                <Field label="Amount">{transaction.movement}{transaction.amount}</Field>
            </ColumnBlock>
            <ColumnBlock>
                <Field label="Date">{transaction.movement_date}</Field>
            </ColumnBlock>
        </RowBlock>
        <RowBlock>
            <ColumnBlock>
                <Field label={transaction.money_movements.length === 1 ? 'Category' : 'Categories'}>
                    <Table columns={mmColumns} entries={mmEntries} config={mmConfig} />
                </Field>
            </ColumnBlock>
            <ColumnBlock>
                <Field label="Account">{account && account.name}</Field>
                <Field label="Vendor">{vendor && vendor.name}</Field>
            </ColumnBlock>
        </RowBlock>
        <RowBlock>
            <ColumnBlock>
                <Field label="Context">{context && context.name}</Field>
            </ColumnBlock>
            <ColumnBlock>
                <Field label="Tags" style={{ alignItems: 'flex-start' }} inputProps={{ style: { display: 'inline-flex', flexWrap: 'wrap' } }}>
                    {transaction.tags.map(tag => {
                        return <label className="ui-tag ui-tag--primary" key={tag}>{tag}</label>;
                    })}
                </Field>
            </ColumnBlock>
        </RowBlock>
        {transaction.description &&
            <Field label="Description" vertical={true}>
                {transaction.description}
            </Field>
        }
        {loggedUser.is_superuser &&
            <div className="m-t-15">
                <CodeHighlight toggle={{ initial: false }}>{JSON.stringify(transaction, null, 2)}</CodeHighlight>
            </div>
        }
    </Form>;
}

TransactionDetail.propTypes = {
    transaction: PropTypes.object.isRequired,
};
