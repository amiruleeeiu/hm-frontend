import { apiSlice } from "./app/appSlice";

export const appointmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query({
      query: (url) => `/appointments${url}`,
      providesTags: ["appointments"],
    }),
    getAppointment: builder.query({
      query: (id) => `/appointments/${id}`,
    }),
    addAppointment: builder.mutation({
      query: (data) => ({
        url: "/appointments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["appointments"],
    }),
    updateAppointment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/appointments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags:(data)=> data && ["appointments"],
    }),
    changeStatus: builder.mutation({
      query: ({ id, data }) => {
        console.log(id)
        console.log(data)
        return (
          {
            url: `/appointments/change-status/${id}`,
            method: "PUT",
            body: data,
          }
        )
      },
      
      invalidatesTags: ["appointments"],
    }),
    deleteAppointment: builder.mutation({
      query: (id) => ({
        url: `/appointments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["appointments"],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useAddAppointmentMutation,
  useDeleteAppointmentMutation,
  useChangeStatusMutation,
  useGetAppointmentQuery,
  useUpdateAppointmentMutation,
} = appointmentApi;
