import { useEffect, useState } from 'react';
import { Route, Switch, Link, useRouteMatch, useLocation } from 'react-router-dom';
import {
	AppShell,
	Avatar,
	Burger,
	Flex,
	Header,
	MantineProvider,
	MediaQuery,
	Navbar,
	NavLink,
	Title,
} from '@mantine/core';
import { ModalsProvider, openModal } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { BsYoutube } from 'react-icons/bs';
import { MdAccountCircle, MdCloudDownload, MdQueue, MdSubscriptions } from 'react-icons/md';

import { useCheckSessionQuery } from './api/auth';
import { useCheckYoutubeAuthQuery } from './api/youtube';
import AuthPage from './components/Auth/AuthPage';
import YoutubeAuthPage from './components/Auth/YoutubeAuthPage';
import YoutubeChannel from './pages/YoutubeChannel';
import Account from './pages/Account';
import MusicDownloader from './pages/MusicDownloader';
import YoutubeSubscriptions from './pages/YoutubeSubscriptions';
import YoutubeVideoQueue from './pages/YoutubeVideoQueue';
import YoutubeVideo from './pages/YoutubeVideo';
import YoutubeVideos from './pages/YoutubeVideos';

const App = () => {
	const [showSideBar, setShowSideBar] = useState(false);

	const match = useRouteMatch('/youtube/*');
	const location = useLocation();

	const sessionStatus = useCheckSessionQuery();
	const youtubeAuthStatus = useCheckYoutubeAuthQuery();

	useEffect(() => {
		if (sessionStatus.isError) {
			openModal({
				withCloseButton: false,
				children: <AuthPage />,
				closeOnClickOutside: false,
			});
		}
	}, [sessionStatus.isError]);

	useEffect(() => {
		if (sessionStatus.isSuccess && youtubeAuthStatus.isError && match) {
			openModal({
				withCloseButton: false,
				children: <YoutubeAuthPage />,
				closeOnClickOutside: false,
			});
		}
	});

	useEffect(() => {
		window.scrollTo({ top: 0 });
	}, [location.pathname]);

	return (
		<MantineProvider
			withGlobalStyles
			withNormalizeCSS
			theme={{
				colorScheme: 'dark',
				components: {
					Anchor: {
						defaultProps: {
							target: '_blank',
							rel: 'noopener noreferrer',
						},
					},
					Flex: {
						defaultProps: {
							wrap: { base: 'wrap', sm: 'nowrap' },
							gap: 'md',
						},
					},
				},
			}}
		>
			<ModalsProvider>
				<NotificationsProvider position="top-center">
					<AppShell
						navbarOffsetBreakpoint="sm"
						navbar={
							<Navbar
								width={{ sm: 200 }}
								hiddenBreakpoint="sm"
								hidden={!showSideBar}
								p="sm"
								sx={(theme) => ({
									'& .mantine-NavLink-icon': {
										color: theme.colors.blue[8],
									},
								})}
							>
								<Navbar.Section grow>
									<NavLink
										component={Link}
										to="/music/downloader"
										label="Cloud Downloader"
										icon={<MdCloudDownload />}
									/>
									<NavLink component={Link} to="/youtube/videos" label="Videos" icon={<BsYoutube />} />
									<NavLink
										component={Link}
										to="/youtube/subscriptions"
										label="Subscriptions"
										icon={<MdSubscriptions />}
									/>
									<NavLink component={Link} to="/youtube/videos/queue/1" label="Queue" icon={<MdQueue />} />
								</Navbar.Section>
								<Navbar.Section>
									<NavLink component={Link} to="/account" label="Account" icon={<MdAccountCircle />} />
								</Navbar.Section>
							</Navbar>
						}
						header={
							<Header sx={(theme) => ({ backgroundColor: theme.colors.blue[8] })} height={{ base: 65 }}>
								<Flex align="center" direction="row" sx={{ height: '100%' }} mx="lg">
									<MediaQuery largerThan="sm" styles={{ display: 'none' }}>
										<Burger opened={showSideBar} onClick={() => setShowSideBar(!showSideBar)} />
									</MediaQuery>
									<Avatar
										alt="dripdrop"
										src="https://dripdrop-space.nyc3.digitaloceanspaces.com/artwork/dripdrop.png"
									/>
									<Title color="white" order={3} weight={600}>
										dripdrop
									</Title>
								</Flex>
							</Header>
						}
					>
						<Switch>
							<Route path="/youtube/channel/:channelId/:page?" render={() => <YoutubeChannel />} />
							<Route path="/youtube/subscriptions/:page?" render={() => <YoutubeSubscriptions />} />
							<Route
								path="/youtube/videos/queue/:index"
								render={(props) => <YoutubeVideoQueue index={parseInt(props.match.params.index)} />}
							/>
							<Route path="/youtube/videos/:page?" render={() => <YoutubeVideos />} />
							{/* <Route path="/youtube/video/:id" render={(props) => <YoutubeVideo id={props.match.params.id} />} /> */}
							<Route path="/music/downloader" render={() => <MusicDownloader />} />
							<Route path="/account" render={() => <Account />} />
							<Route path="/" render={() => <MusicDownloader />} />
						</Switch>
					</AppShell>
				</NotificationsProvider>
			</ModalsProvider>
		</MantineProvider>
	);
};

export default App;
