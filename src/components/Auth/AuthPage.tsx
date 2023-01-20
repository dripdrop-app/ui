import React, { useEffect, useMemo, useState } from 'react';
import { Button, Container, Flex, LoadingOverlay, Modal, PasswordInput, Stack, Tabs, TextInput } from '@mantine/core';

import { useLoginMutation, useCreateMutation, useCheckSessionQuery } from '../../api/auth';
import { useDisclosure } from '@mantine/hooks';

interface AuthFormProps {
	onSubmit: (email: string, password: string) => void;
}

const AuthForm = (props: AuthFormProps) => {
	const { onSubmit } = props;

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	return useMemo(
		() => (
			<Stack p="md">
				<TextInput label="Email" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} withAsterisk />
				<PasswordInput
					label="Password"
					placeholder="Enter Password"
					onChange={(e) => setPassword(e.target.value)}
					withAsterisk
				/>
				<Flex gap="md">
					<Button onClick={() => onSubmit(email, password)}>Submit</Button>
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
		[email, onSubmit, password]
	);
};

export const AuthPage = () => {
	const [login, loginStatus] = useLoginMutation();
	const [create, createStatus] = useCreateMutation();

	return useMemo(
		() => (
			<Container sx={{ position: 'relative' }}>
				<LoadingOverlay visible={loginStatus.isLoading || createStatus.isLoading} />
				<Tabs defaultValue="0">
					<Tabs.List>
						<Tabs.Tab value="0">Login</Tabs.Tab>
						<Tabs.Tab value="1">Sign up</Tabs.Tab>
					</Tabs.List>
					<Tabs.Panel value="0">
						<AuthForm onSubmit={(email, password) => login({ email, password })} />
					</Tabs.Panel>
					<Tabs.Panel value="1">
						<AuthForm onSubmit={(email, password) => create({ email, password })} />
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
				<Wrapped {...props} />
			</>
		);
	};
};

export default withAuthPage;
