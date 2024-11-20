import { Avatar, Flex, Spoiler, Stack, Text, Title } from "@mantine/core";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";

import { VideoLikeButton, VideoQueueButton, VideoWatchButton } from "./VideoButtons";

interface VideoInformationProps {
  video: YoutubeVideo;
}

const VideoInformation: FunctionComponent<VideoInformationProps> = ({ video }) => {
  const publishedAt = new Date(video.publishedAt).toLocaleDateString();
  const channelLink = `/youtube/channel/${video.channelId}`;

  return (
    <Stack>
      <Flex justify="space-between">
        <Title order={3}>{video.title}</Title>
        <Flex>
          <VideoWatchButton video={video} />
          <VideoLikeButton video={video} />
          <VideoQueueButton video={video} />
        </Flex>
      </Flex>
      <Flex justify="space-between">
        <Text component={Link} to={channelLink} className="hover-underline">
          <Flex>
            <Avatar size="sm" src={video.channelThumbnail} style={{ borderRadius: 10 }} />
            <Text>{video.channelTitle}</Text>
          </Flex>
        </Text>
        <Text>{publishedAt}</Text>
      </Flex>
      {video.description && (
        <Spoiler style={{ whiteSpace: "pre-line" }} maxHeight={80} showLabel="Show more" hideLabel="Hide">
          {video.description}
        </Spoiler>
      )}
    </Stack>
  );
};

export default VideoInformation;
