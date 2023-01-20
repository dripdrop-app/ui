import { useMemo } from 'react';
import { Avatar, Center, Divider, Flex, Loader, Stack, Title } from '@mantine/core';

import { useYoutubeChannelQuery } from '../api/youtube';
import VideosView from '../components/Youtube/VideosView';

interface YoutubeChannelProps {
	id: string;
}

const YoutubeChannel = (props: YoutubeChannelProps) => {
	const { id } = props;

	const channelStatus = useYoutubeChannelQuery(id);

	const channel = useMemo(() => channelStatus.data, [channelStatus.data]);

	return useMemo(
		() => (
			<Stack sx={{ position: 'relative' }}>
				{!channel ? (
					<Center>
						<Loader />
					</Center>
				) : (
					<>
						<Flex align="center">
							<Avatar src={channel.thumbnail} />
							<Title order={2}>{channel?.title}</Title>
						</Flex>
						<Divider />
						<VideosView />
					</>
				)}
			</Stack>
		),
		[channel]
	);
};

export default YoutubeChannel;
