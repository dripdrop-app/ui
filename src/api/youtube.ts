import api, { Tags, Methods, TagsArray, transformErrorResponse } from '.';

const youtubeApi = api.injectEndpoints({
	endpoints: (build) => ({
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
			providesTags: (result, _, args) => {
				const tags = [];
				if (result) {
					tags.push(...result.videos.map((video) => ({ type: Tags.YOUTUBE_VIDEO, id: video.id })));
				}
				if (args.likedOnly) {
					tags.push(Tags.YOUTUBE_VIDEO_LIKE);
				} else if (args.queuedOnly) {
					tags.push(Tags.YOUTUBE_VIDEO_QUEUE);
				}
				return tags;
			},
		}),
		youtubeSubscriptions: build.query<YoutubeSubscriptionsResponse, YoutubeSubscriptionBody>({
			query: ({ perPage, page }) => ({
				url: `/youtube/subscriptions/${page}/${perPage}`,
				method: Methods.GET,
			}),
			providesTags: (result) => {
				if (result) {
					return result.subscriptions.map((subscription) => ({
						type: Tags.YOUTUBE_SUBSCRIPTION,
						id: subscription.channelId,
					}));
				}
				return [];
			},
		}),
		addYoutubeSubscription: build.mutation<YoutubeSubscriptionResponse, string>({
			query: (channelId) => ({
				url: '/youtube/subscriptions/user',
				params: { channel_id: channelId },
				method: Methods.PUT,
			}),
			invalidatesTags: (result) => {
				if (result) {
					return [Tags.YOUTUBE_SUBSCRIPTION, { type: Tags.YOUTUBE_CHANNEL, id: result.channelId }];
				}
				return [];
			},
			transformErrorResponse,
		}),
		removeSubscription: build.mutation<undefined, string>({
			query: (channelId) => ({
				url: '/youtube/subscriptions/user',
				params: { channel_id: channelId },
				method: Methods.DELETE,
			}),
			invalidatesTags: (_, error, channelId) => {
				if (!error) {
					return [{ type: Tags.YOUTUBE_SUBSCRIPTION, id: channelId }];
				}
				return [];
			},
		}),
		addYoutubeVideoLike: build.mutation<undefined, string>({
			query: (videoId) => ({ url: '/youtube/videos/like', params: { video_id: videoId }, method: Methods.PUT }),
			invalidatesTags: (_, error, videoId) => {
				if (!error) {
					return [{ type: Tags.YOUTUBE_VIDEO, id: videoId }, Tags.YOUTUBE_VIDEO_LIKE];
				}
				return [];
			},
		}),
		deleteYoutubeVideoLike: build.mutation<undefined, string>({
			query: (videoId) => ({
				url: '/youtube/videos/like',
				params: { video_id: videoId },
				method: Methods.DELETE,
			}),
			invalidatesTags: (_, error, videoId) => {
				if (!error) {
					return [{ type: Tags.YOUTUBE_VIDEO, id: videoId }];
				}
				return [];
			},
		}),
		addYoutubeVideoQueue: build.mutation<undefined, string>({
			query: (videoId) => ({
				url: '/youtube/videos/queue',
				params: { video_id: videoId },
				method: Methods.PUT,
			}),
			invalidatesTags: (_, error, videoId) => {
				if (!error) {
					return [{ type: Tags.YOUTUBE_VIDEO, id: videoId }, Tags.YOUTUBE_VIDEO_QUEUE];
				}
				return [];
			},
		}),
		deleteYoutubeVideoQueue: build.mutation<undefined, string>({
			query: (videoId) => ({
				url: '/youtube/videos/queue',
				params: { video_id: videoId },
				method: Methods.DELETE,
			}),
			invalidatesTags: (_, error, videoId) => {
				if (!error) {
					return [{ type: Tags.YOUTUBE_VIDEO, id: videoId }];
				}
				return [];
			},
		}),
		addYoutubeVideoWatch: build.mutation<undefined, string>({
			query: (videoId) => ({
				url: '/youtube/videos/watch',
				params: { video_id: videoId },
				method: Methods.PUT,
			}),
			invalidatesTags: (_, error, videoId) => {
				if (!error) {
					return [{ type: Tags.YOUTUBE_VIDEO, id: videoId }];
				}
				return [];
			},
		}),
		youtubeVideoQueue: build.query<YoutubeVideoQueueResponse, number>({
			query: (index) => ({ url: '/youtube/videos/queue', params: { index }, method: Methods.GET }),
			providesTags: (result) => {
				const tags: TagsArray = [Tags.YOUTUBE_VIDEO_QUEUE];
				if (result) {
					tags.push({ type: Tags.YOUTUBE_VIDEO, id: result.currentVideo.id });
				}
				return tags;
			},
		}),
		youtubeChannel: build.query<YoutubeChannelResponse, string>({
			query: (channelId) => ({ url: '/youtube/channels', params: { channel_id: channelId }, method: Methods.GET }),
			providesTags: (result) => {
				if (result) {
					const tags = [{ type: Tags.YOUTUBE_CHANNEL, id: result.id }];
					if (result.subscribed) {
						tags.push({ type: Tags.YOUTUBE_SUBSCRIPTION, id: result.id });
					}
					return tags;
				}
				return [];
			},
		}),
		userYoutubeChannel: build.query<YoutubeUserChannel, void>({
			query: () => ({ url: '/youtube/channels/user', method: Methods.GET }),
			providesTags: () => [Tags.YOUTUBE_USER_CHANNEL],
		}),
		updateUserYoutubeChannel: build.mutation<undefined, string>({
			query: (channelId) => ({ url: '/youtube/channels/user', body: { channel_id: channelId }, method: Methods.POST }),
			invalidatesTags: (_, error) => {
				if (!error) {
					return [Tags.YOUTUBE_USER_CHANNEL];
				}
				return [];
			},
			transformErrorResponse,
		}),
	}),
});

export default youtubeApi;
export const {
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
	useUpdateUserYoutubeChannelMutation,
	useUserYoutubeChannelQuery,
	useAddYoutubeSubscriptionMutation,
	useRemoveSubscriptionMutation,
} = youtubeApi;
