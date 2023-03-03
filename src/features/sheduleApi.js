import { apiSlice } from "./app/appSlice";

export const sheduleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShedules: builder.query({
      query: (url) => `/shedules${url}`,
      providesTags: ["shedules"],
    }),
    getShedule: builder.query({
      query: (id) => `/shedules/${id}`,
    }),
    addShedule: builder.mutation({
      query: (data) => ({
        url: "/shedules",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["shedules"],
    }),
    updateShedule: builder.mutation({
      query: ({ id, data }) => ({
        url: `/shedules/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["shedules"],
    }),
    deleteShedule: builder.mutation({
      query: (id) => ({
        url: `/shedules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["shedules"],
    }),
  }),
});

export const {
  useGetShedulesQuery,
  useAddSheduleMutation,
  useDeleteSheduleMutation,
  useGetSheduleQuery,
  useUpdateSheduleMutation,
} = sheduleApi;
