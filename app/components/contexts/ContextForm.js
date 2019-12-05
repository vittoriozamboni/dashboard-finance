import React from 'react';
import PropTypes from 'prop-types';
import { CompactPicker } from 'react-color';

import { Form, Field } from 'components/ui/form/Form';
import { Input } from 'components/ui/form/Input';
import { Textarea } from 'components/ui/form/Textarea';
import { IconPicker } from 'components/ui/form/iconPicker/IconPicker';

export function ContextForm({ values, setFieldValue, handleBlur }) {
    const iconName = values.attributes_ui.icon || '';

    return <Form>
        <Field label="Name">
            <Input id="context-name" value={values.name}
                onChange={e => setFieldValue('name', e.target.value)}
                onBlur={handleBlur}
            />
        </Field>
        <Field label="Start Date">
            <Input id="context-start-date" value={values.start_date || ''}
                onChange={e => setFieldValue('start_date', e.target.value)}
                onBlur={handleBlur}
            />
        </Field>
        <Field label="End Date">
            <Input id="context-end-date" value={values.end_date || ''}
                onChange={e => setFieldValue('end_date', e.target.value)}
                onBlur={handleBlur}
            />
        </Field>
        <Field label="Description">
            <Textarea id="context-description" value={values.description || ''}
                onChange={e => setFieldValue('description', e.target.value)}
                onBlur={handleBlur}
            />
        </Field>
        <Field label="Icon">
            <IconPicker
                id="context-icon"
                initialIcon={iconName}
                onPickConfirm={newIconName => setFieldValue('attributes_ui.icon', newIconName)}
            />
        </Field>
        <Field label="Color">
            <CompactPicker id="context-color"
                color={values.attributes_ui.color}
                onChangeComplete={color => setFieldValue('attributes_ui.color', color.hex)}
            />
        </Field>
    </Form>;
}

ContextForm.propTypes = {
    values: PropTypes.object,
    setFieldValue: PropTypes.func,
    handleBlur: PropTypes.func,
};
