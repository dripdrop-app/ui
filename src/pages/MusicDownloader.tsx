import { Helmet } from 'react-helmet-async';
import { Stack } from '@mantine/core';

import JobList from '../components/Music/JobList';
import MusicForm from '../components/Music/MusicForm';

const MusicDownloader = () => {
	return (
		<Stack spacing={10}>
			<Helmet>
				<title>Music Downloader</title>
			</Helmet>
			<MusicForm />
			<JobList />
		</Stack>
	);
};

export default MusicDownloader;
