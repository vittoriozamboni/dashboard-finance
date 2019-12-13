import React from 'react';
import PropTypes from 'prop-types';

import { Form, Field, Input } from 'components/ui/form';


export function VendorForm({ values, setFieldValue, handleBlur }) {

    return <Form>
        <Field label="Name">
            <Input id="vendor-name" value={values.name}
                onChange={e => setFieldValue('name', e.target.value)}
                onBlur={handleBlur}
            />
        </Field>
        <Field label="Short Name">
            <Input id="vendor-short-name" value={values.short_name}
                onChange={e => setFieldValue('short_name', e.target.value)}
                onBlur={handleBlur}
            />
        </Field>
    </Form>;
}

VendorForm.propTypes = {
    values: PropTypes.object,
    setFieldValue: PropTypes.func,
    handleBlur: PropTypes.func,
};
