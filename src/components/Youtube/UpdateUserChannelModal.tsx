import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Modal, Stack, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MdError } from 'react-icons/md';

import { useUpdateUserYoutubeChannelMutation } from '../../api/youtube';

const UpdateUserChannelModal = () => {
	const [userChannelId, setUserChannelId] = useState('');

	const [updateUserYoutubeChannel, updateUserYoutubeChannelStatus] = useUpdateUserYoutubeChannelMutation();

	const [opened, handlers] = useDisclosure(false);

	useEffect(() => {
		if (updateUserYoutubeChannelStatus.isSuccess) {
			handlers.close();
		}
	}, [handlers, updateUserYoutubeChannelStatus.isSuccess]);

	return useMemo(
		() => (
			<>
				<Button onClick={handlers.open}>Update User Channel</Button>
				<Modal title="Update User Channel" size="lg" opened={opened} onClose={handlers.close}>
					<Stack sx={{ padding: 4 }}>
						<TextInput
							label="Channel ID"
							placeholder="Enter Channel ID"
							onChange={(e) => setUserChannelId(e.target.value)}
						/>
						<Button
							onClick={() => {
								updateUserYoutubeChannel(userChannelId);
							}}
							loading={updateUserYoutubeChannelStatus.isLoading}
						>
							Submit
						</Button>
						<Alert
							sx={{ ...(!updateUserYoutubeChannelStatus.isError && { display: 'none' }) }}
							icon={<MdError />}
							title="Error"
							color="red"
						>
							{updateUserYoutubeChannelStatus.error ? String(updateUserYoutubeChannelStatus.error) : ''}
						</Alert>
					</Stack>
				</Modal>
			</>
		),
		[
			handlers,
			opened,
			updateUserYoutubeChannel,
			updateUserYoutubeChannelStatus.error,
			updateUserYoutubeChannelStatus.isError,
			updateUserYoutubeChannelStatus.isLoading,
			userChannelId,
		]
	);
};

export default UpdateUserChannelModal;
