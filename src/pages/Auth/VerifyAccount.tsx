import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Container, Loader, Stack, Title } from '@mantine/core';

import AlertConfirmation from '../../components/AlertConfirmation';

import { useVerifyAccountQuery } from '../../api/auth';

const VerifyAccount = () => {
	const { code } = useParams();

	const verifyAccountStatus = useVerifyAccountQuery(String(code));

	return useMemo(
		() => (
			<Container>
				<Stack sx={{ margin: 20 }} align="center" spacing={40}>
					<Title>Account Verification</Title>
					<Loader sx={{ ...(!verifyAccountStatus.isLoading && { display: 'none' }) }} />
					<AlertConfirmation
						showError={verifyAccountStatus.isError}
						errorMessage={String(verifyAccountStatus.error)}
						showSuccess={verifyAccountStatus.isSuccess}
						successMessage="Account Verified !"
					/>
					<Button sx={{ ...(verifyAccountStatus.isLoading && { display: 'none' }) }} component={Link} to="/">
						Redirect Home
					</Button>
				</Stack>
			</Container>
		),
		[
			verifyAccountStatus.error,
			verifyAccountStatus.isError,
			verifyAccountStatus.isLoading,
			verifyAccountStatus.isSuccess,
		]
	);
};

export default VerifyAccount;
