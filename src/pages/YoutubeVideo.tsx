import { useMemo } from 'react';
import { Box, CircularProgress, Divider, Grid, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useYoutubeVideoQuery } from '../api/youtube';
import VideoCard from '../components/Youtube/VideoCard';
import YoutubeAuthPage from '../components/Auth/YoutubeAuthPage';
import VideoInformation from '../components/Youtube/VideoInformation';
import VideoPlayer from '../components/Youtube/VideoPlayer';
import useFillHeight from '../utils/useFillHeight';

interface YoutubeVideoProps {
	id: string;
}

const YoutubeVideo = (props: YoutubeVideoProps) => {
	const theme = useTheme();
	const isLarge = useMediaQuery(theme.breakpoints.up('xl'));

	const { elementHeight: rootHeight, ref: rootRef } = useFillHeight(window.innerHeight * 0.1);
	const videoStatus = useYoutubeVideoQuery({ videoId: props.id, relatedLength: isLarge ? 6 : 4 });

	const video = useMemo(() => videoStatus.data?.video, [videoStatus.data?.video]);
	const relatedVideos = useMemo(() => videoStatus.data?.relatedVideos, [videoStatus.data?.relatedVideos]);

	return useMemo(
		() => (
			<YoutubeAuthPage>
				<Box ref={rootRef}>
					<Stack direction="row" justifyContent="center" display={videoStatus.isLoading ? 'block' : 'none'}>
						<CircularProgress />
					</Stack>
					{videoStatus.isError ? (
						<Stack direction="row" justifyContent="center">
							Failed to load video
						</Stack>
					) : (
						<Box />
					)}
					{video && relatedVideos ? (
						<Stack direction="column" spacing={2}>
							<Box height={rootHeight}>
								<VideoPlayer video={video} />
							</Box>
							<VideoInformation video={video} />
							<Divider />
							<Box padding={2}>
								<Typography variant="h6">Related Videos</Typography>
								<Grid container>
									{relatedVideos.map((video) => (
										<Grid item xs={12} sm={6} md={3} xl={2} padding={1} key={video.id}>
											<VideoCard video={video} />
										</Grid>
									))}
								</Grid>
							</Box>
						</Stack>
					) : (
						<Box />
					)}
				</Box>
			</YoutubeAuthPage>
		),
		[relatedVideos, rootHeight, rootRef, video, videoStatus.isError, videoStatus.isLoading]
	);
};

export default YoutubeVideo;
