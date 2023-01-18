import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, Flex, Image, Overlay, Stack, Text } from '@mantine/core';
import { useHover, useMediaQuery } from '@mantine/hooks';

import { VideoQueueButton, VideoWatchButton } from './VideoButtons';

interface VideoCardProps {
	video: YoutubeVideo;
}

const VideoCard = (props: VideoCardProps) => {
	const { video } = props;

	const { hovered, ref } = useHover();

	const isSmall = useMediaQuery('(max-width: 768px)');

	const showOverlay = useMemo(() => isSmall || hovered, [hovered, isSmall]);

	return useMemo(() => {
		const publishedAt = new Date(video.publishedAt).toLocaleDateString();
		const channelLink = `/youtube/channel/${video.channelId}`;
		const videoLink = `/youtube/video/${video.id}`;

		return (
			<Box>
				<Card>
					<Card.Section ref={ref} sx={{ position: 'relative' }}>
						<Image src={video.thumbnail} withPlaceholder />
						<Overlay sx={{ ...(!showOverlay && { display: 'none' }) }} opacity={0.5} color="black" zIndex={1} />
						<Box
							sx={{ ...(!showOverlay && { display: 'none' }), position: 'absolute', right: '5%', top: '5%', zIndex: 2 }}
						>
							<VideoQueueButton video={video} />
						</Box>
						<Box
							sx={{ ...(!showOverlay && { display: 'none' }), position: 'absolute', left: '5%', top: '5%', zIndex: 2 }}
						>
							<VideoWatchButton video={video} />
						</Box>
					</Card.Section>
					<Stack py={10}>
						<Text
							component={Link}
							to={videoLink}
							sx={{
								':hover': {
									textDecoration: 'underline',
								},
							}}
						>
							{video.title}
						</Text>
						<Flex justify="space-between">
							<Text
								component={Link}
								to={channelLink}
								sx={{
									':hover': {
										textDecoration: 'underline',
									},
								}}
							>
								{video.channelTitle}
							</Text>
							<Text>{publishedAt}</Text>
						</Flex>
					</Stack>
				</Card>
			</Box>
		);
	}, [ref, showOverlay, video]);
};

export default VideoCard;
