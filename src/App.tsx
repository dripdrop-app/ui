import { useEffect, useState } from 'react';
import { Route, Switch, Link, useLocation } from 'react-router-dom';
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
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { BsYoutube } from 'react-icons/bs';
import { MdAccountCircle, MdCloudDownload, MdQueue, MdSubscriptions } from 'react-icons/md';

import YoutubeChannel from './pages/YoutubeChannel';
import Account from './pages/Account';
import MusicDownloader from './pages/MusicDownloader';
import YoutubeSubscriptions from './pages/YoutubeSubscriptions';
import YoutubeVideoQueue from './pages/YoutubeVideoQueue';
import YoutubeVideo from './pages/YoutubeVideo';
import YoutubeVideos from './pages/YoutubeVideos';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

const App = () => {
	const [showSideBar, setShowSideBar] = useState(false);

	const location = useLocation();

	useEffect(() => {
		window.scrollTo({ top: 0 });
	}, [location]);

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
										label="Music Downloader"
										icon={<MdCloudDownload />}
									/>
									<NavLink component={Link} to="/youtube/videos" label="Videos" icon={<BsYoutube />} />
									<NavLink
										component={Link}
										to="/youtube/subscriptions"
										label="Subscriptions"
										icon={<MdSubscriptions />}
									/>
									<NavLink component={Link} to="/youtube/videos/queue" label="Queue" icon={<MdQueue />} />
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
							<Route path="/privacy">
								<PrivacyPolicy />
							</Route>
							<Route path="/terms">
								<TermsOfService />
							</Route>
							<Route path="/youtube/channel/:id" render={(props) => <YoutubeChannel id={props.match.params.id} />} />
							<Route path="/youtube/subscriptions">
								<YoutubeSubscriptions />
							</Route>
							<Route path="/youtube/videos/queue">
								<YoutubeVideoQueue />
							</Route>
							<Route path="/youtube/videos">
								<YoutubeVideos />
							</Route>
							<Route path="/youtube/video/:id" render={(props) => <YoutubeVideo id={props.match.params.id} />} />
							<Route path="/music/downloader">
								<MusicDownloader />
							</Route>
							<Route path="/account">
								<Account />
							</Route>
							<Route path="/">
								<MusicDownloader />
							</Route>
						</Switch>
					</AppShell>
				</NotificationsProvider>
			</ModalsProvider>
		</MantineProvider>
	);
};

export default App;
