import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Avatar, Box, Center, Divider, Flex, Loader, Stack, Title } from '@mantine/core';

import { useYoutubeChannelQuery, useListenYoutubeChannelsQuery } from '../api/youtube';

import VideosView from '../components/Youtube/VideosView';
import { SubscribeButton } from '../components/Youtube/ChannelButtons';

const YoutubeChannel = () => {
	const { id } = useParams();

	const channelStatus = useYoutubeChannelQuery(id || '', { skip: !id });

	const channel = useMemo(() => channelStatus.data, [channelStatus.data]);

	useListenYoutubeChannelsQuery();

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
							<SubscribeButton channelTitle={channel.title} channelId={channel.id} subscribed={channel.subscribed} />
						</Flex>
						<Divider />
						<Box sx={{ display: channel.updating ? 'initial' : 'none' }}>
							<Center>
								<Flex align="center">
									<Loader />
									Retrieving latest videos...
								</Flex>
							</Center>
						</Box>
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
