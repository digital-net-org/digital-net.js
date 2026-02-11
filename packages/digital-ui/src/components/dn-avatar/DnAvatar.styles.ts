import { css } from 'lit';

export const hostStyles = css`
    :host {
        --_avatar-color: var(--digital-ui-icon-color, currentColor);
        --_avatar-size: var(--digital-ui-icon-size, 2rem);
        --_avatar-cursor: var(--digital-ui-icon-cursor, default);
    }
`;

export const styles = css`
    .avatar {
        --_resolved-size: var(--_avatar-size);
    }

    .avatar-size-x-small {
        --_resolved-size: calc((var(--_avatar-size) * 0.5));
    }

    .avatar-size-small {
        --_resolved-size: calc((var(--_avatar-size) * 0.75));
    }

    .avatar-size-medium {
        --_resolved-size: calc((var(--_avatar-size) * 1));
    }

    .avatar-size-large {
        --_resolved-size: calc((var(--_avatar-size) * 1.5));
    }

    .avatar-size-x-large {
        --_resolved-size: calc((var(--_avatar-size) * 3));
    }

    .avatar-fullWidth {
        --_resolved-size: 100%;
    }

    .avatar-container {
        position: relative;
        border-radius: 100%;
        height: var(--_resolved-size);
        aspect-ratio: 1/1;
        overflow: hidden;
    }

    .avatar-container:hover {
        cursor: var(--_avatar-cursor);
    }

    img {
        position: absolute;
        display: block;
        width: var(--_resolved-size);
        height: var(--_resolved-size);
        object-fit: cover;
        left: 0;
        top: 50%;
        bottom: 50%;
        transform: translateY(-50%);
    }
`;
