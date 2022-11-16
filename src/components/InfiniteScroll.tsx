import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { Box, Fab } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';

interface InfiniteScrollProps<T> {
	items: T[];
	height?: number;
	threshold?: number;
	renderItem: (item: T, index: number) => JSX.Element | JSX.Element[];
	onEndReached: () => void;
}

const InfiniteScroll = <T,>(props: InfiniteScrollProps<T>) => {
	const { items, renderItem, onEndReached, height } = props;

	const [showScrollButton, setShowScrollButton] = useState(false);
	const rootRef = useRef<HTMLDivElement | null>(null);
	const endOfScrollRef = useRef<HTMLDivElement | null>(null);

	const updateScrollButton = useCallback(() => {
		if (rootRef.current) {
			const root = rootRef.current;
			if (root.scrollTop > 0 && !showScrollButton) {
				setShowScrollButton(true);
			} else if (root.scrollTop === 0 && showScrollButton) {
				setShowScrollButton(false);
			}
		}
	}, [showScrollButton]);

	const RenderItems = useMemo(
		() =>
			items
				.map((item, index) => <div key={`scroll-item-${index}`}>{renderItem(item, index)}</div>)
				.concat(<Box key="end" ref={endOfScrollRef} height={height ? height * 0.05 : 1} bottom="0" />),
		[height, items, renderItem]
	);

	useEffect(() => {
		if (rootRef.current) {
			const root = rootRef.current;
			root.addEventListener('scroll', updateScrollButton);
			return () => {
				root.removeEventListener('scroll', updateScrollButton);
			};
		}
	}, [updateScrollButton]);

	useEffect(() => {
		if (endOfScrollRef.current) {
			const endOfScroll = endOfScrollRef.current;
			const observer = new IntersectionObserver((entries) => {
				for (const entry of entries) {
					if (entry.intersectionRatio > 0) {
						onEndReached();
					}
				}
			});
			observer.observe(endOfScroll);
			return () => observer.unobserve(endOfScroll);
		}
	}, [onEndReached]);

	return useMemo(
		() => (
			<Box ref={rootRef} height={height} overflow="scroll">
				<Fab
					sx={{
						position: 'fixed',
						bottom: '5vh',
						right: '5vw',
						display: showScrollButton ? 'block' : 'none',
						zIndex: (theme) => theme.zIndex.fab,
					}}
					color="primary"
					onClick={() => {
						if (rootRef.current) {
							const root = rootRef.current;
							root.scrollTo({ top: 0, behavior: 'smooth' });
						}
					}}
				>
					<ArrowUpward />
				</Fab>
				<Box>{RenderItems}</Box>
			</Box>
		),
		[RenderItems, height, showScrollButton]
	);
};

export default InfiniteScroll;
