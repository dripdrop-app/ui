import { useMemo, useEffect } from 'react';
import { Button, Center } from '@mantine/core';

import { useCheckYoutubeAuthQuery, useLazyGetOauthLinkQuery } from '../../api/youtube';

export const YoutubeAuthPage = () => {
	const youtubeAuthStatus = useCheckYoutubeAuthQuery();
	const [getOAuthLink, getOAuthLinkStatus] = useLazyGetOauthLinkQuery();

	useEffect(() => {
		if (getOAuthLinkStatus.isSuccess && getOAuthLinkStatus.currentData) {
			const oAuthURL = getOAuthLinkStatus.currentData;
			window.location.href = oAuthURL;
		}
	}, [getOAuthLinkStatus]);

	return useMemo(() => {
		const buttonText =
			youtubeAuthStatus.isSuccess && youtubeAuthStatus.currentData && youtubeAuthStatus.currentData.refresh
				? 'Reconnect Google Account'
				: 'Log in with Google';
		return (
			<Center>
				<Button onClick={() => getOAuthLink()} loading={getOAuthLinkStatus.isFetching || getOAuthLinkStatus.isLoading}>
					{buttonText}
				</Button>
			</Center>
		);
	}, [
		youtubeAuthStatus.isSuccess,
		youtubeAuthStatus.currentData,
		getOAuthLinkStatus.isFetching,
		getOAuthLinkStatus.isLoading,
		getOAuthLink,
	]);
};

export default YoutubeAuthPage;
