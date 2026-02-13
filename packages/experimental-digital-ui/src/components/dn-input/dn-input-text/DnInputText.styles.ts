import { css } from 'lit';

export const styles = css`
    input,
    textarea,
    label {
        color: var(--_color-txt);
        font-family: inherit;
        font-size: inherit;
        font-weight: var(--dn-font-weight-light);
        letter-spacing: inherit;
    }

    input {
        background-color: transparent;
    }

    input,
    textarea {
        width: 100%;
        height: 100%;
        border: none;

        &:focus {
            outline: none;
        }
    }

    button {
        border: none;
        background-color: transparent;
        cursor: pointer;
        display: contents;
        padding: 0;
        margin: 0;
    }

    .input-box.textarea {
        min-width: 350px;
        min-height: 42px;
        resize: vertical;
    }

    .input-box.disabled input,
    .input-box.disabled textarea {
        color: var(--_color-txt-disabled);
    }

    .input-box.disabled button {
        cursor: default;
    }

    .input-box.disabled svg {
        fill: var(--palette-text-disabled);
    }

    .input-box.loading input {
        color: var(--_color-txt-disabled);
        caret-color: transparent;
        cursor: default;
    }
`;
