import { useMemo, useCallback } from 'react';
import { generatePath, useHistory, useRouteMatch } from 'react-router-dom';
import { Center, Checkbox, Grid, Loader, LoadingOverlay, MultiSelect, Pagination, Stack } from '@mantine/core';

import { useYoutubeVideoCategoriesQuery, useYoutubeVideosQuery } from '../../api/youtube';
import YoutubeVideoCard from './VideoCard';

const VideosView = () => {
	const { path, url, params } = useRouteMatch<{ page?: string; channelId?: string }>();
	const history = useHistory();

	const { page, channelId, selectedCategories, likedOnly } = useMemo(() => {
		const searchParams = new URLSearchParams(history.location.search);
		const categories = searchParams.get('categories');
		const liked = searchParams.get('liked') || '0';
		return {
			page: params.page ? parseInt(params.page) : 1,
			channelId: params.channelId,
			selectedCategories: categories ? categories.split(',').map((n) => parseInt(n)) : [],
			likedOnly: parseInt(liked) === 1,
		};
	}, [history.location.search, params.channelId, params.page]);

	const videosStatus = useYoutubeVideosQuery({ perPage: 48, page, channelId, selectedCategories, likedOnly });
	const videoCategoriesStatus = useYoutubeVideoCategoriesQuery({ channelId });

	const categories = useMemo(
		() => (videoCategoriesStatus.data ? videoCategoriesStatus.data.categories : []),
		[videoCategoriesStatus.data]
	);
	const { videos, totalPages } = useMemo(
		() => (videosStatus.data ? videosStatus.data : { videos: [], totalPages: 1 }),
		[videosStatus.data]
	);

	const updateUrl = useCallback(
		(update: Partial<YoutubeVideosBody>) => {
			let pathname = url;
			const searchParams = new URLSearchParams(history.location.search);
			if (update.likedOnly !== undefined) {
				if (update.likedOnly) {
					searchParams.set('liked', '1');
				} else {
					searchParams.delete('liked');
				}
			}
			if (update.selectedCategories) {
				if (update.selectedCategories.length === 0) {
					searchParams.delete('categories');
				} else {
					searchParams.set('categories', update.selectedCategories.join(','));
				}
			}
			if (update.page) {
				pathname = generatePath(path, { ...params, page: update.page });
			}
			history.push({ ...history.location, pathname, search: searchParams.toString() });
		},
		[history, params, path, url]
	);

	return useMemo(
		() => (
			<Stack sx={{ position: 'relative' }}>
				{videoCategoriesStatus.isLoading || videosStatus.isLoading ? (
					<Center>
						<Loader />
					</Center>
				) : (
					<>
						<LoadingOverlay visible={videosStatus.isFetching} />
						<Checkbox
							label="Show Liked Only"
							checked={likedOnly}
							onChange={(e) => updateUrl({ likedOnly: e.target.checked })}
						/>
						<MultiSelect
							label="Categories"
							placeholder="Select Categories"
							data={categories.map((category) => ({
								value: category.id.toString(),
								label: category.name,
							}))}
							value={selectedCategories.map((n) => n.toString())}
							onChange={(newCategories) => updateUrl({ selectedCategories: newCategories.map((n) => parseInt(n)) })}
						/>
						<Grid>
							{videos.map((video) => (
								<Grid.Col key={video.id} xs={12} sm={6} md={3} xl={2}>
									<YoutubeVideoCard video={video} />
								</Grid.Col>
							))}
						</Grid>
						<Center>
							<Pagination total={totalPages} page={page} onChange={(newPage) => updateUrl({ page: newPage })} />
						</Center>
					</>
				)}
			</Stack>
		),
		[
			videoCategoriesStatus.isLoading,
			videosStatus.isLoading,
			videosStatus.isFetching,
			likedOnly,
			categories,
			selectedCategories,
			videos,
			totalPages,
			page,
			updateUrl,
		]
	);
};

export default VideosView;
