import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";


const JoinRoomSection = () => {
  const [username, setUsername] = useState('');
  const roomRef = useRef();
  const navigate = useNavigate();


  const handleJoinRoom = ()=>{
    const input = roomRef.current?.value.trim();

    if(!input) return

    let roomId = input;
    
    if(input.startsWith('http')){
      const path = new URL(input);
      
      roomId = path.pathname.split('/').pop();
    }
    
    navigate(`/call-room/${roomId}/${username}`);
  }

  return (
    <div className="flex items-center justify-center px-8 mb-24">
      <div className="w-full max-w-lg border border-white/20 p-7 rounded-xl
      transition-all duration-300 ease-in-out hover:border-[#667eea]  ">
        <div className="mb-7">
          <h3 className="font-medium text-white/80">Join an existing room</h3>
          <input
            type="text"
            value={username}
            onChange={(e)=> setUsername(e.target.value)}
            placeholder="Enter username"
            className="block w-full mt-4 p-3 rounded-xl bg-[rgba(15,20,25,0.8)]
                    border border-white/20 text-white 
                    focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.2)]"
          />
          <input
            type="text"
            ref={roomRef}
            placeholder="Enter Room ID or URL"
            className="block w-full mt-4 p-3 rounded-xl bg-[rgba(15,20,25,0.8)]
                    border border-white/20 text-white 
                    focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.2)]"
          />
        </div>

        <div>
          <button
            onClick={handleJoinRoom}
            disabled = {username.trim()===''}
            className="w-full text-[0.9rem] bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] 
                        shadow-[0_4px_15px_rgba(102,126,234,0.3)] py-3 px-6 rounded-xl 
                        font-semibold cursor-pointer transition-all duration-300 
                        ease-in-out text-white
                        hover:translate-y-[-2px] hover:shadow-[0_8px_25px_rgba(102,126,234,0.4)]"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinRoomSection;
