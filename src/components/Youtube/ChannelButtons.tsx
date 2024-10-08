import { useMemo } from "react";
import { ActionIcon, Text, Tooltip } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { MdAddCircle, MdRemoveCircle } from "react-icons/md";

import { useAddYoutubeSubscriptionMutation, useRemoveSubscriptionMutation } from "../../api/youtube";

interface SubscribeButtonProps {
  channelTitle: string;
  channelId: string;
  subscribed: boolean;
}

export const SubscribeButton = (props: SubscribeButtonProps) => {
  const { channelTitle, channelId, subscribed } = props;

  const [addYoutubeSubscription, addYoutubeSubscriptionStatus] = useAddYoutubeSubscriptionMutation();
  const [removeYoutubeSubscription, removeYoutubeSubscriptionStatus] = useRemoveSubscriptionMutation();

  return useMemo(() => {
    if (!subscribed) {
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
    }
    return (
      <Tooltip label="Unsubscribe">
        <ActionIcon
          onClick={() =>
            openConfirmModal({
              title: "Confirm Remove Subscription",
              children: (
                <Text>
                  Remove subscription from channel:{" "}
                  <Text display="inline-block" weight="bold">
                    {channelTitle}
                  </Text>
                </Text>
              ),
              labels: { confirm: "Confirm", cancel: "Cancel" },
              onConfirm: () => removeYoutubeSubscription(channelId),
            })
          }
          loading={removeYoutubeSubscriptionStatus.isLoading}
        >
          <MdRemoveCircle size={25} color="red" />
        </ActionIcon>
      </Tooltip>
    );
  }, [
    subscribed,
    channelId,
    channelTitle,
    addYoutubeSubscriptionStatus.isLoading,
    removeYoutubeSubscriptionStatus.isLoading,
    addYoutubeSubscription,
    removeYoutubeSubscription,
  ]);
};
