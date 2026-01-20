import { css } from '../../../digital-component';

export const styles = css`
    :host {
        --_duration: var(--digital-ui-input-switch-duration, 0.4s);
        --_width: var(--digital-ui-input-switch-width, 33px);
        --_height: var(--digital-ui-input-switch-height, 16px);
        --_slider-size: var(--digital-ui-input-switch-slider-size, 12px);
        --_spacing: var(--digital-ui-input-switch-spacing, 2px);
        --_translate: var(--digital-ui-input-switch-translate, 17px);
        --_border: var(--digital-ui-input-switch-border, 1px solid);
    }

    .input-switch-container {
        height: var(--_height);
    }

    .input-switch-label {
        cursor: pointer;
        display: inline-block;
        position: relative;
        width: var(--_width);
        height: var(--_height);
    }

    .input-switch-input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .input-switch-input:checked + .input-switch-slider {
        background-color: var(--palette-primary);
    }

    .input-switch-input:checked + .input-switch-slider:before {
        -webkit-transform: translateX(var(--_translate));
        -ms-transform: translateX(var(--_translate));
        transform: translateX(var(--_translate));
    }

    .input-switch-slider {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        box-sizing: border-box;
        background-color: var(--palette-background-disabled);
        border-radius: 50px;
        -webkit-transition: var(--_duration);
        transition: var(--_duration);
        box-shadow: inset 0 0 12px var(--palette-shadow-light);
        -webkit-box-shadow: inset 0 0 calc(var(--font-size-regular) * 0.55) var(--palette-shadow-light);

        &:before {
            position: absolute;
            left: var(--_spacing);
            bottom: var(--_spacing);
            content: '';
            box-sizing: border-box;
            height: var(--_slider-size);
            width: var(--_slider-size);
            background-color: white;
            border-radius: 50%;
            -webkit-transition: var(--_duration);
            transition: var(--_duration);
        }
    }

    .input-switch-disabled .input-switch-input:checked + .input-switch-slider {
        background-color: var(--palette-background-disabled);
    }

    .input-switch-loading .input-switch-input:checked + .input-switch-slider {
        background-color: var(--palette-background-disabled);
    }
`;
