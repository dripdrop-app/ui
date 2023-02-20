import { useMemo } from 'react';
import { Center, Checkbox, Grid, Loader, MultiSelect, Pagination, Stack } from '@mantine/core';

import { useYoutubeVideoCategoriesQuery, useYoutubeVideosQuery } from '../../api/youtube';
import YoutubeVideoCard from './VideoCard';
import useSearchParams from '../../utils/useSearchParams';

interface VideosViewProps {
	channelId?: string;
}

const VideosView = (props: VideosViewProps) => {
	const { channelId } = props;

	const { params, setSearchParams } = useSearchParams({
		perPage: 48,
		page: 1,
		selectedCategories: [] as string[],
		likedOnly: false as boolean,
	});

	const videosStatus = useYoutubeVideosQuery({
		...params,
		selectedCategories: params.selectedCategories.map((id) => parseInt(id)),
		channelId,
	});
	const videoCategoriesStatus = useYoutubeVideoCategoriesQuery({ channelId });

	const categories = useMemo(
		() => (videoCategoriesStatus.data ? videoCategoriesStatus.data.categories : []),
		[videoCategoriesStatus.data]
	);
	const { videos, totalPages } = useMemo(
		() => (videosStatus.data ? videosStatus.data : { videos: [], totalPages: 1 }),
		[videosStatus.data]
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
						<Checkbox
							label="Show Liked Only"
							checked={params.likedOnly}
							onChange={(e) => setSearchParams({ likedOnly: e.target.checked })}
						/>
						<MultiSelect
							label="Categories"
							placeholder="Select Categories"
							data={categories.map((category) => ({
								value: category.id.toString(),
								label: category.name,
							}))}
							value={params.selectedCategories}
							onChange={(newCategories) => setSearchParams({ selectedCategories: newCategories })}
						/>
						<Grid>
							{videos.map((video) => (
								<Grid.Col key={video.id} xs={12} sm={6} md={4} xl={3}>
									<YoutubeVideoCard video={video} />
								</Grid.Col>
							))}
						</Grid>
						<Center>
							<Pagination
								total={totalPages}
								page={params.page}
								onChange={(newPage) => setSearchParams({ page: newPage })}
							/>
						</Center>
					</>
				)}
			</Stack>
		),
		[
			videoCategoriesStatus.isLoading,
			videosStatus.isLoading,
			params.likedOnly,
			params.selectedCategories,
			params.page,
			categories,
			videos,
			totalPages,
			setSearchParams,
		]
	);
};

export default VideosView;
