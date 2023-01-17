import { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Center, Divider, Grid, Pagination, Stack, Title } from '@mantine/core';

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
		() =>
			subscriptionsStatus.isSuccess && subscriptionsStatus.currentData
				? subscriptionsStatus.currentData.subscriptions
				: [],
		[subscriptionsStatus.currentData, subscriptionsStatus.isSuccess]
	);

	const totalPages = useMemo(
		() =>
			subscriptionsStatus.isSuccess && subscriptionsStatus.currentData ? subscriptionsStatus.currentData.totalPages : 1,
		[subscriptionsStatus.currentData, subscriptionsStatus.isSuccess]
	);

	return useMemo(
		() => (
			<Stack>
				<Title order={2}>Subscriptions</Title>
				<Divider />
				<Grid>
					{subscriptions.map((subscription, i) => (
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
			</Stack>
		),
		[history, page, subscriptions, totalPages]
	);
};

export default YoutubeSubscriptions;
