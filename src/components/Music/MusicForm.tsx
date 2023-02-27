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
	Text,
	TextInput,
	Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useForm, Controller, useWatch } from 'react-hook-form';

import {
	useLazyCreateFileJobQuery,
	useLazyCreateVideoJobQuery,
	useLazyArtworkQuery,
	useLazyTagsQuery,
	useLazyGroupingQuery,
} from '../../api/music';
import { isBase64, isValidImage, isValidLink, resolveAlbumFromTitle } from '../../utils/helpers';

const MusicForm = () => {
	const { reset, handleSubmit, control, trigger, setValue } = useForm<MusicFormState>({
		reValidateMode: 'onBlur',
	});
	const watchFields = useWatch({ control });

	const [debouncedArtworkUrl] = useDebouncedValue(watchFields.artworkUrl, 500);
	const [debouncedVideoUrl] = useDebouncedValue(watchFields.videoUrl, 500);

	const [createFileJob, createFileJobStatus] = useLazyCreateFileJobQuery();
	const [createVideoJob, createVideoJobStatus] = useLazyCreateVideoJobQuery();
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
			createVideoJobStatus.isLoading ||
			createVideoJobStatus.isFetching,
		[
			createFileJobStatus.isFetching,
			createFileJobStatus.isLoading,
			createVideoJobStatus.isFetching,
			createVideoJobStatus.isLoading,
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

			if (data.isFile) {
				const status = await createFileJob({ ...data, artworkUrl: data.resolvedArtworkUrl });
				if (status.isSuccess) {
					reset();
					successNotification();
				} else if (status.isError) {
					errorNotification();
				}
			} else {
				const status = await createVideoJob({ ...data, artworkUrl: data.resolvedArtworkUrl });
				if (status.isSuccess) {
					reset();
					successNotification();
				} else if (status.isError) {
					errorNotification();
				}
			}
		},
		[createFileJob, createVideoJob, reset]
	);

	const resolveArtworkUrl = useCallback(
		async (artworkUrl: string) => {
			if (artworkUrl) {
				if (isBase64(artworkUrl) || isValidImage(artworkUrl)) {
					return setValue('resolvedArtworkUrl', artworkUrl);
				} else if (isValidLink(artworkUrl)) {
					const status = await getArtwork(artworkUrl);
					if (status.isSuccess) {
						const { resolvedArtworkUrl } = status.data;
						return setValue('resolvedArtworkUrl', resolvedArtworkUrl);
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
		async (videoUrl: string) => {
			if (videoUrl) {
				if (isValidLink(videoUrl)) {
					const status = await getGrouping(videoUrl);
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
		resolveGrouping(debouncedVideoUrl || '');
	}, [debouncedVideoUrl, resolveGrouping]);

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
									name="videoUrl"
									control={control}
									defaultValue={''}
									rules={{
										required: !watchFields.isFile,
										validate: (v) => (!watchFields.isFile ? isValidLink(v) : true),
									}}
									render={({ field, fieldState }) => {
										let error = '';
										if (fieldState.error?.type === 'validate') {
											error = 'Invalid Link';
										} else if (fieldState.error?.type === 'required') {
											error = 'Required';
										}
										return (
											<TextInput
												sx={{ width: '100%' }}
												{...field}
												error={error}
												label="Video URL"
												placeholder="Enter Video URL"
												disabled={watchFields.isFile}
												required={!watchFields.isFile}
											/>
										);
									}}
								/>
								<Controller
									name="isFile"
									control={control}
									defaultValue={false}
									render={({ field }) => <Switch {...field} value="" checked={field.value} />}
								/>
								<Controller
									name="file"
									control={control}
									defaultValue={null}
									rules={{ required: watchFields.isFile }}
									render={({ field, fieldState }) => (
										<FileInput
											sx={{ width: '100%' }}
											{...field}
											error={fieldState.error?.type === 'required' ? 'Required' : ''}
											label="Filename"
											placeholder="Select File"
											required={watchFields.isFile}
											disabled={!watchFields.isFile}
											accept="audio/mpeg,audio/wav"
										/>
									)}
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
												error={fieldState.error?.message}
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
												error={fieldState.error?.message}
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
									render={({ field, fieldState }) => (
										<TextInput
											sx={{ width: '100%' }}
											{...field}
											error={fieldState.error?.type === 'required' ? 'Required' : ''}
											label="Title"
											placeholder="Enter Title"
											withAsterisk
											disabled={tagsLoading}
											rightSection={tagsLoading ? <Loader size="xs" /> : null}
										/>
									)}
								/>
								<Controller
									name="artist"
									control={control}
									defaultValue={''}
									rules={{ required: true }}
									render={({ field, fieldState }) => (
										<TextInput
											sx={{ width: '100%' }}
											{...field}
											error={fieldState.error?.type === 'required' ? 'Required' : ''}
											label="Artist"
											placeholder="Enter Artist"
											withAsterisk
											disabled={tagsLoading}
											rightSection={tagsLoading ? <Loader size="xs" /> : null}
										/>
									)}
								/>
								<Controller
									name="album"
									control={control}
									defaultValue={''}
									rules={{ required: true }}
									render={({ field, fieldState }) => (
										<TextInput
											sx={{ width: '100%' }}
											{...field}
											error={fieldState.error?.type === 'required' ? 'Required' : ''}
											label="Album"
											placeholder="Enter Album"
											withAsterisk
											disabled={tagsLoading}
											rightSection={tagsLoading ? <Loader size="xs" /> : null}
										/>
									)}
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
			watchFields.isFile,
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
