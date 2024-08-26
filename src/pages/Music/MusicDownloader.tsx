import { Helmet } from "react-helmet-async";
import { Stack } from "@mantine/core";

import MusicJobList from "../../components/Music/MusicJobList";
import MusicForm from "../../components/Music/MusicForm";

const MusicDownloader = () => {
  return (
    <Stack spacing={10}>
      <Helmet>
        <title>Music Downloader</title>
      </Helmet>
      <MusicForm />
      <MusicJobList />
    </Stack>
  );
};

export default MusicDownloader;
