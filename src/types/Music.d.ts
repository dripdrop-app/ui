interface MusicJob {
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
			isFile: true;
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
			isFile: false;
			videoUrl: string;
			file: null;
			artworkUrl: string;
			resolvedArtworkUrl: string;
			title: string;
			artist: string;
			album: string;
			grouping: string;
	  };

type MusicJobsState = MusicJobsResponse;

type PageState = PageBody;

interface MusicJobsResponse {
	musicJobs: MusicJob[];
	totalPages: number;
}

interface GroupingResponse {
	grouping: string;
}

interface ResolvedArtworkResponse {
	resolvedArtworkUrl: string;
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
