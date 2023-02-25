import { useMemo } from 'react';
import { AspectRatio, Divider, Grid, Stack, Title } from '@mantine/core';

import { useYoutubeVideoQuery } from '../api/youtube';
import VideoCard from '../components/Youtube/VideoCard';
import VideoInformation from '../components/Youtube/VideoInformation';
import VideoPlayer from '../components/Youtube/VideoPlayer';
import withYoutubeAuthPage from '../components/Auth/YoutubeAuthPage';
import withAuthPage from '../components/Auth/AuthPage';

interface YoutubeVideoProps {
	id: string;
}

const YoutubeVideo = (props: YoutubeVideoProps) => {
	const videoStatus = useYoutubeVideoQuery({ videoId: props.id, relatedLength: 4 });

	const video = useMemo(() => videoStatus.data?.video, [videoStatus.data?.video]);
	const relatedVideos = useMemo(() => videoStatus.data?.relatedVideos, [videoStatus.data?.relatedVideos]);

	return useMemo(
		() => (
			<Stack p="md">
				<AspectRatio ratio={16 / 9} sx={{ maxHeight: '75vh' }}>
					<VideoPlayer video={video} playing={true} />
				</AspectRatio>
				{video && <VideoInformation video={video} />}
				<Divider />
				<Title order={3}>Related Videos</Title>
				<Grid>
					{relatedVideos?.map((video) => (
						<Grid.Col key={video.id} xs={12} sm={6} md={4} lg={3} xl={2}>
							<VideoCard video={video} />
						</Grid.Col>
					))}
				</Grid>
			</Stack>
		),
		[relatedVideos, video]
	);
};

export default withAuthPage(withYoutubeAuthPage(YoutubeVideo));
