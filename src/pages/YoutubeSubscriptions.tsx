import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CircularProgress, Divider, Grid, Stack, Typography, Box } from '@mui/material';
import { useYoutubeSubscriptionsQuery } from '../api/youtube';
import { useObject } from '../utils/useObject';
import InfiniteScroll from '../components/InfiniteScroll';
import SubscriptionsPage from '../components/Youtube/SubscriptionsPage';
import SubscriptionCard from '../components/Youtube/SubscriptionCard';
import YoutubeAuthPage from '../components/Auth/YoutubeAuthPage';

const YoutubeSubscriptions = () => {
	const [rootHeight, setRootHeight] = useState<number | undefined>(undefined);
	const rootRef = useRef<HTMLDivElement | null>(null);
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

	useEffect(() => {
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const element = entry.target;
				const rect = element.getBoundingClientRect();
				setRootHeight(window.innerHeight - rect.top - window.innerHeight * 0.05);
			}
		});
		if (rootRef.current) {
			const root = rootRef.current;
			observer.observe(root);
			return () => observer.unobserve(root);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [window.innerHeight]);

	return useMemo(
		() => (
			<YoutubeAuthPage>
				<Stack direction="column" spacing={2}>
					<Typography variant="h4">Subscriptions</Typography>
					<Divider />
					<Box ref={rootRef}>
						<InfiniteScroll
							items={Array(filter.page).fill(1)}
							height={rootHeight}
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
					</Box>
				</Stack>
			</YoutubeAuthPage>
		),
		[filter.page, filter.perPage, onEndReached, rootHeight]
	);
};

export default YoutubeSubscriptions;
