import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Alert,
	Anchor,
	Box,
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
import { useDisclosure } from '@mantine/hooks';
import { Controller, useForm } from 'react-hook-form';
import { MdError } from 'react-icons/md';

import { useLoginMutation, useCreateMutation, useCheckSessionQuery } from '../../api/auth';

interface AuthForm {
	email: string;
	password: string;
	agree: boolean;
}

export const AuthPage = () => {
	const [tab, setTab] = useState<string | null>('0');
	const { reset, handleSubmit, control } = useForm<AuthForm>({ reValidateMode: 'onSubmit' });

	const [login, loginStatus] = useLoginMutation();
	const [create, createStatus] = useCreateMutation();

	const onSubmit = useCallback(
		(data: AuthForm) => {
			if (tab === '0') {
				login({ ...data });
			} else {
				create({ ...data });
			}
		},
		[create, login, tab]
	);

	useEffect(() => {
		reset();
	}, [reset, tab]);

	const error = useMemo(() => {
		if (loginStatus.isError || createStatus.isError) {
			if (loginStatus.startedTimeStamp && createStatus.startedTimeStamp) {
				return loginStatus.startedTimeStamp > createStatus.startedTimeStamp ? loginStatus.error : createStatus.error;
			} else if (loginStatus.startedTimeStamp) {
				return loginStatus.error;
			} else if (createStatus.startedTimeStamp) {
				return createStatus.error;
			}
		}
		return '';
	}, [
		createStatus.error,
		createStatus.isError,
		createStatus.startedTimeStamp,
		loginStatus.error,
		loginStatus.isError,
		loginStatus.startedTimeStamp,
	]);

	return useMemo(
		() => (
			<Container sx={{ position: 'relative' }}>
				<LoadingOverlay visible={loginStatus.isLoading || createStatus.isLoading} />
				<Tabs value={tab} onTabChange={setTab}>
					<Tabs.List>
						<Tabs.Tab value="0">Login</Tabs.Tab>
						<Tabs.Tab value="1">Sign up</Tabs.Tab>
					</Tabs.List>
					<Box component="form" onSubmit={handleSubmit(onSubmit)}>
						<Stack p="md">
							<Controller
								name="email"
								control={control}
								defaultValue={''}
								rules={{ required: true }}
								render={({ field, fieldState }) => (
									<TextInput
										{...field}
										label="Email"
										placeholder="Enter Email"
										error={fieldState.error?.type === 'required' ? 'Required' : ''}
										required
										withAsterisk
									/>
								)}
							/>
							<Controller
								name="password"
								control={control}
								defaultValue={''}
								rules={{ required: true }}
								render={({ field, fieldState }) => (
									<PasswordInput
										{...field}
										label="Password"
										placeholder="Enter Password"
										error={fieldState.error?.type === 'required' ? 'Required' : ''}
										required
										withAsterisk
									/>
								)}
							/>
							<Controller
								name="agree"
								control={control}
								defaultValue={false}
								rules={{ required: tab === '1' }}
								render={({ field, fieldState }) => (
									<Checkbox
										sx={{ ...(tab === '0' && { display: 'none' }) }}
										{...field}
										value={field.value ? 1 : 0}
										error={fieldState.error?.type === 'required' ? 'Required' : ''}
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
									/>
								)}
							/>
							<Alert sx={{ ...(!error && { display: 'none' }) }} icon={<MdError />} title="Error" color="red">
								{error ? String(error) : ''}
							</Alert>
							<Flex gap="md">
								<Button type="submit">Submit</Button>
								<Button onClick={() => reset()}>Clear</Button>
							</Flex>
						</Stack>
					</Box>
				</Tabs>
			</Container>
		),
		[loginStatus.isLoading, createStatus.isLoading, tab, handleSubmit, onSubmit, control, error, reset]
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
