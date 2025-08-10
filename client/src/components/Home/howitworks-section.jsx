import { FaPlus } from "react-icons/fa6";
import { FaLink } from "react-icons/fa6";
import { RiMessage2Line } from "react-icons/ri";





const HowItWorksSection = ()=>{


    return (
       <div className="mb-24 flex justify-center items-center">
         <div className="w-full max-w-7xl">

            <h1 className="text-center font-bold text-3xl">How It Works</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 px-8">
                <div className="relative step-card overflow-hidden flex flex-col justify-center items-center gap-4 
                border border-white/20 hover:border-[rgba(102,126,234,0.4)] hover:-translate-y-2.5
                shadow-[0_20px_40px_rgba(0,0,0,0.3)] px-8 py-10 rounded-[20px]
                transition-all duration-300 ease-in-out">
                    <div className="text-4xl font-bold bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]
                    rounded-xl p-4 shadow-[0_10px_30px_rgba(102,126,234,0.3)]">
                        <FaPlus/>
                    </div>

                    <h2 className="font-medium text-2xl">Create a Room</h2>

                    <p className="text-white/60 text-center ">
                        Click 'Start a Call' to create a private room. No registration required - get started instantly with a unique room ID.</p>
                </div>

                 <div className="relative step-card overflow-hidden flex flex-col justify-center items-center gap-4 
                border border-white/20 px-8 py-10 rounded-[20px] hover:border-[rgba(102,126,234,0.4)] hover:-translate-y-2.5
                shadow-[0_20px_40px_rgba(0,0,0,0.3)]
                transition-all duration-300 ease-in-out">
                    <div className="text-4xl font-bold bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]
                    rounded-xl p-4 shadow-[0_10px_30px_rgba(102,126,234,0.3)]">
                        <FaLink/>
                    </div>

                    <h2 className="font-medium text-2xl">Share the Link</h2>

                    <p className="text-white/60 text-center ">
                        Copy the secure room link and send it to anyone you want to connect with. Works across all devices and platforms.</p>
                </div>

                 <div className="relative step-card overflow-hidden flex flex-col justify-center items-center gap-4 
                border border-white/20 hover:border-[rgba(102,126,234,0.4)] hover:-translate-y-2.5
                shadow-[0_20px_40px_rgba(0,0,0,0.3)] px-8 py-10 rounded-[20px]
                transition-all duration-300 ease-in-out">
                    <div className="text-4xl font-bold bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]
                    rounded-xl p-4 shadow-[0_10px_30px_rgba(102,126,234,0.3)]">
                        <RiMessage2Line/>
                    </div>

                    <h2 className="font-medium text-2xl">Start Talking</h2>

                    <p className="text-white/60 text-center ">
                        They join and you're instantly connected. High-quality video and audio with end-to-end encryption for your privacy.</p>
                </div>
            </div>

        </div>
       </div>
    )
}


export default HowItWorksSection;