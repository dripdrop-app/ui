import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Divider, Stack, Title } from '@mantine/core';

import VideosView from '../../components/Youtube/VideosView';

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

export default YoutubeVideos;
