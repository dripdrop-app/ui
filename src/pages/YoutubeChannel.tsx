import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Avatar, Center, Divider, Flex, Loader, Stack, Title } from '@mantine/core';

import { useYoutubeChannelQuery } from '../api/youtube';
import VideosView from '../components/Youtube/VideosView';
import withYoutubeAuthPage from '../components/Auth/YoutubeAuthPage';
import withAuthPage from '../components/Auth/AuthPage';

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
				{channelStatus.isFetching ? (
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
						</Flex>
						<Divider />
						<VideosView channelId={channel.id} />
					</>
				) : (
					<Center>Channel could not be loaded</Center>
				)}
			</Stack>
		),
		[channel, channelStatus.isFetching]
	);
};

export default withAuthPage(withYoutubeAuthPage(YoutubeChannel));
