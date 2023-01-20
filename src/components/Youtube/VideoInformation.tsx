import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Flex, Stack, Text, Title } from '@mantine/core';

import { VideoWatchButton, VideoLikeButton, VideoQueueButton } from './VideoButtons';

interface VideoInformationProps {
	video: YoutubeVideo;
}

const VideoInformation = (props: VideoInformationProps) => {
	const { video } = props;

	const publishedAt = new Date(video.publishedAt).toLocaleDateString();
	const channelLink = `/youtube/channel/${video.channelId}`;

	return useMemo(
		() => (
			<Stack>
				<Flex justify="space-between">
					<Title order={3}>{video.title}</Title>
					<Flex>
						<VideoWatchButton video={video} />
						<VideoLikeButton video={video} />
						<VideoQueueButton video={video} />
					</Flex>
				</Flex>
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
		),
		[channelLink, publishedAt, video]
	);
};

export default VideoInformation;
