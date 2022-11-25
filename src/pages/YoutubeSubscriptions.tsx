import { useCallback, useEffect, useMemo, useState } from 'react';
import { CircularProgress, Divider, Grid, Stack, Typography } from '@mui/material';
import { useYoutubeSubscriptionsQuery } from '../api/youtube';
import useObject from '../utils/useObject';
import InfiniteScroll from '../components/InfiniteScroll';
import SubscriptionsPage from '../components/Youtube/SubscriptionsPage';
import SubscriptionCard from '../components/Youtube/SubscriptionCard';
import withYoutubeAuthPage from '../components/Auth/YoutubeAuthPage';

const YoutubeSubscriptions = () => {
	const [endReached, setEndReached] = useState(false);

	const { object: filter, setObject: setFilter } = useObject<YoutubeSubscriptionBody>({
		page: 1,
		perPage: 48,
	});

	const subscriptionsStatus = useYoutubeSubscriptionsQuery(filter);

	const onEndReached = useCallback(() => {
		if (!endReached && subscriptionsStatus.isSuccess) {
			setFilter({ page: filter.page + 1 });
		}
	}, [endReached, filter.page, setFilter, subscriptionsStatus.isSuccess]);

	useEffect(() => {
		if (subscriptionsStatus.isSuccess && subscriptionsStatus.currentData) {
			const { totalPages } = subscriptionsStatus.currentData;
			if (totalPages <= filter.page) {
				setEndReached(true);
			}
		}
	}, [filter.page, subscriptionsStatus.currentData, subscriptionsStatus.isSuccess]);

	return useMemo(
		() => (
			<Stack direction="column" spacing={2}>
				<Typography variant="h4">Subscriptions</Typography>
				<Divider />
				<InfiniteScroll
					items={Array(filter.page).fill(1)}
					renderItem={(page, index) => (
						<Grid container>
							<SubscriptionsPage
								perPage={filter.perPage}
								page={index + 1}
								renderItem={(subscription) => (
									<Grid item xs={12} sm={6} md={3} xl={2} padding={1}>
										<SubscriptionCard subscription={subscription} />
									</Grid>
								)}
								renderLoading={() => (
									<Grid item xs={12} padding={2}>
										<Stack direction="row" justifyContent="center">
											<CircularProgress />
										</Stack>
									</Grid>
								)}
							/>
						</Grid>
					)}
					onEndReached={onEndReached}
				/>
			</Stack>
		),
		[filter.page, filter.perPage, onEndReached]
	);
};

export default withYoutubeAuthPage(YoutubeSubscriptions);
