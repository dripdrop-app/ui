import { Button, Container, Loader, Stack, Title } from "@mantine/core";
import { Link, useParams } from "react-router-dom";

import AlertConfirmation from "../../components/AlertConfirmation";

import { useVerifyAccountQuery } from "../../api/auth";

const VerifyAccount = () => {
  const { code } = useParams();

  const verifyAccountStatus = useVerifyAccountQuery(String(code));

  return (
    <Container>
      <Stack sx={{ margin: 20 }} align="center" spacing={40}>
        <Title>Account Verification</Title>
        <Loader sx={{ ...(!verifyAccountStatus.isLoading && { display: "none" }) }} />
        <AlertConfirmation
          showError={verifyAccountStatus.isError}
          errorMessage={String(verifyAccountStatus.error)}
          showSuccess={verifyAccountStatus.isSuccess}
          successMessage="Account Verified !"
        />
        <Button sx={{ ...(verifyAccountStatus.isLoading && { display: "none" }) }} component={Link} to="/">
          Redirect Home
        </Button>
      </Stack>
    </Container>
  );
};

export default VerifyAccount;
