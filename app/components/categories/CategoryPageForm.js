import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Formik } from 'formik';

import { Breadcrumbs } from 'components/ui/Breadcrumbs';
import { Button } from 'components/ui/Button';
import { Page } from 'components/ui/Page';
import { PageBody } from 'components/ui/PageBody';
import { PageHeader } from 'components/ui/PageHeader';
import { CodeHighlight } from 'components/style/CodeHighlight';
import { getCurrentUser } from 'libs/authentication/utils';

import { CATEGORIES_BREADCRUMBS, CATEGORIES_BASE_URL } from './constants';
import { CategoryEntity, newCategory } from '../../models/category';
import { CategoryForm } from './CategoryForm';

export function CategoryPageForm() {
    const finance = useSelector(state => state.finance);
    const history = useHistory();
    const { id: paramsId } = useParams();
    const loggedUser = getCurrentUser();
    const { categories } = finance;

    const initialCategory = paramsId
        ? categories[+paramsId] || newCategory()
        : newCategory();

    const [category, setCategory] = useState(initialCategory);

    return <Formik
        enableReinitialize={true}
        initialValues={{ ...category }}
        onSubmit={(values, { setSubmitting }) => {
            const categoryObj = new CategoryEntity();
            categoryObj.save(values).then(response => {
                setCategory(response);
                setSubmitting(false);
                history.push(CATEGORIES_BASE_URL);
            });
        }}
    >
        {props => {
            const { values, isSubmitting, handleSubmit, setSubmitting } = props;

            const deleteCategory = () => {
                const categoryObj = new CategoryEntity();
                setSubmitting(true);
                categoryObj.delete(category.id).then(() => {
                    setSubmitting(false);
                    history.push(CATEGORIES_BASE_URL);
                });
            };

            const controls = <Controls
                isSubmitting={isSubmitting}
                deleteCategory={initialCategory.id ? deleteCategory : null}
            />;
            return <form onSubmit={handleSubmit}>
                <Page>
                    <PageHeader controls={controls}>
                        <Breadcrumbs breadcrumbs={CATEGORIES_BREADCRUMBS} />
                        {category.id ? `Edit ${category.full_name}` : 'Add category'}
                    </PageHeader>
                </Page>
                <PageBody>
                    <div style={{ maxWidth: 600 }}>
                        <CategoryForm {...props} category={category} />
                        {loggedUser.is_superuser && <CodeHighlight toggle={{ initial: false }}>
                            {JSON.stringify(values, null, 2)}
                        </CodeHighlight>}
                    </div>
                </PageBody>
            </form>;
        }}
    </Formik>;
}

function Controls({ isSubmitting, deleteCategory }) {
    return <Fragment>
        {deleteCategory &&
            <Button
                disabled={!!isSubmitting} onClick={() => deleteCategory()}
                classes={['negative', 'small']}
            >Delete</Button>
        }
        <Link
            to={CATEGORIES_BASE_URL}
            className="ui-button ui-button--small"
        >Cancel</Link>
        <Button
            disabled={!!isSubmitting} type="submit"
            classes={['positive', 'small']}
        >Save</Button>
    </Fragment>;
}

Controls.propTypes = {
    isSubmitting: PropTypes.bool,
    deleteCategory: PropTypes.func,
};

