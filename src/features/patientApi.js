import { apiSlice } from "./app/appSlice";

export const patientApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPatients: builder.query({
      query: (url) => `/patients${url}`,
      providesTags: ["patients"],
    }),
    getPatient: builder.query({
      query: (id) => `/patients/${id}`,
    }),
    addPatient: builder.mutation({
      query: (data) => ({
        url: "/patients",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["patients"],
    }),
    updatePatient: builder.mutation({
      query: ({ id, data }) => ({
        url: `/patients/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["patients"],
    }),
    deletePatient: builder.mutation({
      query: (id) => ({
        url: `/patients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["patients"],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useGetPatientQuery,
  useAddPatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} = patientApi;
