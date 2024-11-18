import { Box, Button, Container, Flex, LoadingOverlay, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import AlertConfirmation from "../../components/AlertConfirmation";
import ForgotPasswordModal from "../../components/Auth/ForgotPasswordModal";

import { useLoginMutation } from "../../api/auth";

interface LoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const { reset, handleSubmit, control } = useForm<LoginForm>({ reValidateMode: "onSubmit" });

  const [login, loginStatus] = useLoginMutation();

  const onSubmit = useCallback((data: LoginForm) => login(data), [login]);

  return (
    <Container pos="relative">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <LoadingOverlay visible={loginStatus.isLoading} />
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack p="md">
          <Controller
            name="email"
            control={control}
            defaultValue={""}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                label="Email"
                placeholder="Enter Email"
                error={fieldState.error?.type === "required" ? "Required" : ""}
                required
                withAsterisk
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue={""}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <PasswordInput
                {...field}
                label="Password"
                placeholder="Enter Password"
                error={fieldState.error?.type === "required" ? "Required" : ""}
                required
                withAsterisk
              />
            )}
          />
          <Box>
            <ForgotPasswordModal />
          </Box>
          <AlertConfirmation showError={loginStatus.isError} errorMessage={String(loginStatus.error)} />
          <Flex gap="md">
            <Button type="submit">Submit</Button>
            <Button onClick={() => reset()}>Clear</Button>
          </Flex>
          <Button component={Link} to="/create" variant="outline">
            Create Account
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Login;
