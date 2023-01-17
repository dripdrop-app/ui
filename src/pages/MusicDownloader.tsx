import { Stack } from '@mantine/core';
import JobList from '../components/Music/JobList';
import MusicForm from '../components/Music/MusicForm';

const MusicDownloader = () => {
	return (
		<Stack spacing={2}>
			<MusicForm />
			{/* <JobList /> */}
		</Stack>
	);
};

export default MusicDownloader;
