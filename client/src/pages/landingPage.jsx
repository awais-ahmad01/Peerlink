import Header from "../components/header";
import HeroSection from "../components/Home/hero-section";
import JoinRoomSection from "../components/Home/joinRoom-section";
import HowItWorksSection from "../components/Home/howitworks-section";
import FeaturesSection from "../components/Home/features-section";
import Footer from "../components/footer";


const LandingPage = ()=>{
    return(
        <>

        <Header/>
            
       <HeroSection/>

       <JoinRoomSection/>

       <HowItWorksSection/>

       <FeaturesSection/>

       <Footer/>
        </>
    )
}

export default LandingPage;