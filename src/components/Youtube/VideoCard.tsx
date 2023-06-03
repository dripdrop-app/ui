import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Box, Card, Flex, Image, Overlay, Stack, Text, Tooltip } from '@mantine/core';

import { VideoQueueButton, VideoWatchButton } from './VideoButtons';
import VideoCategoryIcon from './VideoCategoryIcon';

interface VideoCardProps {
	video: YoutubeVideo;
}

const VideoCard = (props: VideoCardProps) => {
	const { video } = props;

	const hideOverlay = !video.queued && !video.watched;

	return useMemo(() => {
		const publishedAt = new Date(video.publishedAt).toLocaleDateString();
		const channelLink = `/youtube/channel/${video.channelId}`;
		const videoLink = `/youtube/video/${video.id}`;

		return (
			<Box>
				<Card>
					<Card.Section sx={{ position: 'relative' }}>
						<Image src={video.thumbnail} withPlaceholder />
						<Overlay
							sx={{ ...(hideOverlay && { display: 'none' }) }}
							opacity={0.5}
							color="black"
							zIndex={1}
							component={Link}
							to={videoLink}
						/>
						<Box sx={{ position: 'absolute', right: '5%', top: '5%', zIndex: 2 }}>
							<VideoQueueButton video={video} />
						</Box>
						<Box sx={{ position: 'absolute', left: '5%', top: '5%', zIndex: 2 }}>
							<VideoWatchButton video={video} />
						</Box>
						<Tooltip label={video.categoryName}>
							<Box
								sx={(theme) => ({
									position: 'absolute',
									right: '5%',
									bottom: '5%',
									zIndex: 2,
									backgroundColor: theme.colors.dark[7],
									borderRadius: theme.spacing.xs,
								})}
								px={6}
								py={2}
							>
								<VideoCategoryIcon categoryId={video.categoryId} color="white" />
							</Box>
						</Tooltip>
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
						<Flex justify="space-between" wrap="wrap">
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
							<Text sx={{ flex: 1, textAlign: 'right' }} color="dimmed">
								{publishedAt}
							</Text>
						</Flex>
					</Stack>
				</Card>
			</Box>
		);
	}, [hideOverlay, video]);
};

export default VideoCard;
