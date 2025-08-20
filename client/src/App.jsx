import "./App.css";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import LandingPage from "./pages/landingPage";
import AuthPage from "./pages/authPage";
import CreateRoomPage from "./pages/createRoomPage";
import VideoCallPage from "./pages/videoCallPage";
import UserDashboard from "./pages/userDashboard";
import NotFound from "./pages/notFoundPage";
import VerifyEmail from "./pages/verifyEmail";
import GoogleSuccess from "./pages/googleSuccess";
import PrivateRoute from "./routeGuard/privateRoute";
import Loader from "./utils/loader";


import { verifyToken } from "./store/actions/auth";

function App() {

  const dispatch = useDispatch();

  const {isloading} = useSelector(state => state.auth);



  useEffect(()=>{
    dispatch(verifyToken());
  }, [dispatch]);



 if(isloading){
  return <Loader/>
 }


  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="auth" element={<AuthPage />} />

        <Route path="create-room" element={<CreateRoomPage />} />

        <Route
          path="/call-room/:roomId/:username"
          element={<VideoCallPage />}
        />

        <Route path="/verify-email" element={<VerifyEmail />} />

         <Route path="/google-success" element={<GoogleSuccess />} />

         <Route element={<PrivateRoute/>}>
            <Route path="dashboard" element={<UserDashboard />} />
         </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
