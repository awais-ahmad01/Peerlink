import { IoIosPerson } from "react-icons/io";
import { useState } from "react";

const CameraSection = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [showParticipants, setShowPaticipants] = useState(false);
  const [micOpen, setMicOpen] = useState(false);

  const micToggle = ()=>{
    setMicOpen(!micOpen);
  }

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const toggleParticipants = () => {
    setShowPaticipants(!showParticipants);
  };

  return (
    <div className="pt-28 md:pt-36">
      <div className="relative flex h-[calc(100vh-180px)] p-4 gap-4">
        <div
          className={`${
            chatOpen ? "mr-[320px]" : "mr-0"
          } transition-all duration-300 ease-in-out w-full`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <div className="relative bg-[linear-gradient(135deg,#374151_0%,#1f2937_100%)] shadow-[0_10px_30px_rgba(0,0,0,0.3)] rounded-2xl border-2 border-[rgba(255,255,255,0.1)]">
              <div className="absolute top-3 left-3 bg-black text-white p-4 rounded-xl">
                <h2 className="font-medium">You</h2>
              </div>

              <div className="flex justify-center items-center w-full h-full text-9xl text-white/60">
                <IoIosPerson />
              </div>
            </div>

            <div className="relative bg-[linear-gradient(135deg,#374151_0%,#1f2937_100%)] shadow-[0_10px_30px_rgba(0,0,0,0.3)] rounded-2xl border-2 border-[rgba(255,255,255,0.1)]">
              <div className="absolute top-3 left-3 bg-black text-white p-4 rounded-xl">
                <h2 className="font-medium">Awais</h2>
              </div>

              <div className="flex justify-center items-center w-full h-full text-9xl text-white/60">
                <IoIosPerson />
              </div>
            </div>
          </div>
        </div>

        {/* Chat section - fixed to right side */}
        <div
          className={`fixed top-0 ${
            chatOpen ? "right-0" : "-right-full lg:-right-[320px]"
          } w-full lg:w-[320px]  
                h-screen border-l border-l-white/30 bg-[rgba(30,41,59,0.95)] z-[1000] backdrop-blur-[20px] flex flex-col transition-all duration-300 ease-in-out`}
        >
          {/* Chat Header */}
          <div className="border-b border-b-white/30 py-7 px-4 flex justify-between items-center">
            <div className="text-[18px] font-medium text-white/80">
              Room Chat
            </div>
            <button
              className="text-xl font-bold text-white/70 cursor-pointer hover:text-white"
              onClick={toggleChat}
            >
              ×
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 px-5 py-3 overflow-y-auto">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="text-xs text-white/70">John • 2:34 PM</div>
                <div className="bg-white/10 rounded-2xl p-4 text-[14px] max-w-[80%]">
                  Hey! Can you hear me?
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <div className="text-xs text-white/70">You • 2:35 PM</div>
                <div className="bg-[rgba(79,70,229,0.8)] rounded-2xl p-4 text-[14px] max-w-[80%]">
                  Yes, loud and clear!
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-t-white/10 px-4 py-5 flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-white/10 border border-white/20 p-3 rounded-xl placeholder:text-xs text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <button className="bg-[rgba(79,70,229,0.8)] px-4 py-3 rounded-xl text-xs font-medium hover:bg-[rgba(79,70,229,0.6)] transition-colors">
              Send
            </button>
          </div>
        </div>

        {/*  Participants Panel */}

        <div
          className={`
            fixed top-28 ${
              showParticipants ? "left-0" : "left-[-280px]"
            }  w-[280px] bg-[rgba(30,41,59,0.95)] backdrop-blur-[10px] 
            border-r border-white/10 rounded-tr-xl rounded-br-xl p-6 transition-[left] duration-300 ease-in-out 
            z-[150]
        `}
        >
          <div className="text-lg font-semibold mb-4 text-indigo-300">
            Participants (2)
          </div>
          <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-700 to-purple-700 rounded-full flex items-center justify-center text-xl">
              Y
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">You</div>
              <div className="flex gap-2 text-xs opacity-70">
                <span className="flex items-center gap-1">🎙️ Active</span>
                <span className="flex items-center gap-1">🎥 Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-700 to-purple-700 rounded-full flex items-center justify-center text-xl">
              A
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">Awais</div>
              <div className="flex gap-2 text-xs opacity-70">
                <span className="flex items-center gap-1">🎙️ Muted</span>
                <span className="flex items-center gap-1">🎥 Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[500]">
        <div className="bg-black/80 backdrop-blur-[10px] p-4 rounded-[2rem] flex justify-center items-center gap-3 text-[16px] md:text-2xl border border-white/10">
          <button
            title="Toggle Microphone"
            className={`rounded-full p-4 md:p-6 
            cursor-pointer  transition-all duration-200 hover:scale-110
            ${micOpen ? "bg-green-500":"bg-white/10 hover:bg-white/20"}
            `}
            onClick={micToggle}
          >
            🎙️
          </button>
          <button
            title="Toggle Camera"
            className="rounded-full p-4 md:p-6 bg-white/10 hover:bg-white/20  transition-all duration-200 hover:scale-110"
          >
            🎥
          </button>
          <button
            title="Participants"
            className={`rounded-full p-4 md:p-6
                transition-all duration-200 hover:scale-110 cursor-pointer
                ${showParticipants ? "bg-green-500":"bg-white/10 hover:bg-white/20"
                }
                `}
            onClick={toggleParticipants}
          >
            👥
          </button>
          <button
            title="Chat"
            className={`rounded-full p-4 md:p-6 transition-all duration-200 hover:scale-110 cursor-pointer ${
              chatOpen ? "bg-green-500" : "bg-white/10 hover:bg-white/20 "
            }`}
            onClick={toggleChat}
          >
            💬
          </button>
          <button
            title="End Call"
            className="rounded-full p-4 md:p-6 bg-red-600/80 hover:bg-red-600 transition-all
            cursor-pointer duration-200 hover:scale-110"
          >
            📞
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraSection;
