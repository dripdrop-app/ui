import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Center, Divider, Flex, Grid, Loader, Pagination, Stack, Title } from '@mantine/core';

import SubscriptionCard from '../components/Youtube/SubscriptionCard';

import { useYoutubeSubscriptionsQuery } from '../api/youtube';
import useSearchParams from '../utils/useSearchParams';
import UpdateSubscriptionsModal from '../components/Youtube/UpdateSubscriptionsModal';

const YoutubeSubscriptions = () => {
	const { params, setSearchParams } = useSearchParams({ perPage: 48, page: 1 });

	const subscriptionsStatus = useYoutubeSubscriptionsQuery(params);

	const { subscriptions, totalPages } = useMemo(
		() => (subscriptionsStatus.data ? subscriptionsStatus.data : { subscriptions: [], totalPages: 1 }),
		[subscriptionsStatus.data]
	);

	return useMemo(
		() => (
			<Stack>
				<Helmet>
					<title>Subscriptions</title>
				</Helmet>
				<Title order={2}>Subscriptions</Title>
				<Divider />
				<Stack sx={{ position: 'relative' }}>
					{subscriptionsStatus.isLoading ? (
						<Center>
							<Loader />
						</Center>
					) : (
						<>
							<Flex>
								<UpdateSubscriptionsModal />
							</Flex>
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

export default YoutubeSubscriptions;
