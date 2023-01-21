import React, { useMemo, useEffect } from 'react';
import { Button, Center, Modal, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { openModal } from '@mantine/modals';

import { useCheckYoutubeAuthQuery, useLazyGetOauthLinkQuery } from '../../api/youtube';

export const withYoutubeAuthPage = <T extends {}>(Wrapped: React.FC<T>) => {
	return (props: T) => {
		const [opened, handlers] = useDisclosure(false);

		const youtubeAuthStatus = useCheckYoutubeAuthQuery();
		const [getOAuthLink, getOAuthLinkStatus] = useLazyGetOauthLinkQuery();

		useEffect(() => {
			if (youtubeAuthStatus.isError) {
				handlers.open();
			} else if (youtubeAuthStatus.isSuccess) {
				if (opened) {
					handlers.close();
				}
				const { refresh } = youtubeAuthStatus.data;
				if (refresh) {
					openModal({
						title: 'Refresh Tokens',
						children: (
							<Stack>
								<Text>Reconnect Google Account to receive update to date subscriptions</Text>
								<Button onClick={() => getOAuthLink()}>Reconnect</Button>
							</Stack>
						),
					});
				}
			}
		}, [
			getOAuthLink,
			handlers,
			opened,
			youtubeAuthStatus.data,
			youtubeAuthStatus.isError,
			youtubeAuthStatus.isSuccess,
		]);

		useEffect(() => {
			if (getOAuthLinkStatus.isSuccess && getOAuthLinkStatus.currentData) {
				const oAuthURL = getOAuthLinkStatus.currentData;
				window.location.href = oAuthURL;
			}
		}, [getOAuthLinkStatus]);

		const buttonText = useMemo(
			() =>
				youtubeAuthStatus.isSuccess && youtubeAuthStatus.currentData && youtubeAuthStatus.currentData.refresh
					? 'Reconnect Google Account'
					: 'Log in with Google',
			[youtubeAuthStatus.currentData, youtubeAuthStatus.isSuccess]
		);

		return (
			<>
				<Modal opened={opened} onClose={handlers.close} withCloseButton={false} closeOnClickOutside={false}>
					<Center>
						<Button
							onClick={() => getOAuthLink()}
							loading={getOAuthLinkStatus.isFetching || getOAuthLinkStatus.isLoading}
						>
							{buttonText}
						</Button>
					</Center>
				</Modal>
				{youtubeAuthStatus.isSuccess && <Wrapped {...props} />}
			</>
		);
	};
};

export default withYoutubeAuthPage;
