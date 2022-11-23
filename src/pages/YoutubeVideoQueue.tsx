import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Stack, Tooltip } from '@mui/material';
import { SkipNext, SkipPrevious } from '@mui/icons-material';
import { useYoutubeVideoQueueQuery } from '../api/youtube';
import useFillHeight from '../utils/useFillHeight';
import VideoQueuePlayer from '../components/Youtube/VideoPlayer';
import VideoQueueModal from '../components/Youtube/VideoQueueModal';
import YoutubeAuthPage from '../components/Auth/YoutubeAuthPage';
import VideoInformation from '../components/Youtube/VideoInformation';

interface YoutubeVideoQueueProps {
	index: number;
}

const YoutubeVideoQueue = (props: YoutubeVideoQueueProps) => {
	const queueIndex = props.index;

	const { elementHeight: rootHeight, ref: rootRef } = useFillHeight(window.innerHeight * 0.1);
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
			<YoutubeAuthPage>
				<Stack direction="column" ref={rootRef}>
					<Box position="relative" height={rootHeight}>
						<VideoQueuePlayer
							video={currentVideo}
							onEnd={() => {
								if (next) {
									history.push(`/youtube/videos/queue/${queueIndex + 1}`);
								}
							}}
						/>
						<Box position="absolute" top="50%" right={0} display={next ? 'block' : 'none'}>
							<Tooltip title="Next">
								<Button variant="contained" onClick={() => history.push(`/youtube/videos/queue/${queueIndex + 1}`)}>
									<SkipNext />
								</Button>
							</Tooltip>
						</Box>
						<Box position="absolute" top="50%" left={0} display={prev ? 'block' : 'none'}>
							<Tooltip title="Previous">
								<Button variant="contained" onClick={() => history.push(`/youtube/videos/queue/${queueIndex - 1}`)}>
									<SkipPrevious />
								</Button>
							</Tooltip>
						</Box>
					</Box>
					{currentVideo ? <VideoInformation video={currentVideo} /> : <Box />}
					<Stack direction="row" gap={2}></Stack>
					<Box position="fixed" top="25%" right={0}>
						<VideoQueueModal currentVideo={currentVideo} queueIndex={queueIndex} />
					</Box>
				</Stack>
			</YoutubeAuthPage>
		),
		[currentVideo, history, next, prev, queueIndex, rootHeight, rootRef]
	);
};

export default YoutubeVideoQueue;
