import { apiSlice } from "./app/appSlice";

export const locationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLocationss: builder.query({
      query: (url) => `/locations${url}`,
      providesTags: ["locations"],
    }),
    getLocation: builder.query({
      query: (id) => `/locations/${id}`,
    }),
    addLocation: builder.mutation({
      query: (data) => ({
        url: `/locations`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["locations"],
    }),
    updateLocation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/locations/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["locations"],
    }),
    deleteLocation: builder.mutation({
      query: (id) => ({
        url: `/locations/${id}`,
        method: "DELETE",
      }),
      providesTags: ["locations"],
    }),
  }),
});

export const {
  useGetLocationssQuery,
  useAddLocationMutation,
  useGetLocationQuery,
  useDeleteLocationMutation,
  useUpdateLocationMutation,
} = locationApi;
