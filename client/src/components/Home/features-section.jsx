
const FeaturesSection = ()=>{


    return (
        <div className="mb-24 flex justify-center items-center">
            <div className="w-full max-w-7xl">

            <h1 className="text-center font-bold text-3xl">Features You'll Love</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10 px-8 ">
                <div className="flex justify-center items-center gap-4 
                border border-white/20 hover:border-[rgba(102,126,234,0.4)] 
                shadow-[0_20px_40px_rgba(0,0,0,0.3)] p-7 rounded-[20px]
                transition-all duration-300 ease-in-out">
                    <div className="text-[20px] font-bold bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]
                    rounded-xl py-4 px-1 shadow-[0_10px_30px_rgba(102,126,234,0.3)]">
                        🔒
                    </div>

                   <div className="flex  flex-col gap-2">
                     <h2 className="font-medium text-[18px]">Private & Secure</h2>

                    <p className="text-white/60 text-[14px]">
                        End-to-end encrypted calls with no data stored on our servers.</p>
                   </div>
                </div>

                 <div className="flex justify-center items-center gap-4 
                border border-white/20 hover:border-[rgba(102,126,234,0.4)] 
                shadow-[0_20px_40px_rgba(0,0,0,0.3)] p-7 rounded-[20px]
                transition-all duration-300 ease-in-out">
                    <div className="text-[20px] font-bold bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]
                    rounded-xl py-4 px-1 shadow-[0_10px_30px_rgba(102,126,234,0.3)]">
                        ⚡
                    </div>

                   <div className="flex  flex-col gap-2">
                     <h2 className="font-medium text-[18px]">No Signup Needed</h2>

                    <p className="text-white/60 text-[14px]">
                        Start calling immediately without creating accounts or downloading apps.</p>
                   </div>
                </div>

                <div className="flex justify-center items-center gap-4 
                border border-white/20 hover:border-[rgba(102,126,234,0.4)] 
                shadow-[0_20px_40px_rgba(0,0,0,0.3)] p-7 rounded-[20px]
                transition-all duration-300 ease-in-out">
                    <div className="text-[20px] font-bold bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]
                    rounded-xl py-4 px-1 shadow-[0_10px_30px_rgba(102,126,234,0.3)]">
                        📱
                    </div>

                   <div className="flex  flex-col gap-2">
                     <h2 className="font-medium text-[18px]">Mobile Friendly</h2>

                    <p className="text-white/60 text-[14px]">
                        Works perfectly on desktop, tablet, and mobile devices.</p>
                   </div>
                </div>

                <div className="flex justify-center items-center gap-4 
                border border-white/20 hover:border-[rgba(102,126,234,0.4)] 
                shadow-[0_20px_40px_rgba(0,0,0,0.3)] p-7 rounded-[20px]
                transition-all duration-300 ease-in-out">
                    <div className="text-[20px] font-bold bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]
                    rounded-xl py-4 px-1 shadow-[0_10px_30px_rgba(102,126,234,0.3)]">
                        🌐
                    </div>

                   <div className="flex  flex-col gap-2">
                     <h2 className="font-medium text-[18px]">Free & Open Source</h2>

                    <p className="text-white/60 text-[14px]">
                       Completely free to use with transparent, open-source code.</p>
                   </div>
                </div>

                  <div className="flex justify-center items-center gap-4 
                border border-white/20 hover:border-[rgba(102,126,234,0.4)] 
                shadow-[0_20px_40px_rgba(0,0,0,0.3)] p-7 rounded-[20px]
                transition-all duration-300 ease-in-out">
                    <div className="text-[20px] font-bold bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]
                    rounded-xl py-4 px-1 shadow-[0_10px_30px_rgba(102,126,234,0.3)]">
                        🎥
                    </div>

                   <div className="flex  flex-col gap-2">
                     <h2 className="font-medium text-[18px]">HD Video Quality</h2>

                    <p className="text-white/60 text-[14px]">
                       Crystal clear video and audio optimized for any connection.</p>
                   </div>
                </div>

                  <div className="flex justify-center items-center gap-4 
                border border-white/20 hover:border-[rgba(102,126,234,0.4)] 
                shadow-[0_20px_40px_rgba(0,0,0,0.3)] p-7 rounded-[20px]
                transition-all duration-300 ease-in-out">
                    <div className="text-[20px] font-bold bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]
                    rounded-xl py-4 px-1 shadow-[0_10px_30px_rgba(102,126,234,0.3)]">
                        🚀
                    </div>

                   <div className="flex  flex-col gap-2">
                     <h2 className="font-medium text-[18px]">Lightning Fast</h2>

                    <p className="text-white/60 text-[14px]">
                       Instant room creation and connection with minimal latency.</p>
                   </div>
                </div>
            </div>

        </div>
        </div>
    )
}


export default FeaturesSection;