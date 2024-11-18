import { AppShell, Avatar, Burger, Center, Flex, Loader, MantineProvider, NavLink, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { BsYoutube } from "react-icons/bs";
import { MdAccountCircle, MdCloudDownload, MdQueue, MdSubscriptions } from "react-icons/md";
import { Link, Route, Routes, useLocation } from "react-router-dom";

import { Account, CreateAccount, Login, PrivacyPolicy, TermsOfService, VerifyAccount } from "./pages/Auth";

import { useCheckSessionQuery } from "./api/auth";
import { MusicDownloader } from "./pages/Music";
import { YoutubeChannel, YoutubeSubscriptions, YoutubeVideo, YoutubeVideoQueue, YoutubeVideos } from "./pages/Youtube";

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
      {sessionStatus.isError && <Login />}
    </>
  );
};

const App = () => {
  const [openedSideBar, handlers] = useDisclosure(false);

  const sessionStatus = useCheckSessionQuery();

  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return (
    <MantineProvider
      defaultColorScheme="dark"
      theme={{
        breakpoints: {
          xl: "2000",
        },
        components: {
          Anchor: {
            defaultProps: {
              target: "_blank",
              rel: "noopener noreferrer",
            },
          },
          Flex: {
            defaultProps: {
              wrap: { base: "wrap", sm: "nowrap" },
              gap: "md",
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
        <Notifications />
        <AppShell
          padding="md"
          header={{ height: 60 }}
          navbar={{
            width: 200,
            breakpoint: "sm",
            collapsed: { desktop: false, mobile: !openedSideBar },
          }}
        >
          {sessionStatus.isSuccess ? (
            <AppShell.Navbar
              p="sm"

              // sx={(theme) => ({
              //   "& .mantine-NavLink-icon": {
              //     color: theme.colors.blue[8],
              //   },
              // })}
            >
              <AppShell.Section grow>
                <NavLink
                  component={Link}
                  to="/music/downloader"
                  label="Music Downloader"
                  onClick={handlers.close}
                  leftSection={<MdCloudDownload />}
                />
                <NavLink
                  component={Link}
                  to="/youtube/videos"
                  label="Videos"
                  onClick={handlers.close}
                  leftSection={<BsYoutube />}
                />
                <NavLink
                  component={Link}
                  to="/youtube/subscriptions"
                  label="Subscriptions"
                  onClick={handlers.close}
                  leftSection={<MdSubscriptions />}
                />
                <NavLink
                  component={Link}
                  to="/youtube/videos/queue"
                  label="Queue"
                  onClick={handlers.close}
                  leftSection={<MdQueue />}
                />
              </AppShell.Section>
              <AppShell.Section>
                <NavLink
                  component={Link}
                  to="/account"
                  label="Account"
                  onClick={handlers.close}
                  leftSection={<MdAccountCircle />}
                />
              </AppShell.Section>
            </AppShell.Navbar>
          ) : undefined}
          <AppShell.Header bg="blue.8">
            <Flex align="center" direction="row" h="100%" mx="lg">
              <Burger hiddenFrom="sm" opened={sessionStatus.isSuccess && openedSideBar} onClick={handlers.toggle} />
              <Avatar alt="dripdrop" src="https://dripdrop-prod.s3.us-east-005.backblazeb2.com/assets/dripdrop.png" />
              <Title c="white" order={3} fw={600}>
                dripdrop
              </Title>
            </Flex>
          </AppShell.Header>
          <AppShell.Main>
            <Routes>
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/create" element={<CreateAccount />} />
              <Route path="/verify" element={<VerifyAccount />} />
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
          </AppShell.Main>
        </AppShell>
      </ModalsProvider>
    </MantineProvider>
  );
};

export default App;
