import { useMemo } from 'react';
import { Box, CircularProgress, Divider, Grid, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useYoutubeVideoQuery } from '../api/youtube';
import VideoCard from '../components/Youtube/VideoCard';
import VideoInformation from '../components/Youtube/VideoInformation';
import VideoPlayer from '../components/Youtube/VideoPlayer';
import withYoutubeAuthPage from '../components/Auth/YoutubeAuthPage';

interface YoutubeVideoProps {
	id: string;
}

const YoutubeVideo = (props: YoutubeVideoProps) => {
	const theme = useTheme();
	const isLarge = useMediaQuery(theme.breakpoints.up('xl'));

	const videoStatus = useYoutubeVideoQuery({ videoId: props.id, relatedLength: isLarge ? 6 : 4 });

	const video = useMemo(() => videoStatus.data?.video, [videoStatus.data?.video]);
	const relatedVideos = useMemo(() => videoStatus.data?.relatedVideos, [videoStatus.data?.relatedVideos]);

	return useMemo(
		() => (
			<Box>
				<Stack direction="row" justifyContent="center" display={videoStatus.isLoading ? 'block' : 'none'}>
					<CircularProgress />
				</Stack>
				{videoStatus.isError && (
					<Stack direction="row" justifyContent="center">
						Failed to load video
					</Stack>
				)}
				{video && relatedVideos && (
					<Stack direction="column" spacing={2}>
						<Box height="80vh">
							<VideoPlayer video={video} playing={true} />
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
				)}
			</Box>
		),
		[relatedVideos, video, videoStatus.isError, videoStatus.isLoading]
	);
};

export default withYoutubeAuthPage(YoutubeVideo);
