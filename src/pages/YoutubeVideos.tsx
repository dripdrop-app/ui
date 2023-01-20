import { Divider, Stack, Title } from '@mantine/core';
import { useMemo } from 'react';
import withAuthPage from '../components/Auth/AuthPage';
import withYoutubeAuthPage from '../components/Auth/YoutubeAuthPage';

import VideosView from '../components/Youtube/VideosView';

const YoutubeVideos = () => {
	return useMemo(
		() => (
			<Stack>
				<Title order={2}>Videos</Title>
				<Divider />
				<VideosView />
			</Stack>
		),
		[]
	);
};

export default withAuthPage(withYoutubeAuthPage(YoutubeVideos));
