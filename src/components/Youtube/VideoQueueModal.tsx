import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
	List,
	ListItem,
	ListItemButton,
	Stack,
	ListItemAvatar,
	Avatar,
	ListItemText,
	CircularProgress,
	Box,
	Button,
	Typography,
	Pagination,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	Tooltip,
} from '@mui/material';
import { Close, MenuOpen } from '@mui/icons-material';
import { useYoutubeVideosQuery } from '../../api/youtube';
import { VideoQueueButton } from './VideoButtons';
import VideosPage from './VideosPage';

interface VideoQueueModalProps {
	currentVideo: YoutubeVideo | null;
	queueIndex: number;
}

const VideoQueueModal = (props: VideoQueueModalProps) => {
	const { currentVideo, queueIndex } = props;

	const [openModal, setOpenModal] = useState(false);
	const [filter, setFilter] = useState<YoutubeVideosBody>({
		page: 1,
		perPage: 50,
		queuedOnly: true,
		selectedCategories: [],
	});

	const history = useHistory();

	const videosStatus = useYoutubeVideosQuery(filter);

	const totalPages = useMemo(() => {
		if (videosStatus.isSuccess && videosStatus.currentData) {
			return videosStatus.currentData.totalPages;
		} else if (videosStatus.data) {
			return videosStatus.data.totalPages;
		}
		return 1;
	}, [videosStatus.currentData, videosStatus.data, videosStatus.isSuccess]);

	useEffect(() => {
		const currentVideoPage = Math.ceil(queueIndex / filter.perPage);
		setFilter((prevState) => ({ ...prevState, page: currentVideoPage }));
	}, [filter.perPage, queueIndex]);

	return useMemo(
		() => (
			<Box>
				<Tooltip title="Show Queue" placement="left">
					<Button
						variant="contained"
						sx={{ borderRadius: 0 }}
						onClick={() => setOpenModal(true)}
						startIcon={<MenuOpen />}
					>
						Queue
					</Button>
				</Tooltip>
				<Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="md">
					<DialogTitle>
						<Stack direction="row" alignItems="center" justifyContent="space-between">
							<Typography variant="h6">Queue</Typography>
							<IconButton onClick={() => setOpenModal(false)}>
								<Close />
							</IconButton>
						</Stack>
					</DialogTitle>
					<DialogContent dividers>
						<List
							disablePadding
							sx={(theme) => ({
								overflow: 'scroll',
								height: '65vh',
								[theme.breakpoints.down('md')]: {
									height: '80vh',
								},
							})}
						>
							<VideosPage
								page={filter.page}
								perPage={filter.perPage}
								queuedOnly={filter.queuedOnly}
								selectedCategories={filter.selectedCategories}
								renderItem={(video, index) => (
									<ListItem
										divider
										sx={{
											backgroundColor: (theme) => (video.id === currentVideo?.id ? theme.palette.primary.main : ''),
										}}
										alignItems="flex-start"
										secondaryAction={<VideoQueueButton video={video} />}
										disablePadding
									>
										<ListItemButton
											onClick={() => {
												history.push(`/youtube/videos/queue/${index + 1 + filter.perPage * (filter.page - 1)}`);
												setOpenModal(false);
											}}
										>
											<ListItemAvatar>
												<Avatar alt={video.title} src={video.thumbnail} />
											</ListItemAvatar>
											<ListItemText primary={video.title} secondary={video.channelTitle} />
											<ListItemText
												sx={{ display: video.id === currentVideo?.id ? 'block' : 'none' }}
												primary="Now Playing"
											/>
										</ListItemButton>
									</ListItem>
								)}
								renderLoading={() => (
									<Stack direction="row" justifyContent="center">
										<CircularProgress />
									</Stack>
								)}
							/>
						</List>
					</DialogContent>
					<Stack direction="row" justifyContent="center" padding={2}>
						<Pagination
							page={filter.page}
							count={totalPages}
							color="primary"
							shape="rounded"
							onChange={(e, newPage) => setFilter((prevState) => ({ ...prevState, page: newPage }))}
						/>
					</Stack>
				</Dialog>
			</Box>
		),
		[
			openModal,
			filter.page,
			filter.perPage,
			filter.queuedOnly,
			filter.selectedCategories,
			totalPages,
			currentVideo?.id,
			history,
		]
	);
};

export default VideoQueueModal;
