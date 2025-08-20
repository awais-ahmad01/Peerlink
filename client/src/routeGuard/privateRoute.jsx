// components/PrivateRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
// import { Loader } from "@mantine/core";

const PrivateRoute = () => {

    console.log('private route triggered.')

  const {isAuthenticated, isloading} = useSelector((state) => state.auth);

  console.log('isAuthen: ', isAuthenticated)

  

  // if (isloading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Loader/>
  //     </div>
  //   );
  // }


  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
