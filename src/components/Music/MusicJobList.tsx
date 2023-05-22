import { useState, useMemo } from 'react';
import { Center, Divider, Grid, Loader, Pagination, Stack, Title } from '@mantine/core';

import MusicJobCard from './MusicJobCard';

import { useMusicJobsQuery, useListenMusicJobsQuery } from '../../api/music';

const MusicJobList = () => {
	const [args, setArgs] = useState<PageBody>({
		page: 1,
		perPage: 5,
	});

	const musicJobsStatus = useMusicJobsQuery(args);
	useListenMusicJobsQuery();

	const { musicJobs, totalPages } = useMemo(() => {
		if (musicJobsStatus.isSuccess && musicJobsStatus.currentData) {
			return musicJobsStatus.currentData;
		} else if (musicJobsStatus.data) {
			return musicJobsStatus.data;
		}
		return { musicJobs: [], totalPages: 1 };
	}, [musicJobsStatus.currentData, musicJobsStatus.data, musicJobsStatus.isSuccess]);

	return useMemo(
		() => (
			<Stack>
				<Title order={3}>Jobs</Title>
				<Divider />
				{musicJobsStatus.isLoading ? (
					<Center>
						<Loader />
					</Center>
				) : musicJobs.length === 0 ? (
					<Center>No Music Jobs</Center>
				) : (
					<Stack>
						<Grid>
							{musicJobs.map((musicJob) => (
								<Grid.Col key={musicJob.id} xs={12} sm={6} md={4} lg={3} xl={2}>
									<MusicJobCard {...musicJob} />
								</Grid.Col>
							))}
						</Grid>
						<Center>
							<Pagination
								page={args.page}
								total={totalPages}
								onChange={(newPage) => setArgs((prevState) => ({ ...prevState, page: newPage }))}
							/>
						</Center>
					</Stack>
				)}
			</Stack>
		),
		[args.page, totalPages, musicJobsStatus.isLoading, musicJobs]
	);
};

export default MusicJobList;
