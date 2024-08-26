import api, { tags, Tags, Methods, transformErrorResponse } from ".";

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    checkSession: build.query<User, void>({
      query: () => ({
        url: "/auth/session",
        method: Methods.GET,
      }),
      providesTags: [Tags.USER],
    }),
    create: build.mutation<AuthenticatedResponse, LoginBody>({
      query: ({ email, password }) => ({
        url: "/auth/create",
        method: Methods.POST,
        body: { email, password },
      }),
      invalidatesTags: (result) => (result ? tags : []),
      transformErrorResponse,
    }),
    login: build.mutation<AuthenticatedResponse, LoginBody>({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: Methods.POST,
        body: { email, password },
      }),
      invalidatesTags: (result) => (result ? tags : []),
      transformErrorResponse,
    }),
    logout: build.mutation<undefined, void>({
      query: () => ({
        url: "/auth/logout",
        method: Methods.GET,
      }),
      invalidatesTags: (_, error) => (!error ? tags : []),
    }),
    sendResetEmail: build.mutation<void, string>({
      query: (email) => ({
        url: "/auth/sendreset",
        method: Methods.POST,
        body: { email },
      }),
      transformErrorResponse,
    }),
    resetPassword: build.mutation<void, ResetPasswordBody>({
      query: ({ token, password }) => ({
        url: "/auth/reset",
        method: Methods.POST,
        body: { token, password },
      }),
      transformErrorResponse,
    }),
    verifyAccount: build.query<void, string>({
      query: (token) => ({
        url: "/auth/verify",
        method: Methods.GET,
        params: { token },
      }),
      transformErrorResponse,
    }),
  }),
});

export default authApi;
export const {
  useCheckSessionQuery,
  useCreateMutation,
  useLoginMutation,
  useLogoutMutation,
  useSendResetEmailMutation,
  useVerifyAccountQuery,
  useResetPasswordMutation,
} = authApi;
