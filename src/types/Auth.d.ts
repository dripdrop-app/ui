interface User {
  email: string;
  admin: boolean;
}

interface AuthenticatedResponse {
  access_token: string;
  token_type: string;
  user: User;
}

interface LoginBody {
  email: string;
  password: string;
}

interface ResetPasswordBody {
  token: string;
  password: string;
}
