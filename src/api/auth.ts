import api, { tags, Tags, Methods } from '.';

const authApi = api.injectEndpoints({
	endpoints: (build) => ({
		checkSession: build.query<User, void>({
			query: () => ({
				url: '/auth/session',
				method: Methods.GET,
			}),
			providesTags: [Tags.USER],
		}),
		create: build.mutation<AuthenticatedResponse, LoginBody>({
			query: ({ email, password }) => ({
				url: '/auth/create',
				method: Methods.POST,
				body: { email, password },
			}),
			invalidatesTags: (result) => (result ? tags : []),
		}),
		login: build.mutation<AuthenticatedResponse, LoginBody>({
			query: ({ email, password }) => ({
				url: '/auth/login',
				method: Methods.POST,
				body: { email, password },
			}),
			invalidatesTags: (result) => (result ? tags : []),
		}),
		logout: build.mutation<undefined, void>({
			query: () => ({
				url: '/auth/logout',
				method: Methods.GET,
			}),
			invalidatesTags: (result, error) => (!error ? tags : []),
		}),
	}),
});

export default authApi;
export const { useCheckSessionQuery, useCreateMutation, useLoginMutation, useLogoutMutation } = authApi;
