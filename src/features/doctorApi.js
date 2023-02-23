import { apiSlice } from "./app/appSlice";

export const doctorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query({
      query: (url) => `/doctors${url}`,
      providesTags: ["doctors"],
    }),
    getDoctor: builder.query({
      query: (id) => `/doctors/${id}`,
    }),
    addDoctor: builder.mutation({
      query: (data) => ({
        url: "/doctors",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["doctors"],
    }),
    updateDoctor: builder.mutation({
      query: ({ id, data }) => ({
        url: `/doctors/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["doctors"],
    }),
    deleteDoctor: builder.mutation({
      query: (id) => ({
        url: `/doctors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["doctors"],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorQuery,
  useAddDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = doctorApi;
