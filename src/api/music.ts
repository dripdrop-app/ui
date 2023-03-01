import api, { Tags, Methods } from '.';
import { buildWebsocketURL } from '../config';

const musicApi = api.injectEndpoints({
	endpoints: (build) => ({
		grouping: build.query<GroupingResponse, string>({
			query: (videoUrl) => ({ url: `/music/grouping`, method: Methods.GET, params: { video_url: videoUrl } }),
			providesTags: [Tags.MUSIC_GROUPING],
		}),
		artwork: build.query<ResolvedArtworkResponse, string>({
			query: (artworkUrl) => ({ url: `/music/artwork`, method: Methods.GET, params: { artwork_url: artworkUrl } }),
			providesTags: [Tags.MUSIC_ARTWORK],
		}),
		tags: build.query<TagsResponse, File>({
			query: (file) => {
				const formData = new FormData();
				formData.append('file', file);
				return { url: '/music/tags', method: Methods.POST, body: formData };
			},
			providesTags: [Tags.MUSIC_TAGS],
		}),
		jobs: build.query<JobsResponse, PageBody>({
			query: ({ page, perPage }) => ({ url: `/music/jobs/${page}/${perPage}`, method: Methods.GET }),
			providesTags: (result) => {
				if (result) {
					const { jobs } = result;
					if (jobs.length > 0) {
						return jobs.map((job) => ({ type: Tags.MUSIC_JOB, id: job.id }));
					}
				}
				return [Tags.MUSIC_JOB];
			},
		}),
		listenJobs: build.query<null, void>({
			queryFn: () => ({ data: null }),
			onCacheEntryAdded: async (args, { cacheDataLoaded, cacheEntryRemoved, dispatch }) => {
				const url = buildWebsocketURL('music/jobs/listen');
				const ws = new WebSocket(url);
				try {
					await cacheDataLoaded;
					ws.onmessage = (event) => {
						const json = JSON.parse(event.data);
						const status = json.status;
						if (status === 'STARTED') {
							dispatch(musicApi.util.invalidateTags([Tags.MUSIC_JOB]));
						} else if (status === 'COMPLETED') {
							dispatch(musicApi.util.invalidateTags([{ type: Tags.MUSIC_JOB, id: json.job.id }]));
						}
					};
				} catch (e) {
					console.error(e);
				}
				await cacheEntryRemoved;
				ws.close();
			},
		}),
		removeJob: build.mutation<undefined, string>({
			query: (jobId) => ({
				url: `/music/jobs/delete`,
				params: { job_id: jobId },
				method: Methods.DELETE,
			}),
			invalidatesTags: (result, error, jobId) => {
				if (!error) {
					return [{ type: Tags.MUSIC_JOB, id: jobId }];
				}
				return [];
			},
		}),
		createFileJob: build.query<undefined, CreateFileJobBody>({
			query: (args) => {
				const formData = new FormData();
				formData.append('file', args.file);
				formData.append('artwork_url', args.artworkUrl);
				formData.append('title', args.title);
				formData.append('artist', args.artist);
				formData.append('album', args.album);
				if (args.grouping) {
					formData.append('grouping', args.grouping);
				}
				return { url: '/music/jobs/create', method: Methods.POST, body: formData };
			},
		}),
		createVideoJob: build.query<undefined, CreateVideoJobBody>({
			query: (args) => {
				const formData = new FormData();
				formData.append('video_url', args.videoUrl);
				formData.append('artwork_url', args.artworkUrl);
				formData.append('title', args.title);
				formData.append('artist', args.artist);
				formData.append('album', args.album);
				if (args.grouping) {
					formData.append('grouping', args.grouping);
				}
				return { url: '/music/jobs/create', method: Methods.POST, body: formData };
			},
		}),
	}),
});

export default musicApi;
export const {
	useLazyArtworkQuery,
	useLazyGroupingQuery,
	useLazyTagsQuery,
	useLazyCreateFileJobQuery,
	useLazyCreateVideoJobQuery,
	useJobsQuery,
	useListenJobsQuery,
	useRemoveJobMutation,
} = musicApi;
