import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AspectRatio, Center, Divider, Grid, Loader, Stack, Title } from '@mantine/core';

import VideoCard from '../components/Youtube/VideoCard';
import VideoInformation from '../components/Youtube/VideoInformation';
import VideoPlayer from '../components/Youtube/VideoPlayer';

import { useYoutubeVideoQuery } from '../api/youtube';

const YoutubeVideo = () => {
	const { id } = useParams();

	const videoStatus = useYoutubeVideoQuery({ videoId: id || '', relatedLength: 4 }, { skip: !id });

	const { video, relatedVideos } = useMemo(
		() => (videoStatus.data ? videoStatus.data : { video: null, relatedVideos: null }),
		[videoStatus.data]
	);

	return useMemo(
		() => (
			<Stack p="md">
				{videoStatus.isLoading ? (
					<Center>
						<Loader />
					</Center>
				) : video ? (
					<>
						<Helmet>
							<title>{video.title}</title>
						</Helmet>
						<AspectRatio ratio={16 / 9} sx={{ maxHeight: '75vh' }}>
							<VideoPlayer video={video} playing={true} />
						</AspectRatio>
						<VideoInformation video={video} />
						<Divider />
						<Title order={3}>Related Videos</Title>
						<Grid>
							{relatedVideos?.map((video) => (
								<Grid.Col key={video.id} xs={12} sm={6} md={4} lg={3} xl={2}>
									<VideoCard video={video} />
								</Grid.Col>
							))}
						</Grid>
					</>
				) : (
					<Center>Video could not be loaded</Center>
				)}
			</Stack>
		),
		[relatedVideos, video, videoStatus.isLoading]
	);
};

export default YoutubeVideo;
