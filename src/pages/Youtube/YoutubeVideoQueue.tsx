import { AspectRatio, Button, Divider, Flex, Stack, Title } from "@mantine/core";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";

import { useYoutubeVideoQueueQuery } from "../../api/youtube";
import VideoInformation from "../../components/Youtube/VideoInformation";
import VideoPlayer from "../../components/Youtube/VideoPlayer";
import VideoQueueModal from "../../components/Youtube/VideoQueueModal";
import useSearchParams from "../../utils/useSearchParams";

const YoutubeVideoQueue = () => {
  const { params, setSearchParams } = useSearchParams({ index: 1 });

  const videoQueueStatus = useYoutubeVideoQueueQuery(params.index);

  const { currentVideo, next, prev } = useMemo(() => {
    if (videoQueueStatus.isSuccess && videoQueueStatus.currentData) {
      return videoQueueStatus.currentData;
    }
    return { currentVideo: null, prev: false, next: false };
  }, [videoQueueStatus.currentData, videoQueueStatus.isSuccess]);

  return (
    <Stack>
      <Helmet>
        <title>Video Queue</title>
      </Helmet>
      <Flex justify="space-between">
        <Title order={2}>Video Queue</Title>
        <Flex>
          <Button
            leftIcon={<MdSkipPrevious />}
            disabled={!prev}
            onClick={() => setSearchParams({ index: params.index - 1 })}
          >
            Previous
          </Button>
          <VideoQueueModal
            currentVideo={currentVideo}
            queueIndex={params.index}
            changeQueueIndex={(newIndex) => setSearchParams({ index: newIndex })}
          />
          <Button
            rightIcon={<MdSkipNext />}
            disabled={!next}
            onClick={() => setSearchParams({ index: params.index + 1 })}
          >
            Next
          </Button>
        </Flex>
      </Flex>
      <Divider />
      <AspectRatio sx={{ maxHeight: "80vh", overflow: "hidden" }} ratio={16 / 9}>
        <VideoPlayer
          video={currentVideo}
          playing={true}
          onEnd={() => {
            if (next) {
              setSearchParams({ index: params.index + 1 });
            }
          }}
        />
      </AspectRatio>
      {currentVideo && <VideoInformation video={currentVideo} />}
    </Stack>
  );
};

export default YoutubeVideoQueue;
