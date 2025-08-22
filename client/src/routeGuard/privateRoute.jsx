// components/PrivateRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../utils/loader";

const PrivateRoute = () => {

    console.log('private route triggered.')

  const {isAuthenticated, isloading} = useSelector((state) => state.auth);

  console.log('isAuthen: ', isAuthenticated)

  

  if (isloading) {
    return (
      <Loader/>
    );
  }


  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
