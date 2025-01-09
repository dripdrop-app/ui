import { Box, Card, Image, Overlay, Stack, Text } from "@mantine/core";
import { useHover, useOs } from "@mantine/hooks";
import { FunctionComponent, useMemo } from "react";
import { Link } from "react-router-dom";

import { SubscribeButton } from "./ChannelButtons";

interface SubscriptionCardProps {
  subscription: YoutubeSubscription;
}

const SubscriptionCard: FunctionComponent<SubscriptionCardProps> = ({ subscription }) => {
  const { hovered, ref } = useHover();
  const os = useOs();

  const showOverlay = useMemo(() => os === "android" || os === "ios" || hovered, [hovered, os]);

  const channelLink = `/youtube/channel/${subscription.channelId}`;

  return (
    <Box ref={ref}>
      <Card>
        <Card.Section style={{ position: "relative" }}>
          <Image src={subscription.channelThumbnail} alt={subscription.channelTitle} height={200} />
          <Overlay
            style={{ ...(!showOverlay && { display: "none" }) }}
            opacity={0.5}
            color="black"
            zIndex={1}
            component={Link}
            to={channelLink}
          />
          <Box pos="absolute" right="5%" top="5%" style={{ ...(!showOverlay && { display: "none" }), zIndex: 2 }}>
            <SubscribeButton
              channelTitle={subscription.channelTitle}
              channelId={subscription.channelId}
              subscribed={true}
            />
          </Box>
        </Card.Section>
        <Stack py={10} className="hover-underline">
          <Text component={Link} to={channelLink}>
            {subscription.channelTitle}
          </Text>
        </Stack>
      </Card>
    </Box>
  );
};

export default SubscriptionCard;
