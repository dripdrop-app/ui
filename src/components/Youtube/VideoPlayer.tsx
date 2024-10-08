import { useMemo } from "react";
import ReactPlayer from "react-player";

import { useAddYoutubeVideoWatchMutation } from "../../api/youtube";

interface VideoPlayerProps {
  video: YoutubeVideo | null | undefined;
  playing?: boolean;
  onEnd?: Function;
  onProgress?: Function;
  height?: string;
}

const VideoPlayer = (props: VideoPlayerProps) => {
  const { video, onProgress, onEnd, playing, height } = props;

  const [watchVideo] = useAddYoutubeVideoWatchMutation();

  return useMemo(
    () => (
      <ReactPlayer
        height={height || "100%"}
        width="100%"
        playing={playing}
        controls={true}
        url={`https://youtube.com/embed/${video?.id}`}
        onProgress={(state) => {
          if (video) {
            if (onProgress) {
              onProgress(state);
            }
            if (state.playedSeconds > 20 && video && !video.watched) {
              watchVideo(video.id);
            }
          }
        }}
        onEnded={() => {
          if (onEnd) {
            onEnd();
          }
        }}
      />
    ),
    [height, onEnd, onProgress, playing, video, watchVideo]
  );
};

export default VideoPlayer;
