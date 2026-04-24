import * as React from 'react';
import type { StackProps } from '@mui/material';
import { Stack } from '@mui/material';

export interface DnLazyMountProps extends StackProps {
    children: React.ReactNode;
    placeholder?: React.ReactNode;
    rootMargin?: string;
    minDelay?: number;
}

export function DnLazyMount({
    children,
    placeholder,
    rootMargin = '300px',
    minDelay = 0,
    ...stackProps
}: DnLazyMountProps) {
    const ref = React.useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        if (mounted) return;
        const node = ref.current;
        if (!node) return;
        let timer: ReturnType<typeof setTimeout> | null = null;
        const observer = new IntersectionObserver(
            entries => {
                if (!entries.some(e => e.isIntersecting)) return;
                observer.disconnect();
                if (minDelay > 0) {
                    timer = setTimeout(() => setMounted(true), minDelay);
                } else {
                    setMounted(true);
                }
            },
            { rootMargin }
        );
        observer.observe(node);
        return () => {
            observer.disconnect();
            if (timer) clearTimeout(timer);
        };
    }, [mounted, rootMargin, minDelay]);

    return (
        <Stack ref={ref} {...stackProps}>
            {mounted ? children : placeholder}
        </Stack>
    );
}
