import React from 'react';
import PropTypes from 'prop-types';

import './button.scss';

const Button = props => {
    return (
        // <button type="button" class="btn btn-primary btn-sm">Tests</button>
        <button
            className={`btn btn-danger ${props.className}`}
            onClick={props.onClick ? () => props.onClick() : null}
        >
            {props.children}
        </button>
    );
}

export const OutlineButton = props => {
    return (
        <Button
            className={`btn-outline ${props.className}`}
            onClick={props.onClick ? () => props.onClick() : null}
        >
            {props.children}
        </Button>
    );
}

Button.propTypes = {
    onClick: PropTypes.func
}

export default Button;
