import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Box, Card, Flex, Image, Overlay, Stack, Text } from '@mantine/core';
import { useHover, useOs } from '@mantine/hooks';

import { VideoQueueButton, VideoWatchButton } from './VideoButtons';

interface VideoCardProps {
	video: YoutubeVideo;
}

const VideoCard = (props: VideoCardProps) => {
	const { video } = props;

	const { hovered, ref } = useHover();
	const os = useOs();

	const showOverlay = useMemo(() => os === 'android' || os === 'ios' || hovered, [hovered, os]);

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
								variant="link"
								color="dimmed"
								component={Link}
								to={channelLink}
								sx={{
									':hover': {
										textDecoration: 'underline',
									},
								}}
							>
								<Flex>
									<Avatar size="sm" src={video.channelThumbnail} sx={{ borderRadius: 10 }} />
									<Text>{video.channelTitle}</Text>
								</Flex>
							</Text>
							<Text color="dimmed">{publishedAt}</Text>
						</Flex>
					</Stack>
				</Card>
			</Box>
		);
	}, [ref, showOverlay, video]);
};

export default VideoCard;
