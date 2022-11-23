import { useEffect, useRef, useState } from 'react';

const useFillHeight = (space?: number) => {
	const ref = useRef<HTMLElement | null>(null);
	const [elementHeight, setElementHeight] = useState<number | undefined>(undefined);

	useEffect(() => {
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const element = entry.target;
				const rect = element.getBoundingClientRect();
				setElementHeight(window.innerHeight - rect.top - (space || 0));
			}
		});
		if (ref.current) {
			const element = ref.current;
			observer.observe(element);
			return () => observer.unobserve(element);
		}
	});

	return { ref, elementHeight };
};

export default useFillHeight;
