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
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";

import { useYoutubeVideosQuery } from "../../api/youtube";
import { VideoQueueButton } from "./VideoButtons";

interface VideoQueueModalProps {
  changeQueueIndex: (newIndex: number) => void;
  currentVideo: YoutubeVideo | null;
  queueIndex: number;
}

const VideoQueueModal: FunctionComponent<VideoQueueModalProps> = ({ currentVideo, queueIndex, changeQueueIndex }) => {
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

  return (
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
                          color="inherit"
                          style={{ flex: 9, cursor: "pointer" }}
                          onClick={() => {
                            changeQueueIndex(videoIndex);
                            handlers.close();
                          }}
                        >
                          <Flex align="center">
                            <Flex style={{ flex: 3 }} align="center" wrap="nowrap">
                              <Avatar src={video.thumbnail} style={{ borderRadius: 10 }} />
                              <Stack gap="xs">
                                <Title order={6}>{video.title}</Title>
                                <Text style={{ textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {video.channelTitle}
                                </Text>
                              </Stack>
                            </Flex>
                            <Box style={{ flex: 1 }}>{video.id === currentVideo?.id && <Text>Now Playing</Text>}</Box>
                          </Flex>
                        </Box>
                        <Box style={{ flex: 1, alignItems: "end" }}>
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
                  value={filter.page}
                  onChange={(newPage) => setFilter((prevState) => ({ ...prevState, page: newPage }))}
                />
              </Center>
            </Stack>
          </>
        )}
      </Modal>
    </>
  );
};

export default VideoQueueModal;
