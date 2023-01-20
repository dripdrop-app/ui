import { Stack } from '@mantine/core';
import withAuthPage from '../components/Auth/AuthPage';

import JobList from '../components/Music/JobList';
import MusicForm from '../components/Music/MusicForm';

const MusicDownloader = () => {
	return (
		<Stack spacing={10}>
			<MusicForm />
			<JobList />
		</Stack>
	);
};

export default withAuthPage(MusicDownloader);
