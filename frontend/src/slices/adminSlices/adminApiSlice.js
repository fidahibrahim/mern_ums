import { apiSlice } from "../apiSlice";
const ADMIN_URL = '/api/admin'

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        adminLogin: builder.mutation({
            query: (data) => ({ 
                url: `${ADMIN_URL}`,
                method: 'POST',
                body: data
            }),
        }),
        adminLogout: builder.mutation({
            query: () => ({
                url: `${ADMIN_URL}/logout`,
                method: 'POST'
            }),
        }),
        getUsers: builder.mutation({
            query: (data) => ({
                url: `${ADMIN_URL}/users?search=${data.search || ''}`,
                method: 'GET'
            })
        }),
        addNewUser: builder.mutation({
            query: (data) => ({
                url: `${ADMIN_URL}/users`,
                method: 'POST',
                body: data
            }),
        }),
        editUser: builder.mutation({
            query: (data) => ({
                url: `${ADMIN_URL}/users`,
                method: 'PUT',
                body: data
            }),
        }),
        deleteUser: builder.mutation({
            query: (data) => ({
                url: `${ADMIN_URL}/users`,
                method: 'DELETE',
                body: data
            })
        })
    })
})


export const {
    useAdminLoginMutation,
    useAdminLogoutMutation,
    useGetUsersMutation,
    useAddNewUserMutation,
    useEditUserMutation,
    useDeleteUserMutation
} = adminApiSlice