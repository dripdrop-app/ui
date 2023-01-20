import { useMemo } from 'react';
import { AspectRatio, Button, Flex, Stack } from '@mantine/core';
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md';

import { useYoutubeVideoQueueQuery } from '../api/youtube';
import VideoPlayer from '../components/Youtube/VideoPlayer';
import VideoQueueModal from '../components/Youtube/VideoQueueModal';
import VideoInformation from '../components/Youtube/VideoInformation';
import useSearchParams from '../utils/useSearchParams';
import withAuthPage from '../components/Auth/AuthPage';
import withYoutubeAuthPage from '../components/Auth/YoutubeAuthPage';

const YoutubeVideoQueue = () => {
	const { params, setSearchParams } = useSearchParams({ index: 1 });

	const videoQueueStatus = useYoutubeVideoQueueQuery(params.index);

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
						onClick={() => setSearchParams({ index: params.index - 1 })}
					>
						Previous
					</Button>
					<VideoQueueModal currentVideo={currentVideo} queueIndex={params.index} />
					<Button
						rightIcon={<MdSkipNext />}
						disabled={!next}
						onClick={() => setSearchParams({ index: params.index + 1 })}
					>
						Next
					</Button>
				</Flex>
				<AspectRatio ratio={16 / 9} sx={{ maxHeight: '75vh' }}>
					<VideoPlayer
						video={currentVideo}
						playing={true}
						onEnd={() => {
							if (next) {
								setSearchParams({ index: params.index + 1 });
							}
						}}
					/>
				</AspectRatio>
				{currentVideo && <VideoInformation video={currentVideo} />}
			</Stack>
		),
		[currentVideo, next, params.index, prev, setSearchParams]
	);
};

export default withAuthPage(withYoutubeAuthPage(YoutubeVideoQueue));
