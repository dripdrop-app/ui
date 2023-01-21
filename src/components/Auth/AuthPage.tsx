import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Anchor,
	Button,
	Checkbox,
	Container,
	Flex,
	LoadingOverlay,
	Modal,
	PasswordInput,
	Stack,
	Tabs,
	Text,
	TextInput,
} from '@mantine/core';

import { useLoginMutation, useCreateMutation, useCheckSessionQuery } from '../../api/auth';
import { useDisclosure } from '@mantine/hooks';

interface AuthFormProps {
	onSubmit: (email: string, password: string) => void;
	signUp?: boolean;
}

const AuthForm = (props: AuthFormProps) => {
	const { onSubmit, signUp } = props;

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [agree, setAgree] = useState(false);

	return useMemo(
		() => (
			<Stack p="md">
				<TextInput
					label="Email"
					placeholder="Enter Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					withAsterisk
				/>
				<PasswordInput
					label="Password"
					placeholder="Enter Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					withAsterisk
				/>
				<Checkbox
					sx={{ ...(!signUp && { display: 'none' }) }}
					label={
						<Text>
							Agree to our{' '}
							<Anchor
								component={Link}
								to="/terms"
								sx={{
									':hover': {
										textDecoration: 'underline',
									},
								}}
							>
								Terms of Service
							</Anchor>{' '}
							and acknowledge our{' '}
							<Anchor
								component={Link}
								to="/privacy"
								sx={{
									':hover': {
										textDecoration: 'underline',
									},
								}}
							>
								Privacy Policy
							</Anchor>
						</Text>
					}
					checked={agree}
					onChange={(e) => setAgree(e.target.checked)}
				/>
				<Flex gap="md">
					<Button
						onClick={() => {
							if ((signUp && agree) || !signUp) {
								onSubmit(email, password);
							}
						}}
					>
						Submit
					</Button>
					<Button
						onClick={() => {
							setEmail('');
							setPassword('');
						}}
					>
						Clear
					</Button>
				</Flex>
			</Stack>
		),
		[agree, email, onSubmit, password, signUp]
	);
};

export const AuthPage = () => {
	const [login, loginStatus] = useLoginMutation();
	const [create, createStatus] = useCreateMutation();

	return useMemo(
		() => (
			<Container sx={{ position: 'relative' }}>
				<LoadingOverlay visible={loginStatus.isLoading || createStatus.isLoading} />
				<Tabs defaultValue="1">
					<Tabs.List>
						<Tabs.Tab value="0">Login</Tabs.Tab>
						<Tabs.Tab value="1">Sign up</Tabs.Tab>
					</Tabs.List>
					<Tabs.Panel value="0">
						<AuthForm onSubmit={(email, password) => login({ email, password })} />
					</Tabs.Panel>
					<Tabs.Panel value="1">
						<AuthForm onSubmit={(email, password) => create({ email, password })} signUp />
					</Tabs.Panel>
				</Tabs>
			</Container>
		),
		[create, createStatus.isLoading, login, loginStatus.isLoading]
	);
};

const withAuthPage = <T extends {}>(Wrapped: React.FC<T>) => {
	return (props: T) => {
		const [opened, handlers] = useDisclosure(false);

		const sessionStatus = useCheckSessionQuery();

		useEffect(() => {
			if (sessionStatus.isError) {
				handlers.open();
			} else if (sessionStatus.isSuccess && opened) {
				handlers.close();
			}
		}, [handlers, opened, sessionStatus.isError, sessionStatus.isSuccess]);

		return (
			<>
				<Modal opened={opened} onClose={handlers.close} withCloseButton={false} closeOnClickOutside={false}>
					<AuthPage />
				</Modal>
				{sessionStatus.isSuccess && <Wrapped {...props} />}
			</>
		);
	};
};

export default withAuthPage;
