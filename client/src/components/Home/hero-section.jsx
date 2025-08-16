import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="mb-24 flex justify-center items-center">
      <div className="w-full max-w-7xl">
        <div className="flex flex-col-reverse lg:flex-row justify-center items-center gap-8 p-8 pt-32 md:pt-40">
          <div className="lg:w-[50%] ">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6">
              Instant, private video calls — no downloads needed.
            </h1>
            <p className="text-lg sm:text-xl text-[rgba(255,255,255,0.7)] mb-8 max-w-xl">
              Create a secure room and connect with anyone, anywhere. Just share
              the link and talk. Experience seamless video calling with
              enterprise-grade security.
            </p>

            <div className="flex gap-4">
              <Link
                to="create-room"
                className="text-[0.9rem] bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] 
                        shadow-[0_4px_15px_rgba(102,126,234,0.3)] py-3 px-5 sm:py-4 sm:px-6 rounded-xl 
                        font-semibold cursor-pointer transition-all duration-300 
                        ease-in-out text-white
                        hover:translate-y-[-2px] hover:shadow-[0_8px_25px_rgba(102,126,234,0.4)]"
              >
                Start a Call
              </Link>
              {/* <Link
                to="#"
                className="text-[0.9rem] bg-transparent py-3 px-5 sm:py-4 sm:px-6 rounded-xl 
                        font-semibold cursor-pointer transition-all duration-300 
                        ease-in-out text-[rgba(255,255,255,0.9)] border border-[rgba(255,255,255,0.2)]
                        hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.3)]"
              >
                Join Room
              </Link> */}
            </div>
          </div>

          <div>
            <img
              src="/images/peerlink.png"
              alt="peerlink"
              className="w-full max-w-[500px] h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
