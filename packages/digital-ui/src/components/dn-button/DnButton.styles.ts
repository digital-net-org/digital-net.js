import { css } from 'lit';

export const hostStyles = css`
    :host {
        --_spacing-1: var(--dn-spacing-1, 0.5rem);
        --_spacing-2: var(--dn-spacing-2, 1rem);
        --_border-radius: var(--dn-spacing-radius-1, 0.25rem);
        --_color: var(--dn-palette-primary);
        --_color-light: var(--dn-palette-primary-light);
        --_color_bg_disabled: var(--dn-palette-background-disabled);
        --_color_txt_disabled: var(--dn-palette-text-disabled);
        --_color-content: var(--dn-palette-text);
    }
`;

export const styles = css`
    * {
        box-sizing: border-box;
    }

    .button {
        position: relative;
        border: none;
        user-select: none;
        height: fit-content;
        width: fit-content;
        min-width: 0;
        min-height: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        box-sizing: border-box;
        cursor: pointer;
        white-space: nowrap;

        outline: none;
        -webkit-appearance: none;
        appearance: none;

        padding: calc(var(--_spacing-1) * 0.75) var(--_spacing-2);
        border: 1px solid;
        border-radius: var(--_border-radius);
        color: var(--_color-content);
        transition: all 0.3s ease;

        font-family: inherit;
        font-size: inherit;
        font-weight: var(--dn-font-weight-medium);
        letter-spacing: inherit;
    }

    .button-content {
        display: flex;
        width: 100%;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: var(--_spacing-1);
    }

    .button.icon {
        padding: 0.25rem 0.25rem 0.05rem;
    }

    .button.disabled {
        pointer-events: none;
        cursor: default;
    }

    .button.loading {
        pointer-events: none;
        cursor: default;
    }

    .button.loading .button-loader {
        --dn-loader-color: var(--_color-content);
        position: absolute;
    }

    .button.loading.disabled .button-loader {
        --dn-loader-color: var(--_color_txt_disabled);
    }

    .button.loading .button-content {
        opacity: 0;
    }

    .button.critical {
        --_color: var(--dn-palette-error);
        --_color-light: var(--dn-palette-error-light);
    }

    .button-default {
        --_color-content: var(--dn-palette-text-white);
        background-color: var(--_color);
        border-color: var(--_color);

        &:hover {
            background-color: var(--_color-light);
            border-color: var(--_color-light);
        }
    }

    .button-default.active {
        background-color: var(--_color-light);
        border-color: var(--_color-light);
    }

    .button-default.disabled {
        background-color: var(--_color_bg_disabled);
        border-color: var(--_color_bg_disabled);
        color: var(--_color_txt_disabled);
    }

    .button-outlined {
        background-color: transparent;
        border-color: var(--_color-content);

        &:hover {
            border-color: var(--_color-light);
            color: var(--_color-light);
        }
    }

    .button-outlined.active {
        border-color: var(--_color-light);
        color: var(--_color-light);
    }

    .button-outlined.disabled {
        border-color: var(--_color_bg_disabled);
        color: var(--_color_bg_disabled);
    }

    .button-outlined.loading.disabled .button-loader {
        --dn-loader-color: var(--_color_bg_disabled);
    }

    .button-outlined.critical {
        border-color: var(--dn-palette-error);
        &:hover {
            border-color: var(--dn-palette-error-light);
        }
    }

    .button-outlined.critical.active {
        border-color: var(--dn-palette-error-light);
    }

    .button-text {
        border-color: transparent;
        background-color: transparent;
        padding: 0 0.25rem;

        &:hover {
            color: var(--_color-light);
        }
    }

    .button-text.active {
        color: var(--_color-light);
        text-decoration: underline;
    }

    .button-text.disabled {
        color: var(--_color_bg_disabled);
    }

    .button-text.loading.disabled .button-loader {
        --dn-loader-color: var(--_color_bg_disabled);
    }

    .button-text.critical {
        color: var(--dn-palette-error);
        &:hover {
            color: var(--dn-palette-error-light);
        }
    }
`;
