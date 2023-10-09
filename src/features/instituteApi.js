import { apiSlice } from "./app/appSlice";

export const instituteApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInstitutes: builder.query({
      query: (url) => `/institutes${url}`,
      providesTags: ["institutes"],
    }),
    getInstitute: builder.query({
      query: (id) => `/institutes/${id}`,
    }),
    addInstitute: builder.mutation({
      query: (data) => ({
        url: "/institutes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["institutes"],
    }),
    updateInstitute: builder.mutation({
      query: ({ _id, data }) => {
        return ({
          url: `/institutes/${_id}`,
          method: "PUT",
          body: data,
        })
      },
      invalidatesTags: ["institutes"],
    }),
    deleteInstitute: builder.mutation({
      query: (id) => ({
        url: `/institutes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["institutes"],
    }),
  }),
});

export const {
  useGetInstitutesQuery,
  useGetInstituteQuery,
  useAddInstituteMutation,
  useUpdateInstituteMutation,
  useDeleteInstituteMutation,
} = instituteApi;
