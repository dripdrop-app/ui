import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { AspectRatio, Button, Flex, Stack } from '@mantine/core';
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md';

import { useYoutubeVideoQueueQuery } from '../api/youtube';
import VideoQueuePlayer from '../components/Youtube/VideoPlayer';
import VideoQueueModal from '../components/Youtube/VideoQueueModal';
import VideoInformation from '../components/Youtube/VideoInformation';

interface YoutubeVideoQueueProps {
	index: number;
}

const YoutubeVideoQueue = (props: YoutubeVideoQueueProps) => {
	const queueIndex = props.index;

	const videoQueueStatus = useYoutubeVideoQueueQuery(queueIndex);

	const history = useHistory();

	const { currentVideo, next, prev } = useMemo(() => {
		if (videoQueueStatus.isSuccess && videoQueueStatus.currentData) {
			return videoQueueStatus.currentData;
		}
		return { currentVideo: null, prev: false, next: false };
	}, [videoQueueStatus.currentData, videoQueueStatus.isSuccess]);

	return useMemo(
		() => (
			<Stack p="md">
				<Flex justify="space-between">
					<Button
						leftIcon={<MdSkipPrevious />}
						disabled={!prev}
						onClick={() => history.push(`/youtube/videos/queue/${queueIndex - 1}`)}
					>
						Previous
					</Button>
					<VideoQueueModal currentVideo={currentVideo} queueIndex={queueIndex} />
					<Button
						rightIcon={<MdSkipNext />}
						disabled={!next}
						onClick={() => history.push(`/youtube/videos/queue/${queueIndex + 1}`)}
					>
						Next
					</Button>
				</Flex>
				<AspectRatio ratio={16 / 9} sx={{ maxHeight: '75vh' }}>
					<VideoQueuePlayer
						video={currentVideo}
						playing={true}
						onEnd={() => {
							if (next) {
								history.push(`/youtube/videos/queue/${queueIndex + 1}`);
							}
						}}
					/>
				</AspectRatio>
				{currentVideo && <VideoInformation video={currentVideo} />}
			</Stack>
		),
		[currentVideo, history, next, prev, queueIndex]
	);
};

export default YoutubeVideoQueue;
