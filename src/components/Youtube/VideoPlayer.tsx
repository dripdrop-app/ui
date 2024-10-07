import { FunctionComponent, useMemo } from "react";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";

import { useAddYoutubeVideoWatchMutation } from "../../api/youtube";

interface VideoPlayerProps {
  video: YoutubeVideo | null | undefined;
  playing?: boolean;
  onEnd?: () => void;
  onProgress?: (state: OnProgressProps) => void;
  height?: string;
  style?: React.CSSProperties;
}

const VideoPlayer: FunctionComponent<VideoPlayerProps> = ({ video, onProgress, onEnd, playing, height, style }) => {
  const [watchVideo] = useAddYoutubeVideoWatchMutation();

  return useMemo(
    () => (
      <ReactPlayer
        style={style}
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
    [height, onEnd, onProgress, playing, style, video, watchVideo]
  );
};

export default VideoPlayer;
