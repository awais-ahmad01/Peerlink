import { useParams } from "react-router-dom";

const Header = () => {

  const {roomId} = useParams();

  return (
    <header className="flex justify-between items-center px-3 sm:px-8 py-6 bg-[rgba(30,41,59,0.9)] backdrop-blur-md border-b border-white/10 fixed w-full top-0 z-[100] flex-wrap gap-2">

      <div className="text-white font-bold text-lg sm:text-2xl before:content-['📹'] before:mr-2 whitespace-nowrap">
        PeerLink
      </div>

    
      <span className="bg-[rgba(79,70,229,0.2)] px-3 sm:px-4 py-1.5 rounded-md text-indigo-300 font-mono text-lg sm:text-sm whitespace-nowrap">
        ROOM - {roomId}
      </span>

      {/* <button className="px-3 sm:px-4 py-1.5 border-2 border-red-500 text-red-500 rounded-md font-medium transition-all duration-300 hover:bg-red-500 hover:text-white whitespace-nowrap">
        Leave Room
      </button> */}
    </header>
  );
};

export default Header;
