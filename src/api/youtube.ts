import api from '.';

const youtubeApi = api.injectEndpoints({
	endpoints: (build) => ({
		checkYoutubeAuth: build.query<YoutubeAuthState, void>({
			query: () => ({ url: '/youtube/account', method: Methods.GET }),
			providesTags: [Tags.YOUTUBE_AUTH],
		}),
		getOauthLink: build.query<string, void>({
			query: () => ({ url: '/youtube/oauth', method: Methods.GET, responseHandler: (response) => response.text() }),
		}),
		youtubeVideoCategories: build.query<YoutubeVideoCategoriesResponse, ChannelBody>({
			query: ({ channelId }) => ({
				url: '/youtube/videos/categories',
				method: Methods.GET,
				params: { channel_id: channelId },
			}),
			providesTags: (result) => {
				if (result) {
					return result.categories.map((category) => ({ type: Tags.YOUTUBE_VIDEO_CATEGORY, id: category.id }));
				}
				return [];
			},
		}),
		youtubeVideo: build.query<YoutubeVideoResponse, YoutubeVideoBody>({
			query: ({ videoId, relatedLength }) => ({
				url: '/youtube/videos',
				method: Methods.GET,
				params: { video_id: videoId, related_videos_length: relatedLength },
			}),
			providesTags: (result) => {
				if (result) {
					return [{ type: Tags.YOUTUBE_VIDEO, id: result.video.id }].concat(
						result.relatedVideos.map((video) => ({ type: Tags.YOUTUBE_VIDEO, id: video.id }))
					);
				}
				return [];
			},
		}),
		youtubeVideos: build.query<YoutubeVideosResponse, YoutubeVideosBody>({
			query: ({ perPage, page, channelId, selectedCategories, likedOnly, queuedOnly }) => ({
				url: `/youtube/videos/${page}/${perPage}`,
				method: Methods.GET,
				params: {
					channel_id: channelId,
					video_categories: selectedCategories.length === 0 ? undefined : selectedCategories,
					liked_only: likedOnly,
					queued_only: queuedOnly,
				},
			}),
			providesTags: (result, error, args) => {
				if (result) {
					const tags = [];
					if (args.likedOnly) {
						tags.push({ type: Tags.YOUTUBE_VIDEO_LIKE });
					}
					if (args.queuedOnly) {
						tags.push({ type: Tags.YOUTUBE_VIDEO_QUEUE });
					}
					return tags.concat(result.videos.map((video) => ({ type: Tags.YOUTUBE_VIDEO, id: video.id })));
				}
				return [];
			},
		}),
		youtubeSubscriptions: build.query<YoutubeSubscriptionsResponse, YoutubeSubscriptionBody>({
			query: ({ perPage, page, channelId }) => ({
				url: `/youtube/subscriptions/${page}/${perPage}`,
				method: Methods.GET,
				params: { channel_id: channelId },
			}),
			providesTags: (result) => {
				if (result) {
					return result.subscriptions.map((subscription) => ({ type: Tags.YOUTUBE_SUBSCRIPTION, id: subscription.id }));
				}
				return [];
			},
		}),
		addYoutubeVideoLike: build.mutation<undefined, string>({
			query: (videoId) => ({ url: `/youtube/videos/like`, params: { video_id: videoId }, method: Methods.PUT }),
			invalidatesTags: (result, error, videoId) => {
				if (!error) {
					return [{ type: Tags.YOUTUBE_VIDEO_LIKE, id: videoId }, { type: Tags.YOUTUBE_VIDEO_LIKE }];
				}
				return [];
			},
		}),
		deleteYoutubeVideoLike: build.mutation<undefined, string>({
			query: (videoId) => ({
				url: `/youtube/videos/like`,
				params: { video_id: videoId },
				method: Methods.DELETE,
			}),
			invalidatesTags: (result, error, videoId) => {
				if (!error) {
					return [{ type: Tags.YOUTUBE_VIDEO, id: videoId }, { type: Tags.YOUTUBE_VIDEO_LIKE }];
				}
				return [];
			},
		}),
		addYoutubeVideoQueue: build.mutation<undefined, string>({
			query: (videoId) => ({
				url: `/youtube/videos/queue`,
				params: { video_id: videoId },
				method: Methods.PUT,
			}),
			invalidatesTags: (result, error, videoId) => {
				if (!error) {
					return [
						{ type: Tags.YOUTUBE_VIDEO, id: videoId },
						{ type: Tags.YOUTUBE_VIDEO_QUEUE },
						{ type: Tags.YOUTUBE_VIDEO_QUEUE_INDEX },
					];
				}
				return [];
			},
		}),
		deleteYoutubeVideoQueue: build.mutation<undefined, string>({
			query: (videoId) => ({
				url: `/youtube/videos/queue`,
				params: { video_id: videoId },
				method: Methods.DELETE,
			}),
			invalidatesTags: (result, error, videoId) => {
				if (!error) {
					return [
						{ type: Tags.YOUTUBE_VIDEO, id: videoId },
						{ type: Tags.YOUTUBE_VIDEO_QUEUE },
						{ type: Tags.YOUTUBE_VIDEO_QUEUE_INDEX },
					];
				}
				return [];
			},
		}),
		addYoutubeVideoWatch: build.mutation<undefined, string>({
			query: (videoId) => ({
				url: `/youtube/videos/watch`,
				params: { video_id: videoId },
				method: Methods.PUT,
			}),
			invalidatesTags: (result, error, videoId) => {
				if (!error) {
					return [{ type: Tags.YOUTUBE_VIDEO, id: videoId }];
				}
				return [];
			},
		}),
		youtubeVideoQueue: build.query<YoutubeVideoQueueResponse, number>({
			query: (index) => ({ url: `/youtube/videos/queue`, params: { index }, method: Methods.GET }),
			providesTags: (result) => {
				const tags = [{ type: Tags.YOUTUBE_VIDEO_QUEUE_INDEX }] as any[];
				if (result) {
					tags.push({ type: Tags.YOUTUBE_VIDEO, id: result.currentVideo.id });
				}
				return tags;
			},
		}),
		youtubeChannel: build.query<YoutubeChannel, string>({
			query: (channelID) => ({ url: '/youtube/channels', params: { channel_id: channelID }, method: Methods.GET }),
			providesTags: (result) => {
				if (result) {
					return [{ type: Tags.YOUTUBE_CHANNEL, id: result.id }];
				}
				return [];
			},
		}),
	}),
});

export default youtubeApi;
export const {
	useCheckYoutubeAuthQuery,
	useLazyGetOauthLinkQuery,
	useYoutubeVideoCategoriesQuery,
	useYoutubeVideoQuery,
	useYoutubeVideosQuery,
	useYoutubeVideoQueueQuery,
	useYoutubeSubscriptionsQuery,
	useAddYoutubeVideoLikeMutation,
	useDeleteYoutubeVideoLikeMutation,
	useAddYoutubeVideoQueueMutation,
	useDeleteYoutubeVideoQueueMutation,
	useYoutubeChannelQuery,
	useAddYoutubeVideoWatchMutation,
} = youtubeApi;
