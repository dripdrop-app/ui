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
        <Card.Section sx={{ position: "relative" }}>
          <Image src={subscription.channelThumbnail} alt={subscription.channelTitle} withPlaceholder height={200} />
          <Overlay
            sx={{ ...(!showOverlay && { display: "none" }) }}
            opacity={0.5}
            color="black"
            zIndex={1}
            component={Link}
            to={channelLink}
          />
          <Box
            sx={{ ...(!showOverlay && { display: "none" }), position: "absolute", right: "5%", top: "5%", zIndex: 2 }}
          >
            <SubscribeButton
              channelTitle={subscription.channelTitle}
              channelId={subscription.channelId}
              subscribed={true}
            />
          </Box>
        </Card.Section>
        <Stack py={10}>
          <Text component={Link} to={channelLink}>
            {subscription.channelTitle}
          </Text>
        </Stack>
      </Card>
    </Box>
  );
};

export default SubscriptionCard;
