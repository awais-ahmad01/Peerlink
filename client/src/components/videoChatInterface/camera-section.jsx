import { IoIosPerson } from "react-icons/io";
import { useEffect, useRef, useState, memo } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../../services/socket";



const RemoteVideoComponent = memo(
  ({ socketId, username, videoEnabled }) => {
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
      if (!window.remoteVideoRefs) window.remoteVideoRefs = {};
      window.remoteVideoRefs[socketId] = videoRef.current;

      return () => {
        if (window.remoteVideoRefs && window.remoteVideoRefs[socketId]) {
          delete window.remoteVideoRefs[socketId];
        }
      };
    }, [socketId]);

    useEffect(() => {
      const handleStreamUpdate = (event) => {
        if (event.detail.socketId === socketId && videoRef.current) {
          videoRef.current.srcObject = event.detail.stream;
          streamRef.current = event.detail.stream;
        }
      };

      window.addEventListener("remoteStreamUpdate", handleStreamUpdate);
      return () =>
        window.removeEventListener("remoteStreamUpdate", handleStreamUpdate);
    }, [socketId]);

    return (
      <div
        className="relative aspect-square bg-[linear-gradient(135deg,#374151_0%,#1f2937_100%)]
        shadow-[0_10px_30px_rgba(0,0,0,0.3)] rounded-xl sm:rounded-2xl border-2 
        border-[rgba(255,255,255,0.1)] overflow-hidden w-full h-full max-h-full"
      >
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-black text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl z-50 text-xs sm:text-sm">
          <h2 className="font-medium truncate max-w-[100px] sm:max-w-none">{username}</h2>
        </div>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {!videoEnabled && (
          <div className="flex justify-center items-center w-full h-full text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-white/60 relative z-[1] pointer-events-none">
            <IoIosPerson />
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.username === nextProps.username &&
    prevProps.videoEnabled === nextProps.videoEnabled &&
    prevProps.socketId === nextProps.socketId
);

RemoteVideoComponent.displayName = "RemoteVideoComponent";

const CameraSection = () => {
  const {user} = useSelector(state => state.auth);
  const userId = user?._id;
  const [chatOpen, setChatOpen] = useState(false);
  const [showParticipants, setShowPaticipants] = useState(false);
  const [micOpen, setMicOpen] = useState(true);
  const [camOpen, setCamOpen] = useState(true);
  const [videoDisplay, setVideoDisplay] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [remoteUsers, setRemoteUsers] = useState({});
  const [isConnecting, setIsConnecting] = useState(true);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  const { roomId, username } = useParams();
  const navigate = useNavigate();

  const peerConnections = useRef({});
  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const messagesEndRef = useRef(null);
  const remoteStreamsRef = useRef({});
  const chatInputRef = useRef(null);

  
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    const handleOrientationChange = () => {
      setTimeout(() => {
        setViewportHeight(window.innerHeight);
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);


  useEffect(() => {
    if (chatOpen && chatInputRef.current) {
      const handleInputFocus = () => {
        setTimeout(() => {
          chatInputRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end' 
          });
        }, 300);
      };

      const inputElement = chatInputRef.current.querySelector('input');
      if (inputElement) {
        inputElement.addEventListener('focus', handleInputFocus);
        return () => {
          inputElement.removeEventListener('focus', handleInputFocus);
        };
      }
    }
  }, [chatOpen]);

 
  const updateRemoteStream = (socketId, stream) => {
    remoteStreamsRef.current[socketId] = stream;
    window.dispatchEvent(
      new CustomEvent("remoteStreamUpdate", {
        detail: { socketId, stream },
      })
    );
  };

  const createPeerConnection = (socketId) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:openrelay.metered.ca:80",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
        {
          urls: "turn:openrelay.metered.ca:443",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
        {
          urls: "turn:openrelay.metered.ca:443?transport=tcp",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
      ],
    });

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    pc.ontrack = (e) => {
      if (e.streams[0]) updateRemoteStream(socketId, e.streams[0]);
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          roomId,
          candidate: e.candidate,
          targetSocketId: socketId,
        });
      }
    };

    peerConnections.current[socketId] = pc;
    return pc;
  };

  const removePeerConnection = (socketId) => {
    if (peerConnections.current[socketId]) {
      peerConnections.current[socketId].close();
      delete peerConnections.current[socketId];
    }
    setRemoteUsers((prev) => {
      const newUsers = { ...prev };
      delete newUsers[socketId];
      return newUsers;
    });
    if (remoteStreamsRef.current[socketId]) {
      delete remoteStreamsRef.current[socketId];
    }
  };

  useEffect(() => {
    let mounted = true;

    const start = async () => {
      try {
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

        if (!socket.connected) socket.connect();
        socket.emit("join-room", { roomId, username, userId});

        socket.on("existing-users", async (users) => {
          for (const user of users) {
            if (user.socketId !== socket.id) {
              setRemoteUsers((prev) => ({
                ...prev,
                [user.socketId]: {
                  username: user.username,
                  videoEnabled: true,
                  audioEnabled: true,
                },
              }));
              const pc = createPeerConnection(user.socketId);
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              socket.emit("offer", {
                roomId,
                sdp: offer,
                targetSocketId: user.socketId,
              });
            }
          }
        });

        socket.on("user-joined", async ({ socketId, remoteUsername }) => {
          if (socketId !== socket.id) {
            setRemoteUsers((prev) => ({
              ...prev,
              [socketId]: {
                username: remoteUsername,
                videoEnabled: true,
                audioEnabled: true,
              },
            }));
            createPeerConnection(socketId);
          }
        });

        socket.on("offer", async ({ sdp, fromSocketId }) => {
          let pc = peerConnections.current[fromSocketId];
          if (!pc) pc = createPeerConnection(fromSocketId);

          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", {
            roomId,
            sdp: answer,
            targetSocketId: fromSocketId,
          });
        });

        socket.on("answer", async ({ sdp, fromSocketId }) => {
          const pc = peerConnections.current[fromSocketId];
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          }
        });

        socket.on("ice-candidate", async ({ candidate, fromSocketId }) => {
          try {
            const pc = peerConnections.current[fromSocketId];
            if (pc) {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
          } catch (err) {
            console.warn("ICE add error", err);
          }
        });

        socket.on("camera-toggled", ({ fromSocketId, camEnabled }) => {
          setRemoteUsers((prev) => ({
            ...prev,
            [fromSocketId]: {
              ...prev[fromSocketId],
              videoEnabled: camEnabled,
            },
          }));
        });

        socket.on("mic-toggled", ({ fromSocketId, micEnabled }) => {
          setRemoteUsers((prev) => ({
            ...prev,
            [fromSocketId]: {
              ...prev[fromSocketId],
              audioEnabled: micEnabled,
            },
          }));
        });

        socket.on("chat-history", (history) => {
          setMessages(history);
        });

        socket.on("chat-message", (msg) => {
          setMessages((prev) => [...prev, msg]);
        });

        socket.on("user-left", ({ socketId }) => {
          removePeerConnection(socketId);
        });
      } catch (e) {
        console.error("Failed to start media/connection", e);
      }
    };

    start();

    return () => {
      mounted = false;
      socket.off();
    };
  }, [roomId]);

  const micToggle = () => {
    setMicOpen((prev) => {
      const next = !prev;
      localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = next));
      socket.emit("mic-toggled", { roomId, micEnabled: next });
      return next;
    });
  };

  const camToggle = () => {
    const tracks = localStreamRef.current?.getVideoTracks() || [];
    const next = !(tracks[0]?.enabled ?? true);
    tracks.forEach((t) => (t.enabled = next));
    setCamOpen(next);
    setVideoDisplay(next);
    socket.emit("camera-toggled", { roomId, camEnabled: next });
  };

  const endCall = () => {
    try {
      Object.values(peerConnections.current).forEach((pc) => {
        pc.getSenders().forEach((s) => s.track?.stop());
        pc.close();
      });
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      peerConnections.current = {};
    } catch {}
    socket.disconnect();
    navigate("/");
  };

  const toggleChat = () => setChatOpen(!chatOpen);
  const toggleParticipants = () => setShowPaticipants(!showParticipants);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const msg = {
      sender: username,
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, msg]);
    socket.emit("chat-message", { roomId, ...msg });
    setNewMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const totalUsers = 1 + Object.keys(remoteUsers).length;
  let gridCols = "grid-cols-1";

  if (totalUsers === 2) {
   
    gridCols = "grid-cols-1 sm:grid-cols-2";
  } else if (totalUsers === 3) {
    gridCols = "grid-cols-2 md:grid-cols-3";
  } else if (totalUsers === 4) {
    gridCols = "grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2";
  } else if (totalUsers <= 6) {
   
    gridCols = "grid-cols-2 md:grid-cols-3";
  } else if (totalUsers <= 8) {
    
    gridCols = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  } else {
    
    gridCols = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  }

  return (
    <div className="pt-28 md:pt-36">
      <div className="relative flex h-[calc(100vh-180px)] p-4 gap-4">
   
        <div
          className={`${chatOpen ? "mr-[320px]" : "mr-0"}
          transition-all duration-300 ease-in-out w-full`}
        >
          {totalUsers === 1 ? (
           
            <div className="w-full h-full flex items-center justify-center">
              <div
                className="relative w-full h-full bg-[linear-gradient(135deg,#374151_0%,#1f2937_100%)]
                shadow-[0_10px_30px_rgba(0,0,0,0.3)] rounded-2xl border-2 
                border-[rgba(255,255,255,0.1)] overflow-hidden"
              >
                <div className="absolute top-3 left-3 bg-black text-white px-3 py-1 rounded-xl z-50 text-sm">
                  <h2 className="font-medium">{username}</h2>
                </div>
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {!videoDisplay && (
                  <div className="flex justify-center items-center w-full h-full text-8xl md:text-9xl text-white/60 relative z-[1] pointer-events-none">
                    <IoIosPerson />
                  </div>
                )}
              </div>
            </div>
          ) : (
            
            <div
              className={`grid ${gridCols} gap-2 sm:gap-3 md:gap-4 w-full h-full place-items-center auto-rows-fr`}
            >
              {/* Local video */}
              <div
                className="relative aspect-square bg-[linear-gradient(135deg,#374151_0%,#1f2937_100%)] 
                shadow-[0_10px_30px_rgba(0,0,0,0.3)] rounded-xl sm:rounded-2xl border-2 
                border-[rgba(255,255,255,0.1)] overflow-hidden w-full h-full max-h-full"
              >
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-black text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl z-50 text-xs sm:text-sm">
                  <h2 className="font-medium truncate max-w-[100px] sm:max-w-none">{username} (You)</h2>
                </div>
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {!videoDisplay && (
                  <div className="flex justify-center items-center w-full h-full text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-white/60 relative z-[1] pointer-events-none">
                    <IoIosPerson />
                  </div>
                )}
              </div>

              {/* Remote users */}
              {Object.entries(remoteUsers).map(([socketId, user]) => (
                <RemoteVideoComponent
                  key={socketId}
                  socketId={socketId}
                  username={user.username}
                  videoEnabled={user.videoEnabled}
                />
              ))}
            </div>
          )}
        </div>

        {/* Chat  */}
        <div
          className={`fixed top-0 ${
            chatOpen ? "right-0" : "-right-full lg:-right-[320px]"
          } w-full lg:w-[320px] z-[1000] 
                border-l border-l-white/30 bg-[rgba(30,41,59,0.95)] backdrop-blur-[20px] 
                flex flex-col transition-all duration-300 ease-in-out`}
          style={{ 
            height: `${viewportHeight}px`,
            maxHeight: `${viewportHeight}px`
          }}
        >
        
          <div className="border-b border-b-white/30 py-4 lg:py-7 px-4 flex justify-between items-center flex-shrink-0">
            <div className="text-[16px] lg:text-[18px] font-medium text-white/80">
              Room Chat
            </div>
            <button
              className="text-xl font-bold text-white/70 cursor-pointer hover:text-white"
              onClick={toggleChat}
            >
              ×
            </button>
          </div>

        
          <div className="flex-1 px-4 lg:px-5 py-3 overflow-y-auto min-h-0">
            <div className="flex flex-col gap-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-2 ${
                    m.sender === username ? "items-end" : ""
                  }`}
                >
                  <div className="text-xs text-white/70">
                    {m.sender} • {m.time}
                  </div>
                  <div
                    className={`rounded-2xl p-4 text-[14px] max-w-[80%] ${
                      m.sender === username
                        ? "bg-[rgba(79,70,229,0.8)]"
                        : "bg-white/10"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          
          <div 
            ref={chatInputRef}
            className="border-t border-t-white/10 px-4 py-4 lg:py-5 flex gap-2 flex-shrink-0 bg-[rgba(30,41,59,0.98)]"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-white/10 border border-white/20 p-3 rounded-xl 
                       placeholder:text-xs text-white text-sm focus:outline-none 
                       focus:border-blue-500 min-h-[44px]"
              style={{
                fontSize: '16px', 
              }}
            />
            <button
              onClick={sendMessage}
              className="bg-[rgba(79,70,229,0.8)] px-4 py-3 rounded-xl text-xs 
                       font-medium hover:bg-[rgba(79,70,229,0.6)] transition-colors
                       flex-shrink-0 min-h-[44px] flex items-center justify-center"
            >
              Send
            </button>
          </div>
        </div>

        {/* Participants */}
        <div
          className={`fixed top-28 ${
            showParticipants ? "left-0" : "left-[-280px]"
          }  w-[280px] bg-[rgba(30,41,59,0.95)] backdrop-blur-[10px] 
            border-r border-white/10 rounded-tr-xl rounded-br-xl p-6 transition-[left] duration-300 ease-in-out 
            z-[150]`}
        >
          <div className="text-lg font-semibold mb-4 text-indigo-300">
            Participants ({totalUsers})
          </div>

          {/* Local user */}
          <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-700 to-purple-700 rounded-full flex items-center justify-center text-xl">
              {username?.charAt(0)?.toUpperCase() || "Y"}
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">You</div>
              <div className="flex gap-2 text-xs opacity-70">
                <span className="flex items-center gap-1">
                  {micOpen ? "🎙️ Active" : "🎙️ Muted"}
                </span>
                <span className="flex items-center gap-1">
                  {camOpen ? "🎥 Active" : "🎥 Off"}
                </span>
              </div>
            </div>
          </div>

          {/* Remote users */}
          {Object.entries(remoteUsers).map(([socketId, user]) => (
            <div
              key={socketId}
              className="flex items-center gap-4 p-3 bg-white/5 rounded-lg mb-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-700 to-purple-700 rounded-full flex items-center justify-center text-xl">
                {user.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <div className="font-medium mb-1">{user.username}</div>
                <div className="flex gap-2 text-xs opacity-70">
                  <span className="flex items-center gap-1">
                    {user.audioEnabled ? "🎙️ Active" : "🎙️ Muted"}
                  </span>
                  <span className="flex items-center gap-1">
                    {user.videoEnabled ? "🎥 Active" : "🎥 Off"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[500]">
        <div className="bg-black/80 backdrop-blur-[10px] p-3 sm:p-4 rounded-[2rem] flex justify-center items-center gap-2 sm:gap-3 text-sm sm:text-[16px] md:text-2xl border border-white/10">
          <button
            title="Toggle Microphone"
            className={`rounded-full p-3 sm:p-4 md:p-6 transition-all duration-200 hover:scale-110 ${
              micOpen ? "bg-green-500" : "bg-red-600/80"
            }`}
            onClick={micToggle}
          >
            {micOpen ? "🎙️" : "🔇"}
          </button>
          <button
            title="Toggle Camera"
            className={`rounded-full p-3 sm:p-4 md:p-6 transition-all duration-200 hover:scale-110 ${
              camOpen ? "bg-green-500" : "bg-red-600/80"
            }`}
            onClick={camToggle}
          >
            {camOpen ? "🎥" : "🚫"}
          </button>
          <button
            title="Participants"
            className={`rounded-full p-3 sm:p-4 md:p-6 transition-all duration-200 hover:scale-110 cursor-pointer ${
              showParticipants ? "bg-green-500" : "bg-white/10 hover:bg-white/20"
            }`}
            onClick={toggleParticipants}
          >
            👥
          </button>
          <button
            title="Chat"
            className={`rounded-full p-3 sm:p-4 md:p-6 transition-all duration-200 hover:scale-110 cursor-pointer ${
              chatOpen ? "bg-green-500" : "bg-white/10 hover:bg-white/20 "
            }`}
            onClick={toggleChat}
          >
            💬
          </button>
          <button
            title="End Call"
            className="rounded-full p-3 sm:p-4 md:p-6 bg-red-600/80 hover:bg-red-600 transition-all cursor-pointer duration-200 hover:scale-110"
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




















// // src/components/CameraSection.jsx
// import { IoIosPerson } from "react-icons/io";
// import { useEffect, useRef, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { socket } from "../../services/socket";
// import { getUserId } from "../../utils/userId";

// const CameraSection = () => {
//   const [chatOpen, setChatOpen] = useState(false);
//   const [showParticipants, setShowPaticipants] = useState(false);
//   const [micOpen, setMicOpen] = useState(true);
//   const [camOpen, setCamOpen] = useState(true);
//   const [videoDisplay, setVideoDisplay] = useState(false);
//   const [remoteVideoDisplay, setRemoteVideoDisplay] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [remoteUser, setRemoteUser] = useState('');

//   console.log('remoteUser::', remoteUser);

//   const { roomId, username } = useParams();

//   const navigate = useNavigate();

//   const pcRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   const userLocalId = getUserId();

//   console.log('sockket:', socket.id);

//   useEffect(() => {
//     let mounted = true;

//     const start = async () => {
//       try {
//         // 1) start media
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });
//         if (!mounted) return;
//         localStreamRef.current = stream;

//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = stream;
//           setVideoDisplay(true);
//         }

//         // 2) create RTCPeerConnection
//         pcRef.current = new RTCPeerConnection({
//           iceServers: [
//             { urls: "stun:stun.l.google.com:19302" },
//             {
//               urls: "turn:openrelay.metered.ca:80",
//               username: "openrelayproject",
//               credential: "openrelayproject",
//             },
//             {
//               urls: "turn:openrelay.metered.ca:443",
//               username: "openrelayproject",
//               credential: "openrelayproject",
//             },
//             {
//               urls: "turn:openrelay.metered.ca:443?transport=tcp",
//               username: "openrelayproject",
//               credential: "openrelayproject",
//             },
//           ],
//         });

//         // 3) add local tracks
//         stream.getTracks().forEach((track) => {
//           pcRef.current.addTrack(track, stream);
//         });

//         // 4) incoming remote tracks
//         pcRef.current.ontrack = (e) => {
//           if (remoteVideoRef.current && e.streams[0]) {
//             remoteVideoRef.current.srcObject = e.streams[0];
//             setRemoteVideoDisplay(true);
//           }
//         };

//         // 5) send ICE candidates
//         pcRef.current.onicecandidate = (e) => {
//           if (e.candidate) {
//             socket.emit("ice-candidate", {
//               roomId,
//               candidate: e.candidate,
//             });
//           }
//         };

//         // 6) connect socket and join room
//         if (!socket.connected) socket.connect();
//         socket.emit("join-room", { roomId, username });

//         // If another user is already in the room, you will be the second user
//         socket.on("user-joined", async ({socketId, remoteUsername}) => {
//           console.log('userJoined:::', remoteUsername);
//           setRemoteUser(remoteUsername);
//           console.log("User JOined:");
//           if (!pcRef.current) return;
//           const offer = await pcRef.current.createOffer();
//           await pcRef.current.setLocalDescription(offer);
//           socket.emit("offer", { roomId, sdp: offer });
//         });

//         // Receive offer -> set remote, create/send answer
//         socket.on("offer", async ({ sdp }) => {
//           // console.log("Offer:");
//           if (!pcRef.current) return;
//           await pcRef.current.setRemoteDescription(
//             new RTCSessionDescription(sdp)
//           );
//           const answer = await pcRef.current.createAnswer();
//           await pcRef.current.setLocalDescription(answer);
//           socket.emit("answer", { roomId, sdp: answer });
//         });

//         // Receive answer -> set remote
//         socket.on("answer", async ({ sdp }) => {
//           // console.log("Answer:");
//           if (!pcRef.current) return;
//           await pcRef.current.setRemoteDescription(
//             new RTCSessionDescription(sdp)
//           );
//         });

//         // Receive ICE -> add to pc
//         socket.on("ice-candidate", async ({ candidate }) => {
//           try {
//             // console.log("Ice Cnadidate:");
//             await pcRef.current?.addIceCandidate(
//               new RTCIceCandidate(candidate)
//             );
//           } catch (err) {
//             console.warn("ICE add error", err);
//           }
//         });

//         socket.on("camera-toggled", ({ camEnabled }) => {
//           // console.log("Camera Togg:");
//           setRemoteVideoDisplay(camEnabled);
//         });

//         socket.on("chat-history", (history) => {
//           console.log("history: ", history)
//           setMessages(history);
//         });

//         socket.on("chat-message", (msg) => {
//           // console.log("sneder:", sender);
//           // console.log("text: ", text);
//           setMessages((prev) => [...prev, msg]);
//         });

//         socket.on("user-left", () => {
//           if (remoteVideoRef.current) {
//             remoteVideoRef.current.srcObject = null;
//             setRemoteVideoDisplay(false);
//           }
//         });

//         // 🔹 NEW: If you're the first user, wait for someone to join
//         socket.on("existing-users", async (users) => {
//           if (users.length > 0) {
//             const offer = await pcRef.current.createOffer();
//             await pcRef.current.setLocalDescription(offer);
//             socket.emit("offer", { roomId, sdp: offer });
//           }
//         });
//       } catch (e) {
//         console.error("Failed to start media/connection", e);
//       }
//     };

//     start();

//     return () => {
//       mounted = false;
//       socket.off("user-joined");
//       socket.off("offer");
//       socket.off("answer");
//       socket.off("ice-candidate");
//       socket.off("user-left");
//       socket.off("existing-users");
//       socket.off("camera-toggled");
//       socket.off("chat-message");
//       socket.off("chat-history");
//     };
//   }, [roomId]);

//   const micToggle = () => {
//     setMicOpen((prev) => {
//       const next = !prev;
//       localStreamRef.current
//         ?.getAudioTracks()
//         .forEach((t) => (t.enabled = next));
//       return next;
//     });
//   };

//   const camToggle = () => {
//     const tracks = localStreamRef.current?.getVideoTracks() || [];
//     const next = !(tracks[0]?.enabled ?? true);
//     tracks.forEach((t) => (t.enabled = next));
//     setCamOpen(next);
//     setVideoDisplay(next);

//     socket.emit("camera-toggled", { roomId, camEnabled: next });
//   };

//   const endCall = () => {
//     try {
//       pcRef.current?.getSenders().forEach((s) => s.track?.stop());
//       localStreamRef.current?.getTracks().forEach((t) => t.stop());
//       pcRef.current?.close();
//     } catch {}
//     socket.disconnect();
//     navigate("/");
//   };

//   const toggleChat = () => {
//     setChatOpen(!chatOpen);
//   };

//   const toggleParticipants = () => {
//     setShowPaticipants(!showParticipants);
//   };

//   const sendMessage = () => {
//     if (!newMessage.trim()) return;

//     const msg = {
//       sender: userLocalId,
//       text: newMessage,
//       time: new Date().toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };

//     // Add to local state
//     setMessages((prev) => [...prev, msg]);

//     console.log("emiting msg:...");

//     // Send to other users
//     socket.emit("chat-message", {
//       roomId,
//       sender: userLocalId,
//       text: newMessage,
//       time: msg.time,
//     });

//     console.log("emited msg:...");

//     setNewMessage("");
//   };

//   useEffect(() => {
//   if (messagesEndRef.current) {
//     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//   }
// }, [messages]);

//   return (
//     <div className="pt-28 md:pt-36">
//       <div className="relative flex h-[calc(100vh-180px)] p-4 gap-4">
//         <div
//           className={`${
//             chatOpen ? "mr-[320px]" : "mr-0"
//           } transition-all duration-300 ease-in-out w-full`}
//         >
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
//             <div className="relative bg-[linear-gradient(135deg,#374151_0%,#1f2937_100%)]
//             shadow-[0_10px_30px_rgba(0,0,0,0.3)] rounded-2xl border-2 border-[rgba(255,255,255,0.1)] overflow-hidden">
//               <div className="absolute top-3 left-3 bg-black text-white p-4 rounded-xl z-50">
//                 <h2 className="font-medium">{username}</h2>
//               </div>
//               <video
//                 ref={localVideoRef}
//                 autoPlay
//                 playsInline
//                 muted
//                 className="absolute inset-0 w-full h-full object-cover"
//               />
//               {!videoDisplay && (
//                 <div className="flex justify-center items-center w-full h-full text-9xl text-white/60 relative z-[1] pointer-events-none">
//                   <IoIosPerson />
//                 </div>
//               )}
//             </div>
//             <div className="relative bg-[linear-gradient(135deg,#374151_0%,#1f2937_100%)] shadow-[0_10px_30px_rgba(0,0,0,0.3)]
//              rounded-2xl border-2 border-[rgba(255,255,255,0.1)] overflow-hidden">
//               <div className="absolute top-3 left-3 bg-black text-white p-4 rounded-xl z-50">
//                 <h2 className="font-medium">{remoteUser}</h2>
//               </div>
//               <video
//                 ref={remoteVideoRef}
//                 autoPlay
//                 playsInline
//                 className="absolute inset-0 w-full h-full object-cover"
//               />

//               {!remoteVideoDisplay && (
//                 <div className="flex justify-center items-center w-full h-full text-9xl text-white/60 relative z-[1] pointer-events-none">
//                   <IoIosPerson />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Chat */}
//         <div
//           className={`fixed top-0 ${
//             chatOpen ? "right-0" : "-right-full lg:-right-[320px]"
//           } w-full lg:w-[320px]
//                 h-screen border-l border-l-white/30 bg-[rgba(30,41,59,0.95)] z-[1000] backdrop-blur-[20px] flex flex-col transition-all duration-300 ease-in-out`}
//         >
//           <div className="border-b border-b-white/30 py-7 px-4 flex justify-between items-center">
//             <div className="text-[18px] font-medium text-white/80">
//               Room Chat
//             </div>
//             <button
//               className="text-xl font-bold text-white/70 cursor-pointer hover:text-white"
//               onClick={toggleChat}
//             >
//               ×
//             </button>
//           </div>
//           <div className="flex-1 px-5 py-3 overflow-y-auto">
//             <div className="flex flex-col gap-4"

//             >
//               {messages.map((m, i) => (
//                 <div
//                   key={i}
//                   className={`flex flex-col gap-2 ${
//                     m.sender === userLocalId ? "items-end" : ""
//                   }`}
//                 >
//                   <div className="text-xs text-white/70">
//                     {m.sender} • {m.time}
//                   </div>
//                   <div
//                     className={`rounded-2xl p-4 text-[14px] max-w-[80%] ${
//                       m.sender === userLocalId
//                         ? "bg-[rgba(79,70,229,0.8)]"
//                         : "bg-white/10"
//                     }`}
//                   >
//                     {m.text}
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>
//           </div>

//           <div className="border-t border-t-white/10 px-4 py-5 flex gap-2">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//               placeholder="Type a message..."
//               className="flex-1 bg-white/10 border border-white/20 p-3 rounded-xl placeholder:text-xs text-white text-sm focus:outline-none focus:border-blue-500"
//             />
//             <button
//               onClick={sendMessage}
//               className="bg-[rgba(79,70,229,0.8)] px-4 py-3 rounded-xl text-xs font-medium hover:bg-[rgba(79,70,229,0.6)] transition-colors"
//             >
//               Send
//             </button>
//           </div>
//         </div>

//         {/* Participants */}
//         <div
//           className={`fixed top-28 ${
//             showParticipants ? "left-0" : "left-[-280px]"
//           }  w-[280px] bg-[rgba(30,41,59,0.95)] backdrop-blur-[10px]
//             border-r border-white/10 rounded-tr-xl rounded-br-xl p-6 transition-[left] duration-300 ease-in-out
//             z-[150]`}
//         >
//           <div className="text-lg font-semibold mb-4 text-indigo-300">
//             Participants (2)
//           </div>
//           <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg mb-2">
//             <div className="w-10 h-10 bg-gradient-to-br from-indigo-700 to-purple-700 rounded-full flex items-center justify-center text-xl">
//               Y
//             </div>
//             <div className="flex-1">
//               <div className="font-medium mb-1">You</div>
//               <div className="flex gap-2 text-xs opacity-70">
//                 <span className="flex items-center gap-1">🎙️ Active</span>
//                 <span className="flex items-center gap-1">🎥 Active</span>
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg mb-2">
//             <div className="w-10 h-10 bg-gradient-to-br from-indigo-700 to-purple-700 rounded-full flex items-center justify-center text-xl">
//               A
//             </div>
//             <div className="flex-1">
//               <div className="font-medium mb-1">Awais</div>
//               <div className="flex gap-2 text-xs opacity-70">
//                 <span className="flex items-center gap-1">🎙️ Muted</span>
//                 <span className="flex items-center gap-1">🎥 Active</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[500]">
//         <div className="bg-black/80 backdrop-blur-[10px] p-4 rounded-[2rem] flex justify-center items-center gap-3 text-[16px] md:text-2xl border border-white/10">
//           {/* Mic Button */}
//           <button
//             title="Toggle Microphone"
//             className={`rounded-full p-4 md:p-6 transition-all duration-200 hover:scale-110 ${
//               micOpen ? "bg-green-500" : "bg-red-600/80"
//             }`}
//             onClick={micToggle}
//           >
//             {micOpen ? "🎙️" : "🔇"}
//           </button>

//           {/* Camera Button */}
//           <button
//             title="Toggle Camera"
//             className={`rounded-full p-4 md:p-6 transition-all duration-200 hover:scale-110 ${
//               camOpen ? "bg-green-500" : "bg-red-600/80"
//             }`}
//             onClick={camToggle}
//           >
//             {camOpen ? "🎥" : "🚫"}
//           </button>

//           <button
//             title="Participants"
//             className={`rounded-full p-4 md:p-6 transition-all duration-200 hover:scale-110 cursor-pointer ${
//               showParticipants
//                 ? "bg-green-500"
//                 : "bg-white/10 hover:bg-white/20"
//             }`}
//             onClick={toggleParticipants}
//           >
//             👥
//           </button>
//           <button
//             title="Chat"
//             className={`rounded-full p-4 md:p-6 transition-all duration-200 hover:scale-110 cursor-pointer ${
//               chatOpen ? "bg-green-500" : "bg-white/10 hover:bg-white/20 "
//             }`}
//             onClick={toggleChat}
//           >
//             💬
//           </button>
//           <button
//             title="End Call"
//             className="rounded-full p-4 md:p-6 bg-red-600/80 hover:bg-red-600 transition-all cursor-pointer duration-200 hover:scale-110"
//             onClick={endCall}
//           >
//             📞
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CameraSection;