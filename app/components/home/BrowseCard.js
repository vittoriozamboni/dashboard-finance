import React from 'react';
import PropTypes from 'prop-types';

import { Card } from 'components/ui/Cards';
import { Icon } from 'components/ui/Icon';


export function BrowseCard({ title, description, onClick, icon, color, width }) {
    return <Card
        title={title}
        description={description}
        onClick={onClick}
        colors={{ side: color || '#6794dc', icon: color || '#6794dc' }}
        styles={{ container: { cursor: 'pointer', minWidth: '250px', width, maxWidth: '400px', height: '100px' } }}
        icon={<Icon name={icon} size="big" />}
    />;
}

BrowseCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    icon: PropTypes.string.isRequired,
    color: PropTypes.string,
    width: PropTypes.string,
}
