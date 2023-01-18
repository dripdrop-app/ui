import { useMemo } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Avatar, Center, Divider, Flex, Loader, Stack, Title } from '@mantine/core';

import { useYoutubeChannelQuery } from '../api/youtube';
import VideosView from '../components/Youtube/VideosView';

const YoutubeChannel = () => {
	const { params } = useRouteMatch<{ channelId?: string }>();

	const channelStatus = useYoutubeChannelQuery(params.channelId || '');

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
