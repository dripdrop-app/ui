import React, { useCallback, useMemo, useState } from 'react';
import { Stack, Alert, Button, Container, Tab, Tabs, TextField, IconButton, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useLoginMutation, useCreateMutation, useCheckSessionQuery } from '../../api/auth';
import { isFetchBaseQueryError } from '../../utils/helpers';

export const withAuth = <T extends {}>(
	Component: React.FunctionComponent<T>,
	UnAuthenticatedRender: React.FunctionComponent<{}>
) => {
	return (props: T) => {
		const sessionStatus = useCheckSessionQuery();

		return useMemo(() => {
			if (sessionStatus.isFetching || sessionStatus.isLoading) {
				return (
					<Stack direction="row" justifyContent="center">
						<CircularProgress />
					</Stack>
				);
			} else if (sessionStatus.isSuccess && sessionStatus.currentData) {
				return <Component {...props} />;
			}
			return <UnAuthenticatedRender />;
		}, [props, sessionStatus.currentData, sessionStatus.isFetching, sessionStatus.isLoading, sessionStatus.isSuccess]);
	};
};

interface AuthFormProps {
	error?: string | null;
	loading: boolean;
	onSubmit: (email: string, password: string) => void;
}

const AuthForm = (props: AuthFormProps) => {
	const { error, loading, onSubmit } = props;

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	return useMemo(
		() => (
			<Container>
				<Stack direction="column" spacing={2}>
					{error ? <Alert severity="error">{error}</Alert> : null}
					<TextField type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
					<TextField
						type={showPassword ? 'text' : 'password'}
						label="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						fullWidth
						InputProps={{
							endAdornment: (
								<IconButton onClick={() => setShowPassword(!showPassword)}>
									<Visibility sx={{ display: showPassword ? 'none' : 'block' }} />
									<VisibilityOff sx={{ display: !showPassword ? 'none' : 'block' }} />
								</IconButton>
							),
						}}
					/>
					<Stack direction="row" spacing={2}>
						<LoadingButton variant="contained" loading={loading} onClick={() => onSubmit(email, password)}>
							Submit
						</LoadingButton>
						<Button
							variant="contained"
							onClick={() => {
								setEmail('');
								setPassword('');
							}}
						>
							Reset
						</Button>
					</Stack>
				</Stack>
			</Container>
		),
		[email, error, loading, onSubmit, password, showPassword]
	);
};

const AuthPage = () => {
	const [tab, setTab] = useState(0);

	const [login, loginStatus] = useLoginMutation();
	const [create, createStatus] = useCreateMutation();

	const loginError = useMemo(() => {
		if (loginStatus.isError) {
			if (isFetchBaseQueryError(loginStatus.error)) {
				return String(loginStatus.error.data);
			} else if (loginStatus.error.message) {
				return loginStatus.error.message;
			}
		}
		return null;
	}, [loginStatus.error, loginStatus.isError]);

	const createError = useMemo(() => {
		if (createStatus.isError) {
			if (isFetchBaseQueryError(createStatus.error)) {
				return String(createStatus.error.data);
			} else if (createStatus.error.message) {
				return createStatus.error.message;
			}
		}
		return null;
	}, [createStatus.error, createStatus.isError]);

	const onSubmitForm = useCallback(
		(email: string, password: string) => {
			if (tab === 0) {
				login({ email, password });
			} else {
				create({ email, password });
			}
		},
		[tab, login, create]
	);

	const loading = useMemo(
		() => loginStatus.isLoading || createStatus.isLoading,
		[createStatus.isLoading, loginStatus.isLoading]
	);

	return useMemo(() => {
		return (
			<Container>
				<Tabs value={tab}>
					<Tab label="Login" onClick={() => setTab(0)} />
					<Tab label="Sign up" onClick={() => setTab(1)} />
				</Tabs>
				<Stack direction="column" paddingY={4}>
					{tab === 0 ? <AuthForm loading={loading} error={loginError} onSubmit={onSubmitForm} /> : null}
					{tab === 1 ? <AuthForm loading={loading} error={createError} onSubmit={onSubmitForm} /> : null}
				</Stack>
			</Container>
		);
	}, [createError, loading, loginError, onSubmitForm, tab]);
};

const withAuthPage = <T extends {}>(Component: React.FunctionComponent<T>) => {
	return (props: T) => withAuth(Component, AuthPage)(props);
};

export default withAuthPage;
