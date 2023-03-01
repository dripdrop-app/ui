import { useState, useMemo } from 'react';
import { Center, Divider, Flex, Grid, Loader, Pagination, Stack, Title } from '@mantine/core';

import { useJobsQuery, useListenJobsQuery } from '../../api/music';
import JobCard from './JobCard';

const JobList = () => {
	const [args, setArgs] = useState<PageBody>({
		page: 1,
		perPage: 5,
	});

	const jobsStatus = useJobsQuery(args);
	useListenJobsQuery();

	const { jobs, totalPages } = useMemo(() => {
		if (jobsStatus.isSuccess && jobsStatus.currentData) {
			return jobsStatus.currentData;
		} else if (jobsStatus.data) {
			return jobsStatus.data;
		}
		return { jobs: [], totalPages: 1 };
	}, [jobsStatus.currentData, jobsStatus.data, jobsStatus.isSuccess]);

	return useMemo(
		() => (
			<Stack>
				<Title order={3}>Jobs</Title>
				<Divider />
				{jobsStatus.isLoading ? (
					<Center>
						<Loader />
					</Center>
				) : jobs.length === 0 ? (
					<Center>No Jobs</Center>
				) : (
					<Stack>
						<Grid>
							{jobs.map((job) => (
								<Grid.Col key={job.id} xs={12} sm={6} md={4} lg={3} xl={2}>
									<JobCard {...job} />
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
		[args.page, totalPages, jobsStatus.isLoading, jobs]
	);
};

export default JobList;
