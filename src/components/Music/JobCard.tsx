import { Anchor, Button, Card, Flex, Image, Stack, Table } from '@mantine/core';
import { MdDelete, MdDownload, MdError } from 'react-icons/md';

import { useRemoveJobMutation } from '../../api/music';

const JobCard = (props: Job) => {
	const createdAt = new Date(props.createdAt).toLocaleDateString();

	const [removeJob, removeJobStatus] = useRemoveJobMutation();

	return (
		<Card>
			<Card.Section>
				<Image
					src={props.artworkUrl || 'https://dripdrop-space.nyc3.digitaloceanspaces.com/artwork/blank_image.jpeg'}
					alt="Artwork"
					withPlaceholder
					height={150}
				/>
			</Card.Section>
			<Stack>
				<Table>
					<tbody>
						<tr>
							<td>ID</td>
							<td>{props.id}</td>
						</tr>
						<tr>
							<td>Youtube URL</td>
							<td>
								{props.youtubeUrl ? <Anchor href={props.youtubeUrl}>{props.youtubeUrl}</Anchor> : props.youtubeUrl}
							</td>
						</tr>
						<tr>
							<td>Filename</td>
							<td>
								{props.filename ? (
									<Anchor href={props.filename}>{props.originalFilename}</Anchor>
								) : (
									props.originalFilename
								)}
							</td>
						</tr>
						<tr>
							<td>Artwork URL</td>
							<td>
								{props.artworkUrl ? <Anchor href={props.artworkUrl}>{props.artworkUrl}</Anchor> : props.artworkUrl}
							</td>
						</tr>
						<tr>
							<td>Title</td>
							<td>{props.title}</td>
						</tr>
						<tr>
							<td>Artist</td>
							<td>{props.artist}</td>
						</tr>
						<tr>
							<td>Album</td>
							<td>{props.album}</td>
						</tr>
						<tr>
							<td>Grouping</td>
							<td>{props.grouping}</td>
						</tr>
						<tr>
							<td>Created At</td>
							<td>{createdAt}</td>
						</tr>
					</tbody>
				</Table>
				<Flex justify="center">
					<Button display={!props.completed && !props.failed ? 'initial' : 'none'} loading>
						Loading
					</Button>
					<Button display={props.failed ? 'initial' : 'none'} color="red" leftIcon={<MdError />}>
						Failed
					</Button>
					<Button display={props.completed ? 'initial' : 'none'} color="green" leftIcon={<MdDownload />}>
						Download
					</Button>
					<Button
						display={props.completed || props.failed ? 'initial' : 'none'}
						color="red"
						leftIcon={<MdDelete />}
						loading={removeJobStatus.isLoading}
						onClick={() => removeJob(props.id)}
					>
						Delete
					</Button>
				</Flex>
			</Stack>
		</Card>
	);
};

export default JobCard;
