import { useMemo } from 'react';
import { Center, Divider, Grid, Loader, Pagination, Stack, Title } from '@mantine/core';

import { useYoutubeSubscriptionsQuery } from '../api/youtube';
import SubscriptionCard from '../components/Youtube/SubscriptionCard';
import useSearchParams from '../utils/useSearchParams';
import withAuthPage from '../components/Auth/AuthPage';
import withYoutubeAuthPage from '../components/Auth/YoutubeAuthPage';

const YoutubeSubscriptions = () => {
	const { params, setSearchParams } = useSearchParams({ perPage: 48, page: 1 });

	const subscriptionsStatus = useYoutubeSubscriptionsQuery(params);

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
							<Grid>
								{subscriptions.map((subscription) => (
									<Grid.Col key={subscription.channelId} xs={12} sm={6} md={4} lg={3} xl={2}>
										<SubscriptionCard subscription={subscription} />
									</Grid.Col>
								))}
							</Grid>
							<Center>
								<Pagination
									total={totalPages}
									page={params.page}
									onChange={(newPage) => setSearchParams({ page: newPage })}
								/>
							</Center>
						</>
					)}
				</Stack>
			</Stack>
		),
		[params.page, setSearchParams, subscriptions, subscriptionsStatus.isLoading, totalPages]
	);
};

export default withAuthPage(withYoutubeAuthPage(YoutubeSubscriptions));
