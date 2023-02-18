interface Job {
	id: string;
	videoUrl?: string;
	filename?: string;
	originalFilename?: string;
	artworkUrl?: string;
	artworkFilename?: string;
	title: string;
	artist: string;
	album: string;
	grouping?: string;
	completed: boolean;
	failed: boolean;
	createdAt: string;
	downloadUrl?: string;
	download_filename?: string;
}

type MusicFormState =
	| {
			fileSwitch: true;
			videoUrl: string;
			file: File;
			artworkUrl: string;
			resolvedArtworkUrl: string;
			title: string;
			artist: string;
			album: string;
			grouping: string;
	  }
	| {
			fileSwitch: false;
			videoUrl: string;
			file: null;
			artworkUrl: string;
			resolvedArtworkUrl: string;
			title: string;
			artist: string;
			album: string;
			grouping: string;
	  };

type JobsState = JobsResponse;

type PageState = PageBody;

interface JobsResponse {
	jobs: Job[];
	totalPages: number;
}

interface GroupingResponse {
	grouping: string;
}

interface Artwork {
	artworkUrl: string;
}

interface TagsResponse {
	artworkUrl?: string;
	title?: string;
	artist?: string;
	album?: string;
	grouping?: string;
}

interface CreateFileJobBody {
	file: File;
	artworkUrl: string;
	title: string;
	artist: string;
	album: string;
	grouping?: string;
}

interface CreateVideoJobBody {
	videoUrl: string;
	artworkUrl: string;
	title: string;
	artist: string;
	album: string;
	grouping?: string;
}
