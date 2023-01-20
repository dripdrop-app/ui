import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, Image, Overlay, Stack, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';

interface SubscriptionCardProps {
	subscription: YoutubeSubscription;
}

const SubscriptionCard = (props: SubscriptionCardProps) => {
	const { subscription } = props;

	const { hovered, ref } = useHover();

	return useMemo(() => {
		const publishedAt = new Date(subscription.publishedAt).toLocaleDateString();
		const channelLink = `/youtube/channel/${subscription.channelId}`;

		return (
			<Box ref={ref}>
				<Card component={Link} to={channelLink}>
					<Card.Section sx={{ position: 'relative' }}>
						<Image src={subscription.channelThumbnail} alt={subscription.channelTitle} withPlaceholder height={200} />
						{hovered && <Overlay opacity={0.5} color="black" zIndex={1} />}
					</Card.Section>
					<Stack py={10}>
						<Text>{subscription.channelTitle}</Text>
						<Text>Subscribed on {publishedAt}</Text>
					</Stack>
				</Card>
			</Box>
		);
	}, [
		hovered,
		ref,
		subscription.channelId,
		subscription.channelThumbnail,
		subscription.channelTitle,
		subscription.publishedAt,
	]);
};

export default SubscriptionCard;
