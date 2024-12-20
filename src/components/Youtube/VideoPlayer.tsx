import React, { forwardRef, useMemo } from "react";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";

import { useAddYoutubeVideoWatchMutation } from "../../api/youtube";

interface VideoPlayerProps {
  video: YoutubeVideo | null | undefined;
  playing?: boolean;
  onDuration?: (duration: number) => void;
  onEnd?: () => void;
  onProgress?: (state: OnProgressProps) => void;
  height?: string;
  style?: React.CSSProperties;
}

const VideoPlayer = forwardRef<ReactPlayer, VideoPlayerProps>(
  ({ video, onDuration, onProgress, onEnd, playing, height, style }, ref) => {
    const [watchVideo] = useAddYoutubeVideoWatchMutation();

    return useMemo(
      () => (
        <ReactPlayer
          ref={ref}
          style={style}
          height={height || "100%"}
          width="100%"
          playing={playing}
          controls={true}
          url={`https://youtube.com/embed/${video?.id}`}
          onDuration={(duration) => {
            if (onDuration) {
              onDuration(duration);
            }
          }}
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
      [height, onDuration, onEnd, onProgress, playing, ref, style, video, watchVideo]
    );
  }
);

export default VideoPlayer;
