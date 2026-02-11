import { css } from 'lit';

export const hostStyles = css`
    :host {
        --_loader-color: var(--dn-loader-color, var(--dn-palette-text));
    }
`;

export const styles = css`
    * {
        box-sizing: border-box;
    }

    .loader {
        display: inline-block;
        position: relative;
        width: var(--size-block);
    }

    .loader div {
        position: absolute;
        width: var(--size-dot);
        height: var(--size-dot);
        border-radius: 50%;
        background: var(--_loader-color);
        animation-timing-function: cubic-bezier(0, 1, 1, 0);

        &:nth-of-type(1) {
            left: var(--left-1);
            animation: ellipsis1 0.6s infinite;
        }

        &:nth-of-type(2) {
            left: var(--left-1);
            animation: ellipsis2 0.6s infinite;
        }

        &:nth-of-type(3) {
            left: var(--left-2);
            animation: ellipsis2 0.6s infinite;
        }

        &:nth-of-type(4) {
            left: var(--left-3);
            animation: ellipsis3 0.6s infinite;
        }
    }

    @keyframes ellipsis1 {
        0% {
            transform: scale(0);
        }
        100% {
            transform: scale(1);
        }
    }

    @keyframes ellipsis2 {
        0% {
            transform: translate(0, 0);
        }
        100% {
            transform: translate(var(--translate), 0);
        }
    }

    @keyframes ellipsis3 {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(0);
        }
    }

    .loader-size-x-small {
        --size-block: 20px;
        --size-dot: 3px;
        --left-1: 2px;
        --left-2: 8px;
        --left-3: 14px;
        --translate: 6px;
    }

    .loader-size-small {
        --size-block: 40px;
        --size-dot: 6.66667px;
        --left-1: 4px;
        --left-2: 16px;
        --left-3: 28px;
        --translate: 12px;
    }

    .loader-size-medium {
        --size-block: 60px;
        --size-dot: 10px;
        --left-1: 6px;
        --left-2: 24px;
        --left-3: 42px;
        --translate: 18px;
    }

    .loader-size-large {
        --size-block: 80px;
        --size-dot: 13.33333px;
        --left-1: 8px;
        --left-2: 32px;
        --left-3: 56px;
        --translate: 24px;
    }

    .loader-size-x-large {
        --size-block: 160px;
        --size-dot: 25px;
        --left-1: 16px;
        --left-2: 64px;
        --left-3: 112px;
        --translate: 48px;
    }
`;
