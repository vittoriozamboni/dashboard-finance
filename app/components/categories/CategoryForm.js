import React from 'react';
import PropTypes from 'prop-types';
import { CompactPicker } from 'react-color';

import { Form, Field } from 'components/ui/form/Form';
import { Input } from 'components/ui/form/Input';
import { IconPicker } from 'components/ui/form/iconPicker/IconPicker';

export function CategoryForm({ values, setFieldValue, handleBlur }) {
    const iconName = values.attributes_ui.icon || '';

    return <Form>
        <Field label="Name">
            <Input id="category-name" value={values.name}
                onChange={e => setFieldValue('name', e.target.value)}
                onBlur={handleBlur}
            />
        </Field>
        <Field label="Icon">
            <IconPicker
                id="category-icon"
                initialIcon={iconName}
                onPickConfirm={newIconName => setFieldValue('attributes_ui.icon', newIconName)}
            />
        </Field>
        <Field label="Color">
            <CompactPicker id="category-color"
                color={values.attributes_ui.color}
                onChangeComplete={color => setFieldValue('attributes_ui.color', color.hex)}
            />
        </Field>
    </Form>;
}

CategoryForm.propTypes = {
    values: PropTypes.object,
    setFieldValue: PropTypes.func,
    handleBlur: PropTypes.func,
};
