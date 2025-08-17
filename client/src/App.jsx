import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import LandingPage from "./pages/landingPage";
import AuthPage from "./pages/authPage";
import CreateRoomPage from "./pages/createRoomPage";
import VideoCallPage from "./pages/videoCallPage";
import UserDashboard from "./pages/userDashboard";
import NotFound from "./pages/notFoundPage";
import VerifyEmail from "./pages/verifyEmail";
import GoogleSuccess from "./pages/googleSuccess";


function App() {
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

        <Route path="userDashboard" element={<UserDashboard />} />

        <Route path="/verify-email" element={<VerifyEmail />} />

         <Route path="/google-success" element={<GoogleSuccess />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
