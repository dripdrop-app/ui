import { useMemo } from 'react';
import { ActionIcon, Text, Tooltip } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { MdAddCircle, MdRemoveCircle } from 'react-icons/md';

import { useAddYoutubeSubscriptionMutation, useRemoveSubscriptionMutation } from '../../api/youtube';

interface SubscribeButtonProps {
	channelTitle: string;
	channelId: string;
	subscriptionId?: string;
}

export const SubscribeButton = (props: SubscribeButtonProps) => {
	const { channelTitle, channelId, subscriptionId } = props;

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
						onClick={() =>
							openConfirmModal({
								title: 'Confirm Remove Subscription',
								children: (
									<Text>
										Remove subscription from channel:{' '}
										<Text display="inline-block" weight="bold">
											{channelTitle}
										</Text>
									</Text>
								),
								labels: { confirm: 'Confirm', cancel: 'Cancel' },
								onConfirm: () => removeYoutubeSubscription(subscriptionId),
							})
						}
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
		channelId,
		channelTitle,
		addYoutubeSubscriptionStatus.isLoading,
		addYoutubeSubscription,
		removeYoutubeSubscriptionStatus.isLoading,
		removeYoutubeSubscription,
	]);
};
