import { FunctionComponent, useState } from "react";

interface VideoAutoPlayerProps {
  initialParams: YoutubeVideosBody;
}

const VideoAutoPlayer: FunctionComponent<VideoAutoPlayerProps> = ({ initialParams }) => {
  const [currentParams] = useState<YoutubeVideosBody | undefined>();

  console.log(currentParams);

  return <>TEst</>;
};

export default VideoAutoPlayer;
