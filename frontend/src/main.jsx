import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'
import store from './store.js'
import { Provider } from 'react-redux'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import PrivateRoute from './components/PrivateRoute.jsx'
import AdminPrivateRoute from './components/adminComponents/AdminPrivateRoute.jsx'
import Home from './pages/userPages/Home.jsx'
import Login from './pages/userPages/Login.jsx'
import Register from './pages/userPages/Register.jsx'
import EditProfile from './pages/userPages/EditProfile.jsx'
import AdminLogin from './pages/adminPages/AdminLogin.jsx'
import AdminHome from './pages/adminPages/AdminHome.jsx'
import Profile from './pages/userPages/Profile.jsx'



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='' element={<PrivateRoute />}>
        <Route path='/profile' element={<Profile />} />
        <Route path='/editProfile' element={<EditProfile />} />
      </Route>

      <Route path='/admin/' element={<AdminLogin />} />
      <Route path='' element={< AdminPrivateRoute />} >
        <Route path='/admin/home' element={<AdminHome />} />
      </Route>

    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </Provider>
)
