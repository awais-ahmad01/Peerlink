
import './App.css'

import Header from './components/header';
import HeroSection from './components/Home/hero-section';
import JoinRoomSection from './components/Home/joinRoom-section';
import HowItWorksSection from './components/Home/howitworks-section';
import FeaturesSection from './components/Home/features-section';
import Footer from './components/footer';
import CameraSection from './components/videoChatInterface/camera-section';
import CreateRoom from './components/createRoomInterface/createRoom';
import Dashboard from './components/userDashboard/dashboard';
import AuthPage from './components/Auth/auth';


function App() {
  

  return (
    <>
       {/* <Header/> */}

      <AuthPage/>

      {/* <Dashboard/>*/}

      {/* <CreateRoom/> */}

       {/* <CameraSection/> */}
{/* 
       <HeroSection/>

       <JoinRoomSection/>

       <HowItWorksSection/>

       <FeaturesSection/>

       <Footer/> */}
    </>
  )
}

export default App
