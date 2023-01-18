import { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Center, Divider, Grid, Loader, LoadingOverlay, Pagination, Stack, Title } from '@mantine/core';

import { useYoutubeSubscriptionsQuery } from '../api/youtube';
import SubscriptionCard from '../components/Youtube/SubscriptionCard';

interface YoutubeSubscriptionsProps {
	page: number;
}

const YoutubeSubscriptions = (props: YoutubeSubscriptionsProps) => {
	const { page } = props;

	const [perPage] = useState(48);

	const history = useHistory();

	const subscriptionsStatus = useYoutubeSubscriptionsQuery({ page, perPage });

	const subscriptions = useMemo(
		() => (subscriptionsStatus.data ? subscriptionsStatus.data.subscriptions : []),
		[subscriptionsStatus.data]
	);
	const totalPages = useMemo(
		() => (subscriptionsStatus.data ? subscriptionsStatus.data.totalPages : 1),
		[subscriptionsStatus.data]
	);

	return useMemo(
		() => (
			<Stack>
				<Title order={2}>Subscriptions</Title>
				<Divider />
				<Stack sx={{ position: 'relative' }}>
					{subscriptionsStatus.isLoading ? (
						<Center>
							<Loader />
						</Center>
					) : (
						<>
							<LoadingOverlay visible={subscriptionsStatus.isFetching} />
							<Grid>
								{subscriptions.map((subscription) => (
									<Grid.Col key={subscription.channelId} xs={12} sm={6} md={3} xl={2}>
										<SubscriptionCard subscription={subscription} />
									</Grid.Col>
								))}
							</Grid>
							<Center>
								<Pagination
									total={totalPages}
									page={page}
									onChange={(newPage) => history.push(`/youtube/subscriptions/${newPage}`)}
								/>
							</Center>
						</>
					)}
				</Stack>
			</Stack>
		),
		[history, page, subscriptions, subscriptionsStatus.isFetching, subscriptionsStatus.isLoading, totalPages]
	);
};

export default YoutubeSubscriptions;
