import { useCallback, useEffect, useMemo } from 'react';
import {
	Box,
	Button,
	Container,
	Divider,
	FileInput,
	Flex,
	Image,
	Loader,
	Stack,
	Switch,
	TextInput,
	Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useForm, Controller, useWatch } from 'react-hook-form';

import {
	useLazyCreateFileJobQuery,
	useLazyCreateYoutubeJobQuery,
	useLazyArtworkQuery,
	useLazyTagsQuery,
	useLazyGroupingQuery,
} from '../../api/music';
import { isBase64, isValidImage, isValidLink, isValidYTLink, resolveAlbumFromTitle } from '../../utils/helpers';

const MusicForm = () => {
	const { reset, handleSubmit, control, trigger, setValue } = useForm<MusicFormState>({
		reValidateMode: 'onBlur',
	});
	const watchFields = useWatch({ control });

	const [debouncedArtworkUrl] = useDebouncedValue(watchFields.artworkUrl, 500);
	const [debouncedYoutubeUrl] = useDebouncedValue(watchFields.youtubeUrl, 500);

	const [createFileJob, createFileJobStatus] = useLazyCreateFileJobQuery();
	const [createYoutubeJob, createYoutubeJobStatus] = useLazyCreateYoutubeJobQuery();
	const [getArtwork, getArtworkStatus] = useLazyArtworkQuery();
	const [getTags, getTagsStatus] = useLazyTagsQuery();
	const [getGrouping, getGroupingStatus] = useLazyGroupingQuery();

	const artworkLoading = useMemo(
		() => getArtworkStatus.isLoading || getArtworkStatus.isFetching,
		[getArtworkStatus.isFetching, getArtworkStatus.isLoading]
	);

	const tagsLoading = useMemo(
		() => getTagsStatus.isLoading || getTagsStatus.isFetching,
		[getTagsStatus.isFetching, getTagsStatus.isLoading]
	);

	const jobLoading = useMemo(
		() =>
			createFileJobStatus.isLoading ||
			createFileJobStatus.isFetching ||
			createYoutubeJobStatus.isLoading ||
			createYoutubeJobStatus.isFetching,
		[
			createFileJobStatus.isFetching,
			createFileJobStatus.isLoading,
			createYoutubeJobStatus.isFetching,
			createYoutubeJobStatus.isLoading,
		]
	);

	const groupingLoading = useMemo(
		() => getGroupingStatus.isLoading || getGroupingStatus.isFetching,
		[getGroupingStatus.isFetching, getGroupingStatus.isLoading]
	);

	const onSubmit = useCallback(
		async (data: MusicFormState) => {
			const successNotification = () =>
				showNotification({
					title: 'Success',
					message: 'Job Created Successfully',
					color: 'green',
				});
			const errorNotification = () =>
				showNotification({
					title: 'Error',
					message: 'Job Failed to Start',
					color: 'red',
				});

			if (data.fileSwitch) {
				const status = await createFileJob(data);
				if (status.isSuccess) {
					reset();
					successNotification();
				} else if (status.isError) {
					errorNotification();
				}
			} else {
				const status = await createYoutubeJob(data);
				if (status.isSuccess) {
					reset();
					successNotification();
				} else if (status.isError) {
					errorNotification();
				}
			}
		},
		[createFileJob, createYoutubeJob, reset]
	);

	const resolveArtworkUrl = useCallback(
		async (artworkUrl: string) => {
			if (artworkUrl) {
				if (isBase64(artworkUrl) || isValidImage(artworkUrl)) {
					return setValue('resolvedArtworkUrl', artworkUrl);
				} else if (isValidLink(artworkUrl)) {
					const status = await getArtwork(artworkUrl);
					if (status.isSuccess) {
						const { artworkUrl } = status.data;
						return setValue('resolvedArtworkUrl', artworkUrl);
					}
				}
			}
			return setValue('resolvedArtworkUrl', '');
		},
		[getArtwork, setValue]
	);

	useEffect(() => {
		resolveArtworkUrl(debouncedArtworkUrl || '');
	}, [debouncedArtworkUrl, resolveArtworkUrl]);

	const getFileTags = useCallback(
		async (file: File) => {
			const status = await getTags(file);
			if (status.isSuccess) {
				const { title, artist, album, grouping, artworkUrl } = status.data;
				if (title) {
					setValue('title', title);
				}
				if (artist) {
					setValue('artist', artist);
				}
				if (album) {
					setValue('album', album);
				}
				if (grouping) {
					setValue('grouping', grouping);
				}
				if (artworkUrl) {
					setValue('artworkUrl', artworkUrl);
				}
				trigger();
			}
		},
		[getTags, setValue, trigger]
	);

	useEffect(() => {
		if (watchFields.file) {
			getFileTags(watchFields.file);
		}
	}, [getFileTags, watchFields.file]);

	useEffect(() => {
		if (watchFields.title) {
			setValue('album', resolveAlbumFromTitle(watchFields.title));
		}
	}, [setValue, watchFields.title]);

	const resolveGrouping = useCallback(
		async (youtubeUrl: string) => {
			if (youtubeUrl) {
				if (isValidYTLink(youtubeUrl)) {
					const status = await getGrouping(youtubeUrl);
					if (status.isSuccess) {
						const { grouping } = status.data;
						setValue('grouping', grouping);
					}
				}
			}
		},
		[getGrouping, setValue]
	);

	useEffect(() => {
		resolveGrouping(debouncedYoutubeUrl || '');
	}, [debouncedYoutubeUrl, resolveGrouping]);

	return useMemo(
		() => (
			<Stack>
				<Title order={2}>Music Downloader / Converter</Title>
				<Divider />
				<Container fluid w={{ base: '100%', sm: 1500 }}>
					<Box component="form" onSubmit={handleSubmit(onSubmit)}>
						<Stack>
							<Flex align="center">
								<Controller
									name="youtubeUrl"
									control={control}
									defaultValue={''}
									rules={{
										required: !watchFields.fileSwitch,
										pattern: /^http(s?):\/\/(www\.)?youtube\.com\/watch\?v=.+/,
									}}
									render={({ field, fieldState }) => {
										let error = '';
										if (fieldState.error?.type === 'pattern') {
											error = 'Invalid YouTube Link';
										} else if (fieldState.error?.type === 'required') {
											error = 'Required';
										}

										return (
											<TextInput
												sx={{ width: '100%' }}
												{...field}
												error={error}
												label="Youtube URL"
												placeholder="Enter Youtube URL"
												disabled={watchFields.fileSwitch}
												required={!watchFields.fileSwitch}
											/>
										);
									}}
								/>
								<Controller
									name="fileSwitch"
									control={control}
									defaultValue={false}
									render={({ field }) => <Switch {...field} value="" checked={field.value} />}
								/>
								<Controller
									name="file"
									control={control}
									defaultValue={null}
									rules={{ required: watchFields.fileSwitch }}
									render={({ field, fieldState }) => {
										let error = '';
										if (fieldState.error?.type === 'required') {
											error = 'Required';
										}
										return (
											<FileInput
												sx={{ width: '100%' }}
												{...field}
												error={error}
												label="Filename"
												placeholder="Select File"
												required={watchFields.fileSwitch}
												disabled={!watchFields.fileSwitch}
												accept="audio/mpeg,audio/wav"
											/>
										);
									}}
								/>
							</Flex>
							<Flex align="center">
								<Box w="100%">
									<Image
										alt="blank"
										src={
											watchFields.resolvedArtworkUrl ||
											'https://dripdrop-space.nyc3.digitaloceanspaces.com/artwork/blank_image.jpeg'
										}
										withPlaceholder
									/>
								</Box>
								<Stack justify="center" spacing="md" w="100%">
									<Controller
										name="artworkUrl"
										control={control}
										defaultValue={''}
										render={({ field, fieldState }) => (
											<TextInput
												{...field}
												error={fieldState.error}
												label="Artwork URL"
												placeholder="Enter Artwork URL"
												disabled={tagsLoading}
											/>
										)}
									/>
									<Controller
										name="resolvedArtworkUrl"
										control={control}
										defaultValue={''}
										render={({ field, fieldState }) => (
											<TextInput
												{...field}
												error={fieldState.error}
												label="Resolved Artwork URL"
												disabled
												rightSection={artworkLoading || tagsLoading ? <Loader size="xs" /> : null}
											/>
										)}
									/>
									<Button onClick={() => setValue('artworkUrl', '')}>Clear</Button>
								</Stack>
							</Flex>
							<Flex>
								<Controller
									name="title"
									control={control}
									defaultValue={''}
									rules={{ required: true }}
									render={({ field, fieldState }) => {
										let error = '';
										if (fieldState.error?.type === 'required') {
											error = 'Required';
										}
										return (
											<TextInput
												sx={{ width: '100%' }}
												{...field}
												error={error}
												label="Title"
												placeholder="Enter Title"
												withAsterisk
												disabled={tagsLoading}
												rightSection={tagsLoading ? <Loader size="xs" /> : null}
											/>
										);
									}}
								/>
								<Controller
									name="artist"
									control={control}
									defaultValue={''}
									rules={{ required: true }}
									render={({ field, fieldState }) => {
										let error = '';
										if (fieldState.error?.type === 'required') {
											error = 'Required';
										}
										return (
											<TextInput
												sx={{ width: '100%' }}
												{...field}
												error={error}
												label="Artist"
												placeholder="Enter Artist"
												withAsterisk
												disabled={tagsLoading}
												rightSection={tagsLoading ? <Loader size="xs" /> : null}
											/>
										);
									}}
								/>
								<Controller
									name="album"
									control={control}
									defaultValue={''}
									rules={{ required: true }}
									render={({ field, fieldState }) => {
										let error = '';
										if (fieldState.error?.type === 'required') {
											error = 'Required';
										}
										return (
											<TextInput
												sx={{ width: '100%' }}
												{...field}
												error={error}
												label="Album"
												placeholder="Enter Album"
												withAsterisk
												disabled={tagsLoading}
												rightSection={tagsLoading ? <Loader size="xs" /> : null}
											/>
										);
									}}
								/>
								<Controller
									name="grouping"
									control={control}
									defaultValue={''}
									render={({ field }) => (
										<TextInput
											sx={{ width: '100%' }}
											{...field}
											label="Grouping"
											placeholder="Enter Grouping"
											disabled={tagsLoading || groupingLoading}
											rightSection={tagsLoading || groupingLoading ? <Loader size="xs" /> : null}
										/>
									)}
								/>
							</Flex>
							<Flex justify="center">
								<Button disabled={artworkLoading || tagsLoading || groupingLoading} loading={jobLoading} type="submit">
									Download / Convert
								</Button>
								<Button onClick={() => reset()}>Reset</Button>
							</Flex>
						</Stack>
					</Box>
				</Container>
			</Stack>
		),
		[
			handleSubmit,
			onSubmit,
			control,
			watchFields.fileSwitch,
			watchFields.resolvedArtworkUrl,
			artworkLoading,
			tagsLoading,
			groupingLoading,
			jobLoading,
			setValue,
			reset,
		]
	);
};

export default MusicForm;
