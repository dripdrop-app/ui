import { useMemo } from "react";
import { ActionIcon, Tooltip } from "@mantine/core";
import { MdAddToQueue, MdRemoveFromQueue, MdThumbUp, MdVisibility } from "react-icons/md";

import {
  useAddYoutubeVideoLikeMutation,
  useAddYoutubeVideoQueueMutation,
  useDeleteYoutubeVideoLikeMutation,
  useDeleteYoutubeVideoQueueMutation,
} from "../../api/youtube";

interface VideoButtonsProps {
  video: YoutubeVideo;
}

export const VideoLikeButton = (props: VideoButtonsProps) => {
  const { video } = props;

  const [likeVideo, likeVideoStatus] = useAddYoutubeVideoLikeMutation();
  const [unLikeVideo, unLikeVideoStatus] = useDeleteYoutubeVideoLikeMutation();

  const loading = useMemo(
    () => likeVideoStatus.isLoading || unLikeVideoStatus.isLoading,
    [likeVideoStatus.isLoading, unLikeVideoStatus.isLoading]
  );

  const likedDate = video.liked ? new Date(video.liked).toLocaleDateString() : "";

  return useMemo(
    () => (
      <Tooltip label={video.liked ? `Liked on ${likedDate}` : "Like"}>
        <ActionIcon onClick={() => (video.liked ? unLikeVideo(video.id) : likeVideo(video.id))} loading={loading}>
          <MdThumbUp size={25} color={video.liked ? "green" : ""} />
        </ActionIcon>
      </Tooltip>
    ),
    [likeVideo, likedDate, loading, unLikeVideo, video.id, video.liked]
  );
};

export const VideoQueueButton = (props: VideoButtonsProps) => {
  const { video } = props;

  const [queueVideo, queueVideoStatus] = useAddYoutubeVideoQueueMutation();
  const [unQueueVideo, unQueueVideoStatus] = useDeleteYoutubeVideoQueueMutation();

  const loading = useMemo(
    () => queueVideoStatus.isLoading || unQueueVideoStatus.isLoading,
    [queueVideoStatus.isLoading, unQueueVideoStatus.isLoading]
  );

  return useMemo(
    () => (
      <Tooltip label={video.queued ? "Unqueue" : "Queue"}>
        <ActionIcon loading={loading} onClick={() => (video.queued ? unQueueVideo(video.id) : queueVideo(video.id))}>
          {video.queued ? <MdRemoveFromQueue size={25} color="red" /> : <MdAddToQueue size={25} />}
        </ActionIcon>
      </Tooltip>
    ),
    [loading, queueVideo, unQueueVideo, video.id, video.queued]
  );
};

export const VideoWatchButton = (props: VideoButtonsProps) => {
  const { video } = props;

  const watchedDate = video.watched ? new Date(video.watched).toLocaleDateString() : "";

  return useMemo(
    () =>
      video.watched ? (
        <Tooltip label={`Watched on ${watchedDate}`}>
          <ActionIcon>
            <MdVisibility size={25} />
          </ActionIcon>
        </Tooltip>
      ) : null,
    [video.watched, watchedDate]
  );
};
