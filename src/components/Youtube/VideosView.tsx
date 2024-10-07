import {
  Center,
  Checkbox,
  CloseButton,
  Flex,
  Grid,
  Group,
  Loader,
  MultiSelect,
  Pagination,
  Stack,
} from "@mantine/core";
import React, { FunctionComponent, useMemo } from "react";

import { useYoutubeVideoCategoriesQuery, useYoutubeVideosQuery } from "../../api/youtube";
import useSearchParams from "../../utils/useSearchParams";
import VideoAutoPlayer from "./VideoAutoPlayer";
import YoutubeVideoCard from "./VideoCard";
import VideoCategoryIcon from "./VideoCategoryIcon";

interface VideosViewProps {
  channelId?: string;
  enableAutoPlay?: boolean;
}

const VideosView: FunctionComponent<VideosViewProps> = ({ channelId, enableAutoPlay }) => {
  const { params, setSearchParams } = useSearchParams({
    perPage: 48,
    page: 1,
    selectedCategories: [] as string[],
    likedOnly: false as boolean,
    queuedOnly: false as boolean,
  });

  const videosStatus = useYoutubeVideosQuery({
    ...params,
    selectedCategories: params.selectedCategories.map((id) => parseInt(id)),
    channelId,
  });
  const videoCategoriesStatus = useYoutubeVideoCategoriesQuery({ channelId });

  const categories = useMemo(
    () => (videoCategoriesStatus.data ? videoCategoriesStatus.data.categories : []),
    [videoCategoriesStatus.data]
  );
  const { videos, totalPages } = useMemo(() => videosStatus.data ?? { videos: [], totalPages: 1 }, [videosStatus.data]);

  const Item = React.forwardRef<HTMLDivElement, { value: number; label: string }>(({ value, label, ...props }, ref) => (
    <div ref={ref} {...props}>
      <Flex gap="xs" align="center">
        <VideoCategoryIcon categoryId={value} />
        {label}
      </Flex>
    </div>
  ));

  return (
    <Stack h="100%">
      <Group>
        <Checkbox
          label="Show Liked Only"
          checked={params.likedOnly}
          onChange={(e) => setSearchParams({ likedOnly: e.target.checked, page: 1 })}
        />
        <Checkbox
          label="Show Queued Only"
          checked={params.queuedOnly}
          onChange={(e) => setSearchParams({ queuedOnly: e.target.checked, page: 1 })}
        />
      </Group>
      <MultiSelect
        sx={{ ...(!videoCategoriesStatus.data && { display: "none" }) }}
        label="Categories"
        placeholder="Select Categories"
        data={categories.map((category) => ({
          value: category.id.toString(),
          label: category.name,
        }))}
        itemComponent={Item}
        value={params.selectedCategories}
        valueComponent={({ value, label, onRemove, classNames, ...props }) => (
          <div {...props}>
            <Flex
              sx={(theme) => ({
                backgroundColor: theme.colors.dark[7],
                border: `1px solid ${theme.colors.dark[7]}`,
                borderRadius: theme.radius.sm,
                paddingLeft: 5,
              })}
              gap="xs"
              align="center"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <VideoCategoryIcon categoryId={value} />
              {label}
              <CloseButton onClick={onRemove} />
            </Flex>
          </div>
        )}
        onChange={(newCategories) => setSearchParams({ selectedCategories: newCategories, page: 1 })}
      />
      <Center sx={{ ...(!videosStatus.isFetching && videosStatus.currentData && { display: "none" }) }}>
        <Loader />
      </Center>
      <Stack style={{ ...(!videosStatus.data && { display: "none" }) }}>
        <Grid>
          {videos.map((video) => (
            <Grid.Col key={video.id} xs={12} sm={6} md={4} lg={3} xl={2}>
              <YoutubeVideoCard video={video} />
            </Grid.Col>
          ))}
        </Grid>
        <Center>
          <Pagination
            total={totalPages}
            page={params.page}
            onChange={(newPage) => setSearchParams({ page: newPage })}
          />
        </Center>
      </Stack>
      {enableAutoPlay && (
        <VideoAutoPlayer
          initialParams={{
            ...params,
            selectedCategories: params.selectedCategories.map((id) => parseInt(id)),
            channelId,
          }}
        />
      )}
    </Stack>
  );
};

export default VideosView;
