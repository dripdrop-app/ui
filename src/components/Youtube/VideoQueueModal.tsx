import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Loader,
  LoadingOverlay,
  Modal,
  Pagination,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { VideoQueueButton } from "./VideoButtons";

import { useYoutubeVideosQuery } from "../../api/youtube";

interface VideoQueueModalProps {
  changeQueueIndex: (newIndex: number) => void;
  currentVideo: YoutubeVideo | null;
  queueIndex: number;
}

const VideoQueueModal = (props: VideoQueueModalProps) => {
  const { currentVideo, queueIndex, changeQueueIndex } = props;

  const [filter, setFilter] = useState<YoutubeVideosBody>({
    page: 1,
    perPage: 50,
    queuedOnly: true,
    selectedCategories: [],
  });

  const [opened, handlers] = useDisclosure(false);

  const videosStatus = useYoutubeVideosQuery(filter);

  const { videos, totalPages } = useMemo(
    () => (videosStatus.data ? videosStatus.data : { videos: [], totalPages: 1 }),
    [videosStatus.data]
  );

  useEffect(() => {
    const currentVideoPage = Math.ceil(queueIndex / filter.perPage);
    setFilter((prevState) => ({ ...prevState, page: currentVideoPage }));
  }, [filter.perPage, queueIndex]);

  return useMemo(
    () => (
      <>
        <Button onClick={handlers.open}>Open Queue</Button>
        <Modal title="Queue" size="lg" opened={opened} onClose={handlers.close}>
          {videosStatus.isLoading ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <>
              <LoadingOverlay visible={videosStatus.isFetching} />
              <Stack>
                <ScrollArea style={{ height: "70vh" }}>
                  {videos.map((video, i) => {
                    const videoIndex = i + 1 + filter.perPage * (filter.page - 1);
                    return (
                      <React.Fragment key={video.id}>
                        <Flex
                          align="center"
                          p="sm"
                          sx={{
                            borderRadius: 5,
                            "&:hover": {
                              backgroundColor: "#111111",
                            },
                          }}
                        >
                          <Box
                            sx={{ color: "inherit", flex: 9, cursor: "pointer" }}
                            onClick={() => {
                              changeQueueIndex(videoIndex);
                              handlers.close();
                            }}
                          >
                            <Flex align="center">
                              <Flex sx={{ flex: 3 }} align="center" wrap="nowrap">
                                <Avatar src={video.thumbnail} sx={{ borderRadius: 10 }} />
                                <Stack spacing="xs">
                                  <Title order={6}>{video.title}</Title>
                                  <Text sx={{ textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {video.channelTitle}
                                  </Text>
                                </Stack>
                              </Flex>
                              <Box sx={{ flex: 1 }}>{video.id === currentVideo?.id && <Text>Now Playing</Text>}</Box>
                            </Flex>
                          </Box>
                          <Box sx={{ flex: 1, alignItems: "end" }}>
                            <VideoQueueButton video={video} />
                          </Box>
                        </Flex>
                        <Divider />
                      </React.Fragment>
                    );
                  })}
                </ScrollArea>
                <Center>
                  <Pagination
                    total={totalPages}
                    page={filter.page}
                    onChange={(newPage) => setFilter((prevState) => ({ ...prevState, page: newPage }))}
                  />
                </Center>
              </Stack>
            </>
          )}
        </Modal>
      </>
    ),
    [
      handlers,
      opened,
      videosStatus.isLoading,
      videosStatus.isFetching,
      videos,
      totalPages,
      filter.page,
      filter.perPage,
      currentVideo?.id,
      changeQueueIndex,
    ]
  );
};

export default VideoQueueModal;
