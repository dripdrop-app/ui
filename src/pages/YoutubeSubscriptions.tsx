import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Center, Divider, Flex, Grid, Loader, Pagination, Stack, Text, Title } from '@mantine/core';

import SubscriptionCard from '../components/Youtube/SubscriptionCard';

import { useUserYoutubeChannelQuery, useYoutubeSubscriptionsQuery } from '../api/youtube';
import useSearchParams from '../utils/useSearchParams';
import UpdateUserChannelModal from '../components/Youtube/UpdateUserChannelModal';

const YoutubeSubscriptions = () => {
	const { params, setSearchParams } = useSearchParams({ perPage: 48, page: 1 });

	const subscriptionsStatus = useYoutubeSubscriptionsQuery(params);
	const userChannelStatus = useUserYoutubeChannelQuery();

	const { id: userChannelId } = useMemo(
		() => (userChannelStatus.data ? userChannelStatus.data : { id: null }),
		[userChannelStatus.data]
	);

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
							<Flex align="center" justify="space-between">
								{userChannelId ? <Text>User Channel currently connected to: {userChannelId}</Text> : null}
								<UpdateUserChannelModal />
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
		[params.page, setSearchParams, subscriptions, subscriptionsStatus.isLoading, totalPages, userChannelId]
	);
};

export default YoutubeSubscriptions;
