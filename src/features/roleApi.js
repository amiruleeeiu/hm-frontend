import { apiSlice } from "./app/appSlice";

const roleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: () => "/roles",
      providesTags: ["roles"],
    }),
    getRole: builder.query({
      query: (id) => `/roles/${id}`,
      // invalidatesTags:['roles']
    }),
    updateRole: builder.mutation({
      query: ({id,data}) =>({
        url:`/roles/${id}`,
        method:'PATCH',
        body:data
      }),
      invalidatesTags:['roles']
    }),
  }),
});

export const { useGetRolesQuery,useGetRoleQuery,useUpdateRoleMutation } = roleApi;
