import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

import { buildURL } from '../config';

export const Methods = {
	POST: 'POST',
	GET: 'GET',
	DELETE: 'DELETE',
	PUT: 'PUT',
};

export const Tags = {
	USER: 'User',
	MUSIC_JOB: 'MusicJob',
	MUSIC_GROUPING: 'MusicGrouping',
	MUSIC_ARTWORK: 'MusicArtwork',
	MUSIC_TAGS: 'MusicTags',
	MUSIC_DOWNLOAD: 'MusicDownload',
	YOUTUBE_AUTH: 'YoutubeAuth',
	YOUTUBE_VIDEO: 'YoutubeVideo',
	YOUTUBE_VIDEO_CATEGORY: 'YoutubeVideoCategory',
	YOUTUBE_SUBSCRIPTION: 'YoutubeSubscription',
	YOUTUBE_CHANNEL: 'YoutubeChannel',
};

export const tags = [
	Tags.USER,
	Tags.MUSIC_ARTWORK,
	Tags.MUSIC_DOWNLOAD,
	Tags.MUSIC_GROUPING,
	Tags.MUSIC_JOB,
	Tags.MUSIC_TAGS,
	Tags.YOUTUBE_AUTH,
	Tags.YOUTUBE_CHANNEL,
	Tags.YOUTUBE_SUBSCRIPTION,
	Tags.YOUTUBE_VIDEO,
	Tags.YOUTUBE_VIDEO_CATEGORY,
];

const isErrorWithMessage = (error: any): error is { detail: string } =>
	typeof error === 'object' && error != null && 'detail' in error && typeof (error as any).detail === 'string';

export const transformErrorResponse = (response: FetchBaseQueryError) => {
	if (isErrorWithMessage(response.data)) {
		return response.data.detail;
	}
	return response.data;
};

const api = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: buildURL('api'), credentials: 'include' }),
	tagTypes: tags,
	endpoints: (build) => ({}),
});

export default api;
