interface YoutubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  categoryId: number;
  categoryName: string;
  publishedAt: string;
  description: string | null;
  channelId: string;
  channelTitle: string;
  channelThumbnail: string;
  liked: string | null;
  queued: string | null;
  watched: string | null;
}

interface YoutubeChannel {
  id: string;
  title: string;
  thumbnail?: string;
  subscribed: boolean;
  updating: boolean;
}

type YoutubeChannelResponse = YoutubeChannel;

interface YoutubeUserChannel {
  id: string;
}

interface YoutubeSubscription {
  channelId: string;
  channelTitle: string;
  channelThumbnail: string;
}

interface YoutubeVideoCategory {
  id: number;
  name: string;
  createdAt: string;
}

interface DownloadResponse {
  url: string;
}

interface YoutubeVideoCategoriesResponse {
  categories: YoutubeVideoCategory[];
}

interface ChannelBody {
  channelId?: string;
}

interface PageBody {
  perPage: number;
  page: number;
}

interface YoutubeVideosBody extends ChannelBody, PageBody {
  selectedCategories: number[];
  likedOnly?: boolean;
  queuedOnly?: boolean;
}

interface YoutubeVideosResponse {
  videos: YoutubeVideo[];
  totalPages: number;
}

interface YoutubeVideoBody {
  videoId: string;
  relatedLength?: number;
}

interface YoutubeVideoResponse {
  video: YoutubeVideo;
  relatedVideos: YoutubeVideo[];
}

type YoutubeSubscriptionBody = ChannelBody & PageBody;

type YoutubeSubscriptionResponse = YoutubeSubscription;

interface YoutubeSubscriptionsResponse {
  subscriptions: YoutubeSubscription[];
  totalPages: number;
}

interface YoutubeVideoQueueResponse {
  prev: boolean;
  next: boolean;
  currentVideo: YoutubeVideo;
}
