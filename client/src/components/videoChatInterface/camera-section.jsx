
// src/components/CameraSection.jsx
import { IoIosPerson } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../../services/socket";

const CameraSection = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [showParticipants, setShowPaticipants] = useState(false);
  const [micOpen, setMicOpen] = useState(true);
  const [camOpen, setCamOpen] = useState(true);  
  const [videoDisplay, setVideoDisplay] = useState(false);
  const [remoteVideoDisplay, setRemoteVideoDisplay] = useState(false);

  const { roomId } = useParams();
  const navigate = useNavigate();

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const start = async () => {
      try {
        // 1) start media
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (!mounted) return;
        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          setVideoDisplay(true);
        }

        // 2) create RTCPeerConnection
        pcRef.current = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        // 3) add local tracks
        stream.getTracks().forEach((track) => {
          pcRef.current.addTrack(track, stream);
        });

        // 4) incoming remote tracks
        pcRef.current.ontrack = (e) => {
  if (remoteVideoRef.current && e.streams[0]) {
    remoteVideoRef.current.srcObject = e.streams[0];
    setRemoteVideoDisplay(true);
    
  }
};

        // 5) send ICE candidates
        pcRef.current.onicecandidate = (e) => {
          if (e.candidate) {
            socket.emit("ice-candidate", {
              roomId,
              candidate: e.candidate,
            });
          }
        };

        // 6) connect socket and join room
        if (!socket.connected) socket.connect();
        socket.emit("join-room", { roomId });

        // If another user is already in the room, you will be the second user
        socket.on("user-joined", async () => {
          if (!pcRef.current) return;
          const offer = await pcRef.current.createOffer();
          await pcRef.current.setLocalDescription(offer);
          socket.emit("offer", { roomId, sdp: offer });
        });

        // Receive offer -> set remote, create/send answer
        socket.on("offer", async ({ sdp }) => {
          if (!pcRef.current) return;
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);
          socket.emit("answer", { roomId, sdp: answer });
        });

        // Receive answer -> set remote
        socket.on("answer", async ({ sdp }) => {
          if (!pcRef.current) return;
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
        });

        // Receive ICE -> add to pc
        socket.on("ice-candidate", async ({ candidate }) => {
          try {
            await pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.warn("ICE add error", err);
          }
        });


        socket.on("camera-toggled", ({camEnabled})=>{
          setRemoteVideoDisplay(camEnabled);
        })

        socket.on("user-left", () => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
            setRemoteVideoDisplay(false);
          }
        });

        // 🔹 NEW: If you're the first user, wait for someone to join
        socket.on("existing-users", async (users) => {
          if (users.length > 0) {
            const offer = await pcRef.current.createOffer();
            await pcRef.current.setLocalDescription(offer);
            socket.emit("offer", { roomId, sdp: offer });
          }
        });

      } catch (e) {
        console.error("Failed to start media/connection", e);
      }
    };

    start();

    return () => {
      mounted = false;
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-left");
      socket.off("existing-users");
      socket.off("camera-toggled");
    };
  }, [roomId]);

  const micToggle = () => {
    setMicOpen((prev) => {
      const next = !prev;
      localStreamRef.current
        ?.getAudioTracks()
        .forEach((t) => (t.enabled = next));
      return next;
    });
  };

 
  const camToggle = () => {
    const tracks = localStreamRef.current?.getVideoTracks() || [];
    const next = !(tracks[0]?.enabled ?? true);
    tracks.forEach((t) => (t.enabled = next));
    setCamOpen(next);
    setVideoDisplay(next);

    socket.emit("camera-toggled", {roomId, camEnabled:next});
  };

  const endCall = () => {
    try {
      pcRef.current?.getSenders().forEach((s) => s.track?.stop());
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      pcRef.current?.close();
    } catch {}
    socket.disconnect();
    navigate("/");
  };

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
          className={`${chatOpen ? "mr-[320px]" : "mr-0"} transition-all duration-300 ease-in-out w-full`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <div className="relative bg-[linear-gradient(135deg,#374151_0%,#1f2937_100%)] shadow-[0_10px_30px_rgba(0,0,0,0.3)] rounded-2xl border-2 border-[rgba(255,255,255,0.1)]">
              <div className="absolute top-3 left-3 bg-black text-white p-4 rounded-xl">
                <h2 className="font-medium">You</h2>
              </div>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              {!videoDisplay && (
              <div className="flex justify-center items-center w-full h-full text-9xl text-white/60 relative z-[1] pointer-events-none">
                <IoIosPerson />
              </div>
              )}
            </div>
            <div className="relative bg-[linear-gradient(135deg,#374151_0%,#1f2937_100%)] shadow-[0_10px_30px_rgba(0,0,0,0.3)] rounded-2xl border-2 border-[rgba(255,255,255,0.1)]">
              <div className="absolute top-3 left-3 bg-black text-white p-4 rounded-xl">
                <h2 className="font-medium">Awais</h2>
              </div>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              
            {!remoteVideoDisplay && (
              <div className="flex justify-center items-center w-full h-full text-9xl text-white/60 relative z-[1] pointer-events-none">
                <IoIosPerson />
              </div>
            )

            }
              

             
            </div>
          </div>
        </div>

        {/* Chat */}
        <div
          className={`fixed top-0 ${chatOpen ? "right-0" : "-right-full lg:-right-[320px]"} w-full lg:w-[320px]  
                h-screen border-l border-l-white/30 bg-[rgba(30,41,59,0.95)] z-[1000] backdrop-blur-[20px] flex flex-col transition-all duration-300 ease-in-out`}
        >
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

        {/* Participants */}
        <div
          className={`fixed top-28 ${showParticipants ? "left-0" : "left-[-280px]"}  w-[280px] bg-[rgba(30,41,59,0.95)] backdrop-blur-[10px] 
            border-r border-white/10 rounded-tr-xl rounded-br-xl p-6 transition-[left] duration-300 ease-in-out 
            z-[150]`}
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

      {/* Controls */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[500]">
        <div className="bg-black/80 backdrop-blur-[10px] p-4 rounded-[2rem] flex justify-center items-center gap-3 text-[16px] md:text-2xl border border-white/10">
           {/* Mic Button */}
          <button
            title="Toggle Microphone"
            className={`rounded-full p-4 md:p-6 transition-all duration-200 hover:scale-110 ${
              micOpen ? "bg-green-500" : "bg-red-600/80"
            }`}
            onClick={micToggle}
          >
            {micOpen ? "🎙️" : "🔇"}
          </button>

          {/* Camera Button */}
          <button
            title="Toggle Camera"
            className={`rounded-full p-4 md:p-6 transition-all duration-200 hover:scale-110 ${
              camOpen ? "bg-green-500" : "bg-red-600/80"
            }`}
            onClick={camToggle}
          >
            {camOpen ? "🎥" : "🚫"}
          </button>

          <button
            title="Participants"
            className={`rounded-full p-4 md:p-6 transition-all duration-200 hover:scale-110 cursor-pointer ${showParticipants ? "bg-green-500" : "bg-white/10 hover:bg-white/20"}`}
            onClick={toggleParticipants}
          >
            👥
          </button>
          <button
            title="Chat"
            className={`rounded-full p-4 md:p-6 transition-all duration-200 hover:scale-110 cursor-pointer ${chatOpen ? "bg-green-500" : "bg-white/10 hover:bg-white/20 "}`}
            onClick={toggleChat}
          >
            💬
          </button>
          <button
            title="End Call"
            className="rounded-full p-4 md:p-6 bg-red-600/80 hover:bg-red-600 transition-all cursor-pointer duration-200 hover:scale-110"
            onClick={endCall}
          >
            📞
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraSection;
