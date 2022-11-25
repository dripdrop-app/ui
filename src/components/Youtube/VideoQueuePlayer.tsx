import { useMemo, useState } from 'react';
import { AppBar, Avatar, Box, ButtonGroup, IconButton, Stack, Typography } from '@mui/material';
import { MenuOpen, PlayArrow, SkipNext, SkipPrevious } from '@mui/icons-material';
import { useYoutubeVideoQueueQuery } from '../../api/youtube';
import { VideoLikeButton, VideoQueueButton } from './VideoButtons';
import VideoPlayer from './VideoPlayer';

const VideoQueuePlayer = () => {
	const [queueIndex, setQueueIndex] = useState(1);

	const videoQueueStatus = useYoutubeVideoQueueQuery(queueIndex);

	const { currentVideo, next, prev } = useMemo(() => {
		if (videoQueueStatus.isSuccess && videoQueueStatus.currentData) {
			return videoQueueStatus.currentData;
		}
		return { currentVideo: null, prev: false, next: false };
	}, [videoQueueStatus.currentData, videoQueueStatus.isSuccess]);

	return useMemo(
		() =>
			currentVideo && (
				<AppBar position="fixed" sx={{ top: 'auto', bottom: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
					<Stack direction="row" justifyContent="center" alignItems="center" gap={3} paddingY={1}>
						<Avatar alt={currentVideo.title} src={currentVideo.thumbnail} />
						<Stack direction="column">
							<Typography variant="subtitle1">{currentVideo.title}</Typography>
							<Stack direction="row" justifyContent="space-between">
								<Typography variant="subtitle2">{currentVideo.channelTitle}</Typography>
								<Typography variant="subtitle2">0: 00 / 1: 00</Typography>
							</Stack>
						</Stack>
						<ButtonGroup>
							<IconButton onClick={() => setQueueIndex((currIndex) => currIndex - 1)} disabled={!prev}>
								<SkipPrevious />
							</IconButton>
							<IconButton>
								<PlayArrow />
							</IconButton>
							<IconButton onClick={() => setQueueIndex((currIndex) => currIndex + 1)} disabled={!next}>
								<SkipNext />
							</IconButton>
						</ButtonGroup>
						<ButtonGroup sx={{ gap: 1 }}>
							<VideoLikeButton video={currentVideo} />
							<VideoQueueButton video={currentVideo} />
							<IconButton>
								<MenuOpen />
							</IconButton>
						</ButtonGroup>
						<Box display={'none'}>
							<VideoPlayer video={currentVideo} />
						</Box>
					</Stack>
				</AppBar>
			),
		[currentVideo, next, prev]
	);
};

export default VideoQueuePlayer;
