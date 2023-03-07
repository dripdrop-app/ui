import { useMemo } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';

import { useAddYoutubeSubscriptionMutation, useRemoveSubscriptionMutation } from '../../api/youtube';
import { MdAddCircle, MdRemoveCircle } from 'react-icons/md';

interface SubscribeButtonProps {
	channelId: string;
	subscriptionId?: string;
}

export const SubscribeButton = (props: SubscribeButtonProps) => {
	const { channelId, subscriptionId } = props;

	const [addYoutubeSubscription, addYoutubeSubscriptionStatus] = useAddYoutubeSubscriptionMutation();
	const [removeYoutubeSubscription, removeYoutubeSubscriptionStatus] = useRemoveSubscriptionMutation();

	return useMemo(() => {
		if (!subscriptionId) {
			return (
				<Tooltip label="Subscribe">
					<ActionIcon
						onClick={() => addYoutubeSubscription(channelId)}
						loading={addYoutubeSubscriptionStatus.isLoading}
					>
						<MdAddCircle size={25} color="green" />
					</ActionIcon>
				</Tooltip>
			);
		} else if (subscriptionId) {
			return (
				<Tooltip label="Unsubscribe">
					<ActionIcon
						onClick={() => removeYoutubeSubscription(subscriptionId)}
						loading={removeYoutubeSubscriptionStatus.isLoading}
					>
						<MdRemoveCircle size={25} color="red" />
					</ActionIcon>
				</Tooltip>
			);
		}
		return null;
	}, [
		subscriptionId,
		addYoutubeSubscriptionStatus.isLoading,
		addYoutubeSubscription,
		channelId,
		removeYoutubeSubscriptionStatus.isLoading,
		removeYoutubeSubscription,
	]);
};
