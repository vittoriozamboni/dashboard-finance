import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { Form, Field } from 'components/ui/form';
import { CodeHighlight } from 'components/style/CodeHighlight';

import { FINANCE_BASE_URL } from '../../constants';
import { getCurrentUser } from 'libs/authentication/utils';
import { RowBlock, ColumnBlock } from 'components/ui/Blocks';
import { ALink } from 'components/ui/ALink';
import { Icon } from 'components/ui/Icon';


export function MoneyMovementDetail({ moneyMovement }) {
    const finance = useSelector(state => state.finance);
    const loggedUser = getCurrentUser();

    const category = finance.categories[moneyMovement.category];
    const context = moneyMovement.context && finance.contexts[moneyMovement.context];

    return <Form>
        <RowBlock>
            <ColumnBlock>
                <Field label="Amount">{moneyMovement.movement}{moneyMovement.amount}</Field>
            </ColumnBlock>
            <ColumnBlock>
                <Field label="Date">{moneyMovement.movement_date}</Field>
            </ColumnBlock>
        </RowBlock>
        <RowBlock>
            <ColumnBlock>
                <Field label="Category">
                    {category.attributes_ui.icon &&
                        <Icon name={category.attributes_ui.icon} className="m-r-10" />
                    }
                    <ALink to={`${FINANCE_BASE_URL}/categories/${category.id}`}>
                        {category.name}
                    </ALink>
                </Field>
            </ColumnBlock>
            <ColumnBlock>
                <Field label="Context">{context && context.name}</Field>
            </ColumnBlock>
        </RowBlock>
        {moneyMovement.movement === '-' &&
            <RowBlock>
                <ColumnBlock>
                    <Field label="Users" style={{ alignItems: 'flex-start' }}>
                        {moneyMovement.other_users.map(ur => {
                            return <div key={ur.id}>{ur.amount} paid by {finance.users[ur.user].first_name}</div>;
                        })}
                    </Field>
                </ColumnBlock>
                <ColumnBlock>
                    <Field label="Tags" style={{ alignItems: 'flex-start' }} inputProps={{ style: { display: 'inline-flex', flexWrap: 'wrap' } }}>
                        {moneyMovement.tags.map(tag => {
                            return <label className="ui-tag ui-tag--primary" key={tag}>{tag}</label>;
                        })}
                    </Field>
                </ColumnBlock>
            </RowBlock>
        }
        {moneyMovement.description &&
            <Field label="Description" vertical={true}>
                {moneyMovement.description}
            </Field>
        }
        {loggedUser.is_superuser &&
            <div className="m-t-15">
                <CodeHighlight toggle={{ initial: false }}>{JSON.stringify(moneyMovement, null, 2)}</CodeHighlight>
            </div>
        }
    </Form>;
}

MoneyMovementDetail.propTypes = {
    moneyMovement: PropTypes.object.isRequired,
};
