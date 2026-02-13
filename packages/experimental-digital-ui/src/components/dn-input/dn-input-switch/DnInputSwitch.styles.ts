import { css } from 'lit';

export const styles = css`
    :host {
        --_color: var(--dn-palette-primary);
        --_color-disabled: var(--dn-palette-background-disabled);
        --_shadow: var(--dn-palette-shadow-light);
        --_duration: 0.4s;
        --_width: 33px;
        --_height: 16px;
        --_slider-size: 12px;
        --_spacing: 2px;
        --_translate: 17px;
        --_border: 1px solid;
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
        background-color: var(--_color);
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
        background-color: var(--_color-disabled);
        border-radius: 50px;
        -webkit-transition: var(--_duration);
        transition: var(--_duration);
        box-shadow: inset 0 0 12px var(--_shadow);
        -webkit-box-shadow: inset 0 0 calc(var(--dn-font-size-regular) * 0.55) var(--_shadow);

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

    .disabled.input-switch-input:checked + .input-switch-slider {
        background-color: var(--_color-disabled);
    }

    .disabled.input-switch-slider::before {
        background-color: var(--dn-palette-text-disabled);
    }
`;
