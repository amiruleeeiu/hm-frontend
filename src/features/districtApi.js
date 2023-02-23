import { apiSlice } from "./app/appSlice";

export const districtApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDistricts: builder.query({
      query: (url) => `/districts${url}`,
      providesTags: ["districts"],
    }),
    getDistrict: builder.query({
      query: (id) => `/districts/${id}`,
    }),
    addDistrict: builder.mutation({
      query: (data) => ({
        url: "/districts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["districts"],
    }),
    updateDistrict: builder.mutation({
      query: ({ id, data }) => ({
        url: `/districts/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["districts"],
    }),
    deleteDistrict: builder.mutation({
      query: (id) => ({
        url: `/districts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["districts"],
    }),
  }),
});

export const {
  useGetDistrictsQuery,
  useGetDistrictQuery,
  useAddDistrictMutation,
  useUpdateDistrictMutation,
  useDeleteDistrictMutation,
} = districtApi;
