import { useEffect } from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import {
	AppShell,
	Avatar,
	Burger,
	Center,
	Flex,
	Header,
	Loader,
	MantineProvider,
	MediaQuery,
	Navbar,
	NavLink,
	Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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
import AuthPage from './pages/AuthPage';

import { useCheckSessionQuery } from './api/auth';

interface AuthenticatedRouteProps {
	children: JSX.Element;
}

const AuthenticatedRoute = (props: AuthenticatedRouteProps) => {
	const { children } = props;

	const sessionStatus = useCheckSessionQuery();

	return (
		<>
			{sessionStatus.isFetching && (
				<Center>
					<Loader />
				</Center>
			)}
			{sessionStatus.isSuccess && children}
			{sessionStatus.isError && <AuthPage />}
		</>
	);
};

interface AppNavbarProps {
	opened: boolean;
	close: () => void;
}

const AppNavbar = (props: AppNavbarProps) => {
	const { opened, close } = props;

	return (
		<Navbar
			width={{ sm: 200 }}
			hiddenBreakpoint="sm"
			hidden={!opened}
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
					onClick={close}
					icon={<MdCloudDownload />}
				/>
				<NavLink component={Link} to="/youtube/videos" label="Videos" onClick={close} icon={<BsYoutube />} />
				<NavLink
					component={Link}
					to="/youtube/subscriptions"
					label="Subscriptions"
					onClick={close}
					icon={<MdSubscriptions />}
				/>
				<NavLink component={Link} to="/youtube/videos/queue" label="Queue" onClick={close} icon={<MdQueue />} />
			</Navbar.Section>
			<Navbar.Section>
				<NavLink component={Link} to="/account" label="Account" onClick={close} icon={<MdAccountCircle />} />
			</Navbar.Section>
		</Navbar>
	);
};

interface AppHeaderProps {
	showBurger: boolean;
	toggle: () => void;
}

const AppHeader = (props: AppHeaderProps) => {
	const { showBurger, toggle } = props;

	return (
		<Header sx={(theme) => ({ backgroundColor: theme.colors.blue[8] })} height={{ base: 65 }}>
			<Flex align="center" direction="row" sx={{ height: '100%' }} mx="lg">
				<MediaQuery largerThan="sm" styles={{ display: 'none' }}>
					<Burger opened={showBurger} onClick={toggle} />
				</MediaQuery>
				<Avatar alt="dripdrop" src="https://dripdrop-space.nyc3.digitaloceanspaces.com/artwork/dripdrop.png" />
				<Title color="white" order={3} weight={600}>
					dripdrop
				</Title>
			</Flex>
		</Header>
	);
};

const App = () => {
	const [openedSideBar, handlers] = useDisclosure(false);

	const sessionStatus = useCheckSessionQuery();

	const location = useLocation();

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, [location]);

	return (
		<MantineProvider
			withGlobalStyles
			withNormalizeCSS
			theme={{
				colorScheme: 'dark',
				breakpoints: {
					xl: 2000,
				},
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
					Tooltip: {
						defaultProps: {
							events: { hover: true, focus: false, touch: true },
						},
					},
				},
			}}
		>
			<ModalsProvider>
				<NotificationsProvider position="top-center">
					<AppShell
						navbarOffsetBreakpoint="sm"
						navbar={sessionStatus.isSuccess ? <AppNavbar opened={openedSideBar} close={handlers.close} /> : undefined}
						header={<AppHeader showBurger={sessionStatus.isSuccess && openedSideBar} toggle={handlers.toggle} />}
					>
						<Routes>
							<Route path="/privacy" element={<PrivacyPolicy />} />
							<Route path="/terms" element={<TermsOfService />} />
							<Route
								path="/youtube/channel/:id"
								element={
									<AuthenticatedRoute>
										<YoutubeChannel />
									</AuthenticatedRoute>
								}
							/>
							<Route
								path="/youtube/subscriptions"
								element={
									<AuthenticatedRoute>
										<YoutubeSubscriptions />
									</AuthenticatedRoute>
								}
							/>
							<Route
								path="/youtube/videos/queue"
								element={
									<AuthenticatedRoute>
										<YoutubeVideoQueue />
									</AuthenticatedRoute>
								}
							/>
							<Route
								path="/youtube/videos"
								element={
									<AuthenticatedRoute>
										<YoutubeVideos />
									</AuthenticatedRoute>
								}
							/>
							<Route
								path="/youtube/video/:id"
								element={
									<AuthenticatedRoute>
										<YoutubeVideo />
									</AuthenticatedRoute>
								}
							/>
							<Route
								path="/music/downloader"
								element={
									<AuthenticatedRoute>
										<MusicDownloader />
									</AuthenticatedRoute>
								}
							/>
							<Route
								path="/account"
								element={
									<AuthenticatedRoute>
										<Account />
									</AuthenticatedRoute>
								}
							/>
							<Route
								path="/"
								element={
									<AuthenticatedRoute>
										<MusicDownloader />
									</AuthenticatedRoute>
								}
							/>
						</Routes>
					</AppShell>
				</NotificationsProvider>
			</ModalsProvider>
		</MantineProvider>
	);
};

export default App;
