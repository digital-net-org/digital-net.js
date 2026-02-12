import { css } from 'lit';

export const styles = css`
    :host {
        --_color-txt: var(--dn-palette-text);
        --_color-txt-disabled: var(--dn-palette-text-disabled);
        --_color-bg: var(--dn-palette-paper);
        --_color-bg-disabled: var(--dn-palette-background-disabled);
        --_color-border: var(--dn-palette-border);
        --_color-border-disabled: var(--dn-palette-border-disabled);
        --_radius: var(--dn-spacing-radius-1);
        --_padding: calc(var(--dn-spacing-1) * 0.5) calc(var(--dn-spacing-2) * 0.5);
    }

    .input-box {
        position: relative;
        min-width: 250px;

        display: flex;
        width: 100%;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;

        height: fit-content;
        border: 1px solid var(--_color-border);
        border-radius: var(--_radius);
        background-color: var(--_color-bg);
        padding: var(--_padding);
    }

    .input-box.disabled {
        background-color: var(--_color-bg-disabled);
        border-color: var(--_color-border-disabled);
    }

    .input-box.loading {
        outline: none;
    }

    .input-box .input-label {
        position: absolute;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        top: -1.1rem;
        left: 0;
        gap: 4px;
    }

    .input-box .input-label .label-text {
        color: var(--_color-txt);
        font-size: 0.7rem;
    }

    .input-box .input-label .label-counter {
        position: absolute;
        right: 0.1rem;
    }

    .input-box .input-label .label-hint {
        cursor: pointer;
        & svg {
            position: absolute;
            transform: scale(0.9);
            top: -0.1rem;
            right: 0;
            fill: var(--_color-txt);
        }
    }

    .input-box.input-box.disabled .input-label .label-hint {
        cursor: default;
        & svg {
            fill: var(--_color-txt-disabled);
        }
    }

    .input-box.input-box .input-label .label-hint.open {
        & svg {
            fill: var(--dn-palette-primary-light);
        }
    }

    .input-box.hint,
    .input-box.with-label {
        margin-top: calc(var(--dn-font-size-regular) * 1.25);
    }

    .input-hint {
        overflow: hidden;
        width: 100%;

        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.3s ease-out;
    }

    .input-hint.open {
        grid-template-rows: 1fr;
    }

    .input-hint.open .input-hint-content {
        grid-template-rows: 1fr;
    }

    .input-hint-content {
        font-size: 0.7rem;
        overflow: hidden;
    }

    .input-box .counter {
        position: absolute;
        right: 1.35rem;
        top: -0.2rem;
        transform: translateY(-100%);
        font-size: 0.7rem;
    }
`;
