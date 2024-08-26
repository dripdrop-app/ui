import { createApi, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

import { buildURL } from "../config";

export type TagsArray = (string | { type: string; id?: string })[];

export const Methods = {
  POST: "POST",
  GET: "GET",
  DELETE: "DELETE",
  PUT: "PUT",
};

export const Tags = {
  MUSIC_JOB: "MusicJob",
  MUSIC_GROUPING: "MusicGrouping",
  MUSIC_ARTWORK: "MusicArtwork",
  MUSIC_TAGS: "MusicTags",
  MUSIC_DOWNLOAD: "MusicDownload",
  YOUTUBE_CHANNEL: "YoutubeChannel",
  YOUTUBE_USER_CHANNEL: "YoutubeUserChannel",
  YOUTUBE_CHANNEL_VIDEOS: "YoutubeChannelVideos",
  YOUTUBE_SUBSCRIPTION: "YoutubeSubscription",
  YOUTUBE_VIDEO: "YoutubeVideo",
  YOUTUBE_VIDEO_CATEGORY: "YoutubeVideoCategory",
  YOUTUBE_LIKE_VIDEOS: "YoutubeLikeVideos",
  YOUTUBE_QUEUE_VIDEOS: "YoutubeQueueVideos",
  USER: "User",
};

export const tags = [
  Tags.MUSIC_ARTWORK,
  Tags.MUSIC_DOWNLOAD,
  Tags.MUSIC_GROUPING,
  Tags.MUSIC_JOB,
  Tags.MUSIC_TAGS,
  Tags.YOUTUBE_CHANNEL,
  Tags.YOUTUBE_USER_CHANNEL,
  Tags.YOUTUBE_CHANNEL_VIDEOS,
  Tags.YOUTUBE_SUBSCRIPTION,
  Tags.YOUTUBE_VIDEO,
  Tags.YOUTUBE_VIDEO_CATEGORY,
  Tags.YOUTUBE_LIKE_VIDEOS,
  Tags.YOUTUBE_QUEUE_VIDEOS,
  Tags.USER,
];

const isErrorWithMessage = (error: any): error is { detail: string } =>
  typeof error === "object" && error != null && "detail" in error && typeof (error as any).detail === "string";

export const transformErrorResponse = (response: FetchBaseQueryError) => {
  if (isErrorWithMessage(response.data)) {
    return response.data.detail;
  }
  return response.data;
};

const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: buildURL("api"), credentials: "include" }),
  tagTypes: tags,
  refetchOnMountOrArgChange: 60,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});

export default api;
