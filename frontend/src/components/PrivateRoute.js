import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
// outlet is the page we need to show if logged in
const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth)
  //replace is to replace any past history
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />
}
export default PrivateRoute
