import { AspectRatio, Center, Divider, Grid, Loader, Stack, Title } from "@mantine/core";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

import { useYoutubeVideoQuery } from "../../api/youtube";
import VideoCard from "../../components/Youtube/VideoCard";
import VideoInformation from "../../components/Youtube/VideoInformation";
import VideoPlayer from "../../components/Youtube/VideoPlayer";

const YoutubeVideo = () => {
  const { id } = useParams();

  const videoStatus = useYoutubeVideoQuery({ videoId: id || "", relatedLength: 4 }, { skip: !id });

  const { video, relatedVideos } = useMemo(
    () => (videoStatus.data ? videoStatus.data : { video: null, relatedVideos: null }),
    [videoStatus.data]
  );

  return (
    <Stack p="md">
      {videoStatus.isLoading ? (
        <Center>
          <Loader />
        </Center>
      ) : video ? (
        <>
          <Helmet>
            <title>{video.title}</title>
          </Helmet>
          <AspectRatio mah="80vh" style={{ overflow: "hidden" }} ratio={16 / 9}>
            <VideoPlayer video={video} playing={true} />
          </AspectRatio>
          <VideoInformation video={video} />
          <Divider />
          <Title order={3}>Related Videos</Title>
          <Grid>
            {relatedVideos?.map((video) => (
              <Grid.Col key={video.id} span={{ xs: 12, sm: 6, md: 4, lg: 2, xl: 1 }}>
                <VideoCard video={video} />
              </Grid.Col>
            ))}
          </Grid>
        </>
      ) : (
        <Center>Video could not be loaded</Center>
      )}
    </Stack>
  );
};

export default YoutubeVideo;
