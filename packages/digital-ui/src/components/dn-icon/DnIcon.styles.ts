import { css } from 'lit';

export const hostStyles = css`
    :host {
        --_icon-color: var(--dn-icon-color, currentColor);
        --_icon-color-hover: var(--dn-icon-color-hover, var(--dn-icon-color, currentColor));
        --_icon-cursor: var(--dn-icon-cursor, default);
        --_icon-size: 2rem;
        --_icon-transition: 0.3s;
    }
`;

export const styles = css`
    .icon {
        --_resolved-size: var(--_icon-size);
    }

    .icon-size-x-small {
        --_resolved-size: calc((var(--_icon-size) * 0.5));
    }

    .icon-size-small {
        --_resolved-size: calc((var(--_icon-size) * 0.75));
    }

    .icon-size-medium {
        --_resolved-size: calc((var(--_icon-size) * 1));
    }

    .icon-size-large {
        --_resolved-size: calc((var(--_icon-size) * 1.5));
    }

    .icon-size-x-large {
        --_resolved-size: calc((var(--_icon-size) * 3));
    }

    .icon-fullWidth {
        --_resolved-size: 100%;
    }

    .icon-direction-up {
        --_icon-transform: rotate(360deg);
    }

    .icon-direction-down {
        --_icon-transform: rotate(180deg);
    }

    .icon-direction-left {
        --_icon-transform: rotate(270deg);
    }

    .icon-direction-right {
        --_icon-transform: rotate(90deg);
    }

    .icon {
        cursor: var(--_icon-cursor);
        line-height: 0;
        color: var(--_icon-color);
        fill: var(--_icon-color);
        width: var(--_resolved-size);
        height: var(--_resolved-size);
        transform: var(--_icon-transform);
        -webkit-transition: var(--_icon-transition);
        transition: var(--_icon-transition);
    }

    .icon:hover {
        color: var(--_icon-color-hover);
        fill: var(--_icon-color-hover);
    }
`;
