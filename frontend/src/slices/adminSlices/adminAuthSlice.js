import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    adminInfo: localStorage.getItem('adminInfo') ? JSON.parse(localStorage.getItem('adminInfo')) : null
}

const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {
        setCredentials: (state,action) => {
            state.adminInfo = action.payload
            localStorage.setItem('adminInfo', JSON.stringify(action.payload))
        },
        adminLogout: (state,action) => {
            state.adminInfo = null
            localStorage.removeItem('adminInfo')
        }
    }
})

export const { setCredentials, adminLogout } = adminAuthSlice.actions

export default adminAuthSlice.reducer