import { useMemo, useRef, useEffect, useCallback, useState } from 'react';
import { Box, Checkbox, CircularProgress, FormControlLabel, Grid, Stack } from '@mui/material';
import { useYoutubeVideosQuery } from '../../api/youtube';
import { useObject } from '../../utils/useObject';
import InfiniteScroll from '../InfiniteScroll';
import YoutubeVideosPage from './VideosPage';
import YoutubeVideoCard from './VideoCard';
import CategorySelect from './CategorySelect';

interface VideosViewProps {
	channelId?: string;
}

const VideosView = (props: VideosViewProps) => {
	const [rootHeight, setRootHeight] = useState<number | undefined>(undefined);
	const rootRef = useRef<HTMLDivElement | null>(null);
	const [endReached, setEndReached] = useState(false);

	const { object: filter, setObject: setFilter } = useObject<YoutubeVideosBody>({
		selectedCategories: [],
		page: 1,
		perPage: 48,
		likedOnly: false,
		channelId: props.channelId,
	});

	const videosStatus = useYoutubeVideosQuery(filter);

	const onEndReached = useCallback(() => {
		if (!endReached && !videosStatus.isLoading && !videosStatus.isFetching) {
			setFilter({ page: filter.page + 1 });
		}
	}, [endReached, filter.page, setFilter, videosStatus.isFetching, videosStatus.isLoading]);

	useEffect(() => {
		if (videosStatus.isSuccess && videosStatus.currentData) {
			const { totalPages } = videosStatus.currentData;
			if (totalPages <= filter.page) {
				setEndReached(true);
			}
		}
	}, [filter.page, videosStatus.currentData, videosStatus.isSuccess]);

	useEffect(() => {
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const element = entry.target;
				const rect = element.getBoundingClientRect();
				setRootHeight(window.innerHeight - rect.top - window.innerHeight * 0.05);
			}
		});
		if (rootRef.current) {
			const root = rootRef.current;
			observer.observe(root);
			return () => observer.unobserve(root);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [window.innerHeight]);

	return useMemo(
		() => (
			<Box>
				<Stack direction="row" justifyContent="space-between" paddingX={2} paddingBottom={1} flexWrap="wrap">
					<FormControlLabel
						control={
							<Checkbox
								checked={filter.likedOnly}
								onChange={(e, checked) => setFilter({ likedOnly: checked, page: 1 })}
							/>
						}
						label="Show Liked Only"
					/>
					<CategorySelect
						currentCategories={filter.selectedCategories}
						onChange={(newCategories) => setFilter({ selectedCategories: newCategories, page: 1 })}
					/>
				</Stack>
				<Box ref={rootRef}>
					<InfiniteScroll
						items={Array(filter.page).fill(1)}
						height={rootHeight}
						renderItem={(page, index) => (
							<Grid container>
								<YoutubeVideosPage
									selectedCategories={filter.selectedCategories}
									perPage={filter.perPage}
									page={index + 1}
									likedOnly={filter.likedOnly}
									queuedOnly={filter.queuedOnly}
									channelId={filter.channelId}
									renderItem={(video) => (
										<Grid item xs={12} sm={6} md={3} xl={2} padding={1}>
											<YoutubeVideoCard video={video} />
										</Grid>
									)}
									renderLoading={() => (
										<Grid item xs={12} padding={2}>
											<Stack direction="row" justifyContent="center">
												<CircularProgress />
											</Stack>
										</Grid>
									)}
								/>
							</Grid>
						)}
						onEndReached={onEndReached}
					/>
				</Box>
			</Box>
		),
		[
			filter.likedOnly,
			filter.selectedCategories,
			filter.page,
			filter.perPage,
			filter.queuedOnly,
			filter.channelId,
			rootHeight,
			onEndReached,
			setFilter,
		]
	);
};

export default VideosView;
