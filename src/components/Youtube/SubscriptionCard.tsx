import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, Image, Overlay, Stack, Text } from '@mantine/core';
import { useHover, useOs } from '@mantine/hooks';
import { SubscribeButton } from './ChannelButtons';

interface SubscriptionCardProps {
	subscription: YoutubeSubscription;
}

const SubscriptionCard = (props: SubscriptionCardProps) => {
	const { subscription } = props;

	const { hovered, ref } = useHover();
	const os = useOs();

	const showOverlay = useMemo(() => os === 'android' || os === 'ios' || hovered, [hovered, os]);

	return useMemo(() => {
		const publishedAt = new Date(subscription.publishedAt).toLocaleDateString();
		const channelLink = `/youtube/channel/${subscription.channelId}`;

		return (
			<Box ref={ref}>
				<Card>
					<Card.Section sx={{ position: 'relative' }}>
						<Image src={subscription.channelThumbnail} alt={subscription.channelTitle} withPlaceholder height={200} />
						<Overlay sx={{ ...(!showOverlay && { display: 'none' }) }} opacity={0.5} color="black" zIndex={1} />
						<Box
							sx={{ ...(!showOverlay && { display: 'none' }), position: 'absolute', right: '5%', top: '5%', zIndex: 2 }}
						>
							<SubscribeButton
								channelTitle={subscription.channelTitle}
								channelId={subscription.channelId}
								subscriptionId={subscription.id}
							/>
						</Box>
					</Card.Section>
					<Stack py={10}>
						<Text component={Link} to={channelLink}>
							{subscription.channelTitle}
						</Text>
						<Text color="dimmed">Subscribed on {publishedAt}</Text>
					</Stack>
				</Card>
			</Box>
		);
	}, [
		ref,
		showOverlay,
		subscription.channelId,
		subscription.channelThumbnail,
		subscription.channelTitle,
		subscription.id,
		subscription.publishedAt,
	]);
};

export default SubscriptionCard;
