import { apiSlice } from "./app/appSlice";

export const subDistrictApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubDistricts: builder.query({
      query: (url) => `/sub-districts${url}`,
      providesTags:['sub-districts']
    }),
    showSubDistrict: builder.query({
      query: (id) => `/sub-districts/${id}`,
    }),
    
    addSubDistrict: builder.mutation({
      query: (data) => ({
        url: "/sub-districts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["sub-districts"],
    }),
    updateSubDistrict: builder.mutation({
      query: ({ id, data }) => ({
        url: `/sub-districts/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["sub-districts"],
    }),
    deleteSubDistrict: builder.mutation({
      query: (id) => ({
        url: `/sub-districts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["sub-districts"],
    }),
  }),
  
});

export const {
  useGetSubDistrictsQuery,
  useShowSubDistrictQuery,
  useAddSubDistrictMutation,
  useDeleteSubDistrictMutation,
  useUpdateSubDistrictMutation
} = subDistrictApi;
