import { Avatar, Box, Card, Flex, Image, Overlay, Stack, Text, Tooltip } from "@mantine/core";
import { useHover, useOs } from "@mantine/hooks";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";

import { VideoQueueButton, VideoWatchButton } from "./VideoButtons";
import VideoCategoryIcon from "./VideoCategoryIcon";

interface VideoCardProps {
  video: YoutubeVideo;
}

const VideoCard: FunctionComponent<VideoCardProps> = ({ video }) => {
  const { hovered, ref } = useHover();
  const os = useOs();

  const isMobile = os === "android" || os === "ios";

  const hideOverlay = !isMobile && !hovered && !video.queued && !video.watched;

  const hideQueueButton = !isMobile && !hovered && !video.queued;

  const publishedAt = new Date(video.publishedAt).toLocaleDateString();
  const channelLink = `/youtube/channel/${video.channelId}`;
  const videoLink = `/youtube/video/${video.id}`;

  return (
    <Box>
      <Card>
        <Card.Section ref={ref} pos="relative">
          <Image src={video.thumbnail} placeholder="thumbnail" />
          <Overlay
            style={{ ...(hideOverlay && { display: "none" }) }}
            opacity={0.5}
            color="black"
            zIndex={1}
            component={Link}
            to={videoLink}
          />
          <Box
            pos="absolute"
            right="5%"
            top="5%"
            style={{
              ...(hideQueueButton && { display: "none" }),
              zIndex: 2,
            }}
          >
            <VideoQueueButton video={video} />
          </Box>
          <Box pos="absolute" left="5%" top="5%" style={{ zIndex: 2 }}>
            <VideoWatchButton video={video} />
          </Box>
          <Tooltip label={video.categoryName}>
            <Box
              style={(theme) => ({
                zIndex: 2,
                borderRadius: theme.spacing.xs,
              })}
              pos="absolute"
              right="5%"
              bottom="5%"
              bg="dark.7"
              px={6}
              py={2}
            >
              <VideoCategoryIcon categoryId={video.categoryId} color="white" />
            </Box>
          </Tooltip>
        </Card.Section>
        <Stack py={10}>
          <Stack className="hover-underline">
            <Text component={Link} to={videoLink}>
              {video.title}
            </Text>
          </Stack>
          <Flex justify="space-between">
            <Text
              variant="link"
              c="dimmed"
              component={Link}
              to={channelLink}
              className="hover-underline"
              style={{ overflow: "hidden" }}
            >
              <Flex>
                <Avatar size="sm" src={video.channelThumbnail} style={{ borderRadius: 10 }} />
                <Text style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                  {video.channelTitle}
                </Text>
              </Flex>
            </Text>
            <Text ta="right" style={{ flex: 1 }} c="dimmed">
              {publishedAt}
            </Text>
          </Flex>
        </Stack>
      </Card>
    </Box>
  );
};

export default VideoCard;
