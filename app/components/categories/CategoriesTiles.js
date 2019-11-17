import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Block } from 'components/ui/Blocks';
import { Icon } from 'components/ui/Icon';
import { Card } from 'components/ui/Cards';

import { CATEGORIES_BASE_URL } from './constants';

export function CategoriesTiles({ categoriesTree }) {
    if (categoriesTree.length === 0) return '';

    return <Block className="finance__categories__tiles">
        {categoriesTree.map(treeNode => {
            const category = treeNode.category;
            const category_url = `${CATEGORIES_BASE_URL}/${category.id}`;
            const color = category.attributes_ui.color || undefined;

            const subcategories = treeNode.children.length > 0
                ? <CategorySubcategories treeNode={treeNode} />
                : <div>No subcategories</div>;
            const description = <Fragment>
                {subcategories}
                <CategoryTotal category={category} />
            </Fragment>;
            const controls = <Fragment>
                <Link to={category_url} className="ui-card__control">View details</Link>
                <Link to={`${category_url}/edit`} className="ui-button ui-button--primary">Edit</Link>
            </Fragment>;

            return <Card
                styles={{ container: { width: "calc(100% - 10px)" } }}
                colors={color ? { side: color, icon: color } : {}}
                title={<Link to={category_url}>{category.name}</Link>}
                icon={<Link to={category_url}><Icon name={category.attributes_ui.icon || 'devices_hub'} /></Link>}
                description={description}
                controls={controls}
            />;
        })}
    </Block>;
}

CategoriesTiles.propTypes = {
    categoriesTree: PropTypes.array,
};

function CategorySubcategories({ treeNode }) {
    const [viewSubcategories, setViewSubcategories] = useState(false);
    return <div>
        <span onClick={() => setViewSubcategories(!viewSubcategories)} className="cursor-pointer">{treeNode.children.length} subcategories (toggle)</span>
        {viewSubcategories &&
            <div className="ui-tiles__container ui-tiles--small">
                {treeNode.children.map(subTreeNode => {
                    return <CategoryTile key={subTreeNode.category.id} category={subTreeNode.category} />;
                })}
            </div>
        }
    </div>;
}

CategorySubcategories.propTypes = {
    treeNode: PropTypes.object,
};

function CategoryTile({ category }) {
    return <Link className="ui-tiles__tile"
        to={`${FINANCE_BASE_URL}/categories/${category.id}`}
    >
        <div className="ui-tiles__tile__icon">
            <Icon {...category.attributes_ui.color && { style: { color: `${category.attributes_ui.color}` } }}
                className={`fas ${category.attributes_ui.icon || 'fa-tree'}`} />
        </div>
        <div className="ui-tiles__tile__label">{category.name}</div>
    </Link>;
}

CategoryTile.propTypes = {
    category: PropTypes.object,
};

function CategoryTotal({ category }) {
    const total = category.user_data && category.user_data.totals && category.user_data.totals.total;
    if (!total) return '';

    const posNegClass = `finance__categories__tiles__total--${total > 0 ? 'positive' : 'negative'}`;
    const posNegIcon = total > 0 ? 'arrow_upward' : 'arrow_downward';
    const posNegIconClass = `finance__categories__tiles__total__icon--${total > 0 ? 'positive' : 'negative'}`;

    return <div className="finance__categories__tiles__total__container">
        <div className={`finance__categories__tiles__total ${posNegClass}`}>{total}</div>
        <Icon name={posNegIcon} className={posNegIconClass} size="big" />
    </div>;
}

CategoryTotal.propTypes = {
    category: PropTypes.object,
};

