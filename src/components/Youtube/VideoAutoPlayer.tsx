import { ActionIcon, Avatar, Flex, Group, Space, Stack, Text } from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FaAngleDown, FaAngleUp, FaPause, FaPlay } from "react-icons/fa";

import { useDisclosure } from "@mantine/hooks";
import { useYoutubeVideosQuery } from "../../api/youtube";
import { VideoLikeButton, VideoQueueButton } from "./VideoButtons";
import VideoPlayer from "./VideoPlayer";

interface VideoAutoPlayerProps {
  initialParams: YoutubeVideosBody;
}

const VideoAutoPlayer: FunctionComponent<VideoAutoPlayerProps> = ({ initialParams }) => {
  const [currentParams, setCurrentParams] = useState<YoutubeVideosBody | undefined>();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const [playing, { toggle: togglePlaying }] = useDisclosure(true);
  const [expand, { toggle: toggleExpand }] = useDisclosure(false);

  const videosStatus = useYoutubeVideosQuery(currentParams ?? skipToken, { skip: !currentParams });

  const currentVideo = useMemo(() => {
    const videos = videosStatus.data?.videos ?? [];
    if (videos.length === 0) {
      return null;
    }
    return videos[currentVideoIndex];
  }, [currentVideoIndex, videosStatus.data]);

  useEffect(() => {
    if (!currentParams) {
      setCurrentParams(initialParams);
    }
  }, [currentParams, initialParams]);

  useEffect(() => {
    if (currentParams) {
      if (currentVideoIndex >= currentParams?.perPage) {
        setCurrentParams({ ...currentParams, page: currentParams.page + 1 });
        setCurrentVideoIndex(0);
      } else if (currentVideoIndex < 0 && currentParams?.page > 1) {
        setCurrentParams({ ...currentParams, page: currentParams.page - 1 });
        setCurrentVideoIndex(currentParams.perPage - 1);
      }
    }
  }, [currentParams, currentVideoIndex]);

  return (
    <Flex
      pos="sticky"
      bottom="0px"
      align="center"
      mb="-16px"
      mr="-16px"
      ml="-16px"
      mt="auto"
      sx={(theme) => ({
        backgroundColor: theme.colors.dark[7],
        zIndex: 99,
      })}
    >
      <Stack align="center" w="100%" spacing={0}>
        <VideoPlayer
          video={currentVideo}
          playing={playing}
          height={expand ? `75vh` : "0px"}
          onEnd={() => setCurrentVideoIndex(currentVideoIndex + 1)}
        />
        <Group p="sm" align="center">
          <Avatar size="md" src={currentVideo?.thumbnail} sx={{ borderRadius: 10 }} />
          <Stack spacing={0}>
            <Text sx={{ fontSize: "0.9em" }} truncate="end">
              {currentVideo?.title}
            </Text>
            <Text sx={{ fontSize: "0.75em" }}>{currentVideo?.channelTitle}</Text>
          </Stack>
          <Space w="lg" />
          <Group noWrap>
            {currentVideo && <VideoLikeButton video={currentVideo} />}
            {currentVideo && <VideoQueueButton video={currentVideo} />}
          </Group>
          <Space w="lg" />
          <Group noWrap>
            <ActionIcon onClick={() => setCurrentVideoIndex(currentVideoIndex - 1)}>
              <CgPlayTrackPrev size={25} />
            </ActionIcon>
            <ActionIcon sx={{ ...(playing && { display: "none" }) }} onClick={togglePlaying}>
              <FaPlay />
            </ActionIcon>
            <ActionIcon sx={{ ...(!playing && { display: "none" }) }} onClick={togglePlaying}>
              <FaPause />
            </ActionIcon>
            <ActionIcon onClick={() => setCurrentVideoIndex(currentVideoIndex + 1)}>
              <CgPlayTrackNext size={25} />
            </ActionIcon>
          </Group>
          <ActionIcon sx={{ ...(expand && { display: "none" }) }} onClick={toggleExpand}>
            <FaAngleUp />
          </ActionIcon>
          <ActionIcon sx={{ ...(!expand && { display: "none" }) }} onClick={toggleExpand}>
            <FaAngleDown />
          </ActionIcon>
        </Group>
      </Stack>
    </Flex>
  );
};

export default VideoAutoPlayer;
