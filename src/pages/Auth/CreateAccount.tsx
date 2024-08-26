import { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  LoadingOverlay,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

import AlertConfirmation from "../../components/AlertConfirmation";

import { useCreateMutation } from "../../api/auth";

interface CreateAccountForm {
  email: string;
  password: string;
  agree: boolean;
}

export const CreateAccount = () => {
  const { reset, handleSubmit, control } = useForm<CreateAccountForm>({ reValidateMode: "onSubmit" });

  const [create, createStatus] = useCreateMutation();

  const onSubmit = useCallback((data: CreateAccountForm) => create(data), [create]);

  return useMemo(
    () => (
      <Container sx={{ position: "relative" }}>
        <Helmet>
          <title>Create Account</title>
        </Helmet>
        <LoadingOverlay visible={createStatus.isLoading} />
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
            <Controller
              name="agree"
              control={control}
              defaultValue={false}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Checkbox
                  {...field}
                  value={field.value ? 1 : 0}
                  error={fieldState.error?.type === "required" ? "Required" : ""}
                  label={
                    <Text>
                      Agree to our{" "}
                      <Anchor
                        component={Link}
                        to="/terms"
                        sx={{
                          ":hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        Terms of Service
                      </Anchor>{" "}
                      and acknowledge our{" "}
                      <Anchor
                        component={Link}
                        to="/privacy"
                        sx={{
                          ":hover": {
                            textDecoration: "underline",
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
            <AlertConfirmation
              showSuccess={createStatus.isSuccess}
              successMessage="Verify account by clicking link sent to email"
            />
            <AlertConfirmation showError={createStatus.isError} errorMessage={String(createStatus.error)} />
            <Flex gap="md">
              <Button type="submit">Submit</Button>
              <Button onClick={() => reset()}>Clear</Button>
            </Flex>
          </Stack>
        </Box>
      </Container>
    ),
    [
      createStatus.isLoading,
      createStatus.isSuccess,
      createStatus.isError,
      createStatus.error,
      handleSubmit,
      onSubmit,
      control,
      reset,
    ]
  );
};

export default CreateAccount;
