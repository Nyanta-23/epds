import { useEffect, useRef, useState } from 'react';

type ScrollDirection = 'up' | 'down';

/**
 * Returns 'up' when the user is scrolling toward the top of the page
 * and 'down' when scrolling away from it.
 *
 * The `threshold` (default 8 px) prevents tiny jitter from toggling state.
 */
export function useScrollDirection(threshold = 8): ScrollDirection {
    const [direction, setDirection] = useState<ScrollDirection>('up');
    const lastY = useRef<number>(
        typeof window !== 'undefined' ? window.scrollY : 0,
    );

    useEffect(() => {
        const onScroll = () => {
            const currentY = window.scrollY;
            const delta = currentY - lastY.current;

            if (Math.abs(delta) < threshold) return;

            setDirection(delta > 0 ? 'down' : 'up');
            lastY.current = currentY;
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [threshold]);

    return direction;
}
