import { Divider, Stack, Title } from '@mantine/core';
import { useMemo } from 'react';

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

export default YoutubeVideos;
