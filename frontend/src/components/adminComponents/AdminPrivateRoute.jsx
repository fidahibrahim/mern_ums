import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"


const adminPrivateRoute = () => {
    const {adminInfo} = useSelector((state) => state.adminAuth)

  return adminInfo ? <Outlet/> : <Navigate to='/admin/' />
}

export default adminPrivateRoute
