import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Avatar, Center, Divider, Flex, Loader, Stack, Title } from '@mantine/core';

import VideosView from '../components/Youtube/VideosView';

import { useYoutubeChannelQuery } from '../api/youtube';
import { SubscribeButton } from '../components/Youtube/ChannelButtons';

const YoutubeChannel = () => {
	const { id } = useParams();

	const channelStatus = useYoutubeChannelQuery(id || '', { skip: !id });

	const channel = useMemo(() => channelStatus.data, [channelStatus.data]);

	return useMemo(
		() => (
			<Stack sx={{ position: 'relative' }}>
				{channelStatus.isLoading ? (
					<Center>
						<Loader />
					</Center>
				) : channel ? (
					<>
						<Helmet>
							<title>{channel.title}</title>
						</Helmet>
						<Flex align="center">
							<Avatar src={channel.thumbnail} sx={{ borderRadius: 10 }} />
							<Title order={2}>{channel.title}</Title>
							<SubscribeButton
								channelTitle={channel.title}
								channelId={channel.id}
								subscriptionId={channel.subscriptionId}
							/>
						</Flex>
						<Divider />
						<VideosView channelId={channel.id} />
					</>
				) : (
					<Center>Channel could not be loaded</Center>
				)}
			</Stack>
		),
		[channel, channelStatus.isLoading]
	);
};

export default YoutubeChannel;
