import { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { FetchBaseQueryArgs } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';
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

export const errorParser = (error: ErrorResponse | undefined) => {
	if (error && error.detail) {
		if (typeof error.detail === 'string') {
			return error.detail;
		} else if (typeof error.detail === 'object') {
			return error.detail.reduce((msg, error) => {
				const field = error.loc.pop();
				if (field) {
					let message = error.msg.replace('value', field);
					message = message.charAt(0).toLocaleUpperCase() + message.substring(1);
					msg = !msg ? message : `${msg}, ${message}`;
				}
				return msg;
			}, '');
		}
	}
	return error;
};

const customBaseQuery = (options?: FetchBaseQueryArgs) => {
	const fetch = fetchBaseQuery(options);
	return async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
		const response = await fetch(args, api, extraOptions);
		let error;
		if (response.error) {
			if (response.error.status === 401 && api.endpoint !== 'checkSession') {
				window.history.pushState({}, '', new URL(window.location.host));
			} else if (response.error.data) {
				error = response.error.data as ErrorResponse;
				error = errorParser(error);
				response.error.data = error;
			}
		}
		return response;
	};
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

const api = createApi({
	baseQuery: customBaseQuery({ baseUrl: buildURL('api'), credentials: 'include' }),
	tagTypes: tags,
	endpoints: (build) => ({}),
});

export default api;
