import React, { useMemo, useEffect } from 'react';
import { CircularProgress, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useCheckYoutubeAuthQuery, useLazyGetOauthLinkQuery } from '../../api/youtube';
import withAuthPage from './AuthPage';

export const withYoutubeAuth = <T extends {}>(
	Component: React.FunctionComponent<T>,
	UnAuthenticatedRender: React.FunctionComponent<{}>
) => {
	return (props: T) => {
		const youtubeAuthStatus = useCheckYoutubeAuthQuery();

		return useMemo(() => {
			if (youtubeAuthStatus.isFetching) {
				return (
					<Stack direction="row" justifyContent="center">
						<CircularProgress />
					</Stack>
				);
			} else if (
				youtubeAuthStatus.isSuccess &&
				youtubeAuthStatus.currentData &&
				youtubeAuthStatus.currentData.email &&
				!youtubeAuthStatus.currentData.refresh
			) {
				return <Component {...props} />;
			}
			return <UnAuthenticatedRender />;
		}, [props, youtubeAuthStatus.currentData, youtubeAuthStatus.isFetching, youtubeAuthStatus.isSuccess]);
	};
};

const YoutubeAuthPage = () => {
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
			<Stack direction="row" justifyContent="center">
				<LoadingButton
					variant="contained"
					loading={getOAuthLinkStatus.isFetching || getOAuthLinkStatus.isLoading}
					onClick={() => getOAuthLink()}
				>
					{buttonText}
				</LoadingButton>
			</Stack>
		);
	}, [
		youtubeAuthStatus.isSuccess,
		youtubeAuthStatus.currentData,
		getOAuthLinkStatus.isFetching,
		getOAuthLinkStatus.isLoading,
		getOAuthLink,
	]);
};

const withYoutubeAuthPage = <T extends {}>(Component: React.FunctionComponent<T>) => {
	return (props: T) => withAuthPage(withYoutubeAuth(Component, YoutubeAuthPage))(props);
};

export default withYoutubeAuthPage;
