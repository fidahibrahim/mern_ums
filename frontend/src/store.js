import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import { apiSlice } from './slices/apiSlice'
import adminAuthSlice from './slices/adminSlices/adminAuthSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        adminAuth: adminAuthSlice,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

export default store