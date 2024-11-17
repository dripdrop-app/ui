import { Anchor, Button, Card, Flex, Image, Stack, Table } from "@mantine/core";
import { FunctionComponent } from "react";
import { MdDelete, MdDownload, MdError } from "react-icons/md";

import { useRemoveMusicJobMutation } from "../../api/music";
import { buildURL } from "../../config";

const MusicJobCard: FunctionComponent<MusicJob> = (props) => {
  const createdAt = new Date(props.createdAt).toLocaleDateString();

  const [removeMusicJob, removeMusicJobStatus] = useRemoveMusicJobMutation();

  return (
    <Card>
      <Card.Section>
        <Image
          src={props.artworkUrl || "https://dripdrop-prod.s3.us-east-005.backblazeb2.com/assets/blank_image.jpeg"}
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
              <td>Video URL</td>
              <td>{props.videoUrl ? <Anchor href={props.videoUrl}>{props.videoUrl}</Anchor> : props.videoUrl}</td>
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
          <Button display={!props.completed && !props.failed ? "initial" : "none"} loading>
            Loading
          </Button>
          <Button display={props.failed ? "initial" : "none"} color="red" leftIcon={<MdError />}>
            Failed
          </Button>
          <Button
            component="a"
            display={props.completed ? "initial" : "none"}
            color="green"
            href={buildURL(`api/music/job/${props.id}/download`)}
            target="_blank"
            rel="noopener noreferrer"
            leftIcon={<MdDownload />}
          >
            Download
          </Button>
          <Button
            color="red"
            leftIcon={<MdDelete />}
            loading={removeMusicJobStatus.isLoading}
            onClick={() => removeMusicJob(props.id)}
          >
            Delete
          </Button>
        </Flex>
      </Stack>
    </Card>
  );
};

export default MusicJobCard;
