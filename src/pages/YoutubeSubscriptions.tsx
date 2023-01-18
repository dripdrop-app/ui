import { useCallback, useMemo, useState } from 'react';
import { generatePath, useHistory, useRouteMatch } from 'react-router-dom';
import { Center, Divider, Grid, Loader, LoadingOverlay, Pagination, Stack, Title } from '@mantine/core';

import { useYoutubeSubscriptionsQuery } from '../api/youtube';
import SubscriptionCard from '../components/Youtube/SubscriptionCard';

const YoutubeSubscriptions = () => {
	const [perPage] = useState(48);

	const { path, url, params } = useRouteMatch<{ page?: string }>();
	const history = useHistory();

	const { page } = useMemo(() => {
		return {
			page: params.page ? parseInt(params.page) : 1,
		};
	}, [params.page]);

	const subscriptionsStatus = useYoutubeSubscriptionsQuery({ page, perPage });

	const subscriptions = useMemo(
		() => (subscriptionsStatus.data ? subscriptionsStatus.data.subscriptions : []),
		[subscriptionsStatus.data]
	);
	const totalPages = useMemo(
		() => (subscriptionsStatus.data ? subscriptionsStatus.data.totalPages : 1),
		[subscriptionsStatus.data]
	);

	const updateUrl = useCallback(
		(update: Partial<YoutubeVideosBody>) => {
			let pathname = url;
			if (update.page) {
				pathname = generatePath(path, { ...params, page: update.page });
			}
			history.push({ ...history.location, pathname });
		},
		[history, params, path, url]
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
								<Pagination total={totalPages} page={page} onChange={(newPage) => updateUrl({ page: newPage })} />
							</Center>
						</>
					)}
				</Stack>
			</Stack>
		),
		[page, subscriptions, subscriptionsStatus.isFetching, subscriptionsStatus.isLoading, totalPages, updateUrl]
	);
};

export default YoutubeSubscriptions;
