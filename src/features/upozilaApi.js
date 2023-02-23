import { apiSlice } from "./app/appSlice";

export const upozilaApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUpozilas: builder.query({
      query: (url) => `/upozilas${url}`,
      providesTags: ["upozilas"],
    }),
    getUpozila: builder.query({
      query: (id) => `/upozilas/${id}`,
      invalidatesTags: ["upozilas"],
    }),
    addUpozila: builder.mutation({
      query: (data) => ({
        url: `/upozilas`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["upozilas"],
    }),
    updateUpozila: builder.mutation({
      query: ({ id, data }) => ({
        url: `/upozilas/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["upozilas"],
    }),
    deleteUpozila: builder.mutation({
      query: (id) => ({
        url: `/upozilas/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["upozilas"],
    }),
  }),
});

export const {
  useGetUpozilasQuery,
  useGetUpozilaQuery,
  useAddUpozilaMutation,
  useDeleteUpozilaMutation,
  useUpdateUpozilaMutation,
} = upozilaApi;
