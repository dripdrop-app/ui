interface ValidationError {
	loc: string[];
	msg: string;
	type: string;
}

interface ErrorResponse {
	detail: ValidationError[] | string;
}

enum Tags {
	USER = 'User',
	MUSIC_JOB = 'MusicJob',
	MUSIC_GROUPING = 'MusicGrouping',
	MUSIC_ARTWORK = 'MusicArtwork',
	MUSIC_TAGS = 'MusicTags',
	MUSIC_DOWNLOAD = 'MusicDownload',
	YOUTUBE_AUTH = 'YoutubeAuth',
	YOUTUBE_VIDEO = 'YoutubeVideo',
	YOUTUBE_VIDEO_CATEGORY = 'YoutubeVideoCategory',
	YOUTUBE_VIDEO_QUEUE = 'YoutubeVideoQueue',
	YOUTUBE_VIDEO_QUEUE_INDEX = 'YoutubeVideoQueueIndex',
	YOUTUBE_SUBSCRIPTION = 'YoutubeSubscription',
	YOUTUBE_CHANNEL = 'YoutubeChannel',
	YOUTUBE_VIDEO_LIKE = 'YoutubeVideoLike',
}

enum Methods {
	POST = 'POST',
	GET = 'GET',
	DELETE = 'DELETE',
	PUT = 'PUT',
}
