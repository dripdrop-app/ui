import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Divider, Stack, Title } from '@mantine/core';

import withAuthPage from '../components/Auth/AuthPage';
import withYoutubeAuthPage from '../components/Auth/YoutubeAuthPage';

import VideosView from '../components/Youtube/VideosView';

const YoutubeVideos = () => {
	return useMemo(
		() => (
			<Stack>
				<Helmet>
					<title>Videos</title>
				</Helmet>
				<Title order={2}>Videos</Title>
				<Divider />
				<VideosView />
			</Stack>
		),
		[]
	);
};

export default withAuthPage(withYoutubeAuthPage(YoutubeVideos));
