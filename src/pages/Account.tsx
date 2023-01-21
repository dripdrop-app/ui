import { useMemo } from 'react';
import { Button, Checkbox, Container, Stack, TextInput } from '@mantine/core';
import { Link } from 'react-router-dom';

import { useCheckSessionQuery, useLogoutMutation } from '../api/auth';
import withAuthPage from '../components/Auth/AuthPage';

const Account = () => {
	const sessionStatus = useCheckSessionQuery();
	const [logout, logoutStatus] = useLogoutMutation();

	const user = useMemo(() => {
		if (sessionStatus.isSuccess && sessionStatus.currentData) {
			return sessionStatus.currentData;
		}
		return null;
	}, [sessionStatus.currentData, sessionStatus.isSuccess]);

	return useMemo(() => {
		if (user) {
			return (
				<Container>
					<Stack spacing="md">
						<TextInput label="Email" value={user.email} onChange={() => {}} />
						<Checkbox label="Admin" checked={user.admin} onChange={() => {}} />
						<Button component={Link} to="/terms">
							Terms of Service
						</Button>
						<Button component={Link} to="/privacy">
							Privacy Policy
						</Button>
						<Button variant="light" color="red" onClick={() => logout()} loading={logoutStatus.isLoading}>
							Logout
						</Button>
					</Stack>
				</Container>
			);
		}
		return null;
	}, [logout, logoutStatus.isLoading, user]);
};

export default withAuthPage(Account);
