import { useEffect, useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
	ActionIcon,
	Avatar,
	Box,
	Button,
	Center,
	Divider,
	Flex,
	Loader,
	LoadingOverlay,
	Modal,
	Pagination,
	Stack,
	Text,
	Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MdClose } from 'react-icons/md';

import { useYoutubeVideosQuery } from '../../api/youtube';

interface VideoQueueModalProps {
	currentVideo: YoutubeVideo | null;
	queueIndex: number;
}

const VideoQueueModal = (props: VideoQueueModalProps) => {
	const { currentVideo, queueIndex } = props;

	const [filter, setFilter] = useState<YoutubeVideosBody>({
		page: 1,
		perPage: 50,
		queuedOnly: true,
		selectedCategories: [],
	});

	const [opened, handlers] = useDisclosure(false);

	const history = useHistory();

	const videosStatus = useYoutubeVideosQuery(filter);

	const videos = useMemo(() => (videosStatus.data ? videosStatus.data.videos : []), [videosStatus.data]);
	const totalPages = useMemo(() => (videosStatus.data ? videosStatus.data.totalPages : 1), [videosStatus.data]);

	useEffect(() => {
		const currentVideoPage = Math.ceil(queueIndex / filter.perPage);
		setFilter((prevState) => ({ ...prevState, page: currentVideoPage }));
	}, [filter.perPage, queueIndex]);

	return useMemo(
		() => (
			<>
				<Button onClick={handlers.open}>Open Queue</Button>
				<Modal title="Queue" overflow="inside" size="lg" opened={opened} onClose={handlers.close}>
					{videosStatus.isLoading ? (
						<Center>
							<Loader />
						</Center>
					) : (
						<>
							<LoadingOverlay visible={videosStatus.isFetching} />
							<Stack>
								{videos.map((video, i) => (
									<>
										<Box
											component={Link}
											to={`/youtube/videos/queue/${i}`}
											p="sm"
											sx={{
												textDecoration: 'none',
												color: 'inherit',
												borderRadius: 5,
												'&:hover': {
													backgroundColor: '#111111',
												},
											}}
										>
											<Flex align="center">
												<Flex align="center" sx={{ flex: 9 }}>
													<Avatar src={video.thumbnail} />
													<Stack spacing="xs">
														<Title order={6}>{video.title}</Title>
														<Text sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{video.channelTitle}</Text>
													</Stack>
												</Flex>
												<Box sx={{ flex: 3 }}>{video.id === currentVideo?.id && <Text>Now Playing</Text>}</Box>
												<Box sx={{ flex: 1, alignItems: 'end' }}>
													<ActionIcon
														onClick={() => {
															history.push(`/youtube/videos/queue/${i + 1 + filter.perPage * (filter.page - 1)}`);
															handlers.close();
														}}
													>
														<MdClose color="red" size={30} />
													</ActionIcon>
												</Box>
											</Flex>
										</Box>
										<Divider />
									</>
								))}
								<Center>
									<Pagination
										total={totalPages}
										page={filter.page}
										onChange={(newPage) => setFilter((prevState) => ({ ...prevState, page: newPage }))}
									/>
								</Center>
							</Stack>
						</>
					)}
				</Modal>
			</>
		),
		[
			handlers,
			opened,
			videosStatus.isLoading,
			videosStatus.isFetching,
			videos,
			totalPages,
			filter.page,
			filter.perPage,
			currentVideo?.id,
			history,
		]
	);
};

export default VideoQueueModal;
