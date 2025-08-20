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









// src/components/CameraSection.jsx
// import { IoIosPerson } from "react-icons/io";
// import { useEffect, useRef, useState, memo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { socket } from "../../services/socket";
// import { getUserId } from "../../utils/userId";

// // Completely isolated video component that never re-renders unless absolutely necessary
// const RemoteVideoComponent = memo(({ socketId, username, videoEnabled }) => {
//   const videoRef = useRef(null);
//   const streamRef = useRef(null);

//   useEffect(() => {
//     // Store this video ref globally so parent can access it
//     if (!window.remoteVideoRefs) window.remoteVideoRefs = {};
//     window.remoteVideoRefs[socketId] = videoRef.current;
    
//     return () => {
//       if (window.remoteVideoRefs && window.remoteVideoRefs[socketId]) {
//         delete window.remoteVideoRefs[socketId];
//       }
//     };
//   }, [socketId]);

//   // Listen for stream updates via custom events to avoid prop drilling
//   useEffect(() => {
//     const handleStreamUpdate = (event) => {
//       if (event.detail.socketId === socketId && videoRef.current) {
//         videoRef.current.srcObject = event.detail.stream;
//         streamRef.current = event.detail.stream;
//       }
//     };

//     window.addEventListener('remoteStreamUpdate', handleStreamUpdate);
//     return () => window.removeEventListener('remoteStreamUpdate', handleStreamUpdate);
//   }, [socketId]);

//   return (
//     <div className="relative bg-[linear-gradient(135deg,#374151_0%,#1f2937_100%)] shadow-[0_10px_30px_rgba(0,0,0,0.3)]
//     rounded-2xl border-2 border-[rgba(255,255,255,0.1)] overflow-hidden">
//       <div className="absolute top-3 left-3 bg-black text-white p-4 rounded-xl z-50">
//         <h2 className="font-medium">{username}</h2>
//       </div>
//       <video
//         ref={videoRef}
//         autoPlay
//         playsInline
//         className="absolute inset-0 w-full h-full object-cover"
//       />
//       {!videoEnabled && (
//         <div className="flex justify-center items-center w-full h-full text-9xl text-white/60 relative z-[1] pointer-events-none">
//           <IoIosPerson />
//         </div>
//       )}
//     </div>
//   );
// }, (prevProps, nextProps) => {
//   // Only re-render if username or videoEnabled actually changed
//   return prevProps.username === nextProps.username && 
//          prevProps.videoEnabled === nextProps.videoEnabled &&
//          prevProps.socketId === nextProps.socketId;
// });

// RemoteVideoComponent.displayName = 'RemoteVideoComponent';

// const CameraSection = () => {
//   const [chatOpen, setChatOpen] = useState(false);
//   const [showParticipants, setShowPaticipants] = useState(false);
//   const [micOpen, setMicOpen] = useState(true);
//   const [camOpen, setCamOpen] = useState(true);
//   const [videoDisplay, setVideoDisplay] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [remoteUsers, setRemoteUsers] = useState({});

//   const { roomId, username } = useParams();
//   const navigate = useNavigate();

//   const peerConnections = useRef({});
//   const localStreamRef = useRef(null);
//   const localVideoRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const remoteStreamsRef = useRef({});

//   const userLocalId = getUserId();

//   console.log('socket:', socket.id);
//   console.log('remoteUsers:', remoteUsers);

//   // Function to update remote streams without causing re-renders
//   const updateRemoteStream = (socketId, stream) => {
//     remoteStreamsRef.current[socketId] = stream;
//     // Dispatch custom event to update video components
//     window.dispatchEvent(new CustomEvent('remoteStreamUpdate', {
//       detail: { socketId, stream }
//     }));
//   };

//   // Create a new peer connection for a specific user
//   const createPeerConnection = (socketId) => {
//     const pc = new RTCPeerConnection({
//       iceServers: [
//         { urls: "stun:stun.l.google.com:19302" },
//         {
//           urls: "turn:openrelay.metered.ca:80",
//           username: "openrelayproject",
//           credential: "openrelayproject",
//         },
//         {
//           urls: "turn:openrelay.metered.ca:443",
//           username: "openrelayproject",
//           credential: "openrelayproject",
//         },
//         {
//           urls: "turn:openrelay.metered.ca:443?transport=tcp",
//           username: "openrelayproject",
//           credential: "openrelayproject",
//         },
//       ],
//     });

//     // Add local tracks to this peer connection
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach((track) => {
//         pc.addTrack(track, localStreamRef.current);
//       });
//     }

//     // Handle incoming remote tracks
//     pc.ontrack = (e) => {
//       if (e.streams[0]) {
//         updateRemoteStream(socketId, e.streams[0]);
//       }
//     };

//     // Send ICE candidates
//     pc.onicecandidate = (e) => {
//       if (e.candidate) {
//         socket.emit("ice-candidate", {
//           roomId,
//           candidate: e.candidate,
//           targetSocketId: socketId
//         });
//       }
//     };

//     peerConnections.current[socketId] = pc;
//     return pc;
//   };

//   // Remove peer connection
//   const removePeerConnection = (socketId) => {
//     if (peerConnections.current[socketId]) {
//       peerConnections.current[socketId].close();
//       delete peerConnections.current[socketId];
//     }
    
//     setRemoteUsers(prev => {
//       const newUsers = { ...prev };
//       delete newUsers[socketId];
//       return newUsers;
//     });
    
//     if (remoteStreamsRef.current[socketId]) {
//       delete remoteStreamsRef.current[socketId];
//     }
//   };

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

//         // 2) connect socket and join room
//         if (!socket.connected) socket.connect();
//         socket.emit("join-room", { roomId, username });

//         // Handle existing users in the room
//         socket.on("existing-users", async (users) => {
//           console.log('Existing users:', users);
//           // Create peer connections for all existing users
//           for (const user of users) {
//             if (user.socketId !== socket.id) {
//               setRemoteUsers(prev => ({
//                 ...prev,
//                 [user.socketId]: { 
//                   username: user.username, 
//                   videoEnabled: true, 
//                   audioEnabled: true 
//                 }
//               }));
              
//               const pc = createPeerConnection(user.socketId);
//               // Create and send offer to existing user
//               const offer = await pc.createOffer();
//               await pc.setLocalDescription(offer);
//               socket.emit("offer", { 
//                 roomId, 
//                 sdp: offer, 
//                 targetSocketId: user.socketId 
//               });
//             }
//           }
//         });

//         // Handle new user joining
//         socket.on("user-joined", async ({ socketId, remoteUsername }) => {
//           console.log('New user joined:', remoteUsername, socketId);
//           if (socketId !== socket.id) {
//             setRemoteUsers(prev => ({
//               ...prev,
//               [socketId]: { 
//                 username: remoteUsername, 
//                 videoEnabled: true, 
//                 audioEnabled: true 
//               }
//             }));
//             createPeerConnection(socketId);
//           }
//         });

//         // Receive offer -> set remote, create/send answer
//         socket.on("offer", async ({ sdp, fromSocketId }) => {
//           console.log("Received offer from:", fromSocketId);
//           let pc = peerConnections.current[fromSocketId];
//           if (!pc) {
//             pc = createPeerConnection(fromSocketId);
//           }
          
//           await pc.setRemoteDescription(new RTCSessionDescription(sdp));
//           const answer = await pc.createAnswer();
//           await pc.setLocalDescription(answer);
//           socket.emit("answer", { 
//             roomId, 
//             sdp: answer, 
//             targetSocketId: fromSocketId 
//           });
//         });

//         // Receive answer -> set remote
//         socket.on("answer", async ({ sdp, fromSocketId }) => {
//           console.log("Received answer from:", fromSocketId);
//           const pc = peerConnections.current[fromSocketId];
//           if (pc) {
//             await pc.setRemoteDescription(new RTCSessionDescription(sdp));
//           }
//         });

//         // Receive ICE -> add to pc
//         socket.on("ice-candidate", async ({ candidate, fromSocketId }) => {
//           try {
//             const pc = peerConnections.current[fromSocketId];
//             if (pc) {
//               await pc.addIceCandidate(new RTCIceCandidate(candidate));
//             }
//           } catch (err) {
//             console.warn("ICE add error", err);
//           }
//         });

//         // Handle camera toggle from other users
//         socket.on("camera-toggled", ({ fromSocketId, camEnabled }) => {
//           console.log("Camera toggled by:", fromSocketId, camEnabled);
//           setRemoteUsers(prev => ({
//             ...prev,
//             [fromSocketId]: {
//               ...prev[fromSocketId],
//               videoEnabled: camEnabled
//             }
//           }));
//         });

//         // Handle microphone toggle from other users
//         socket.on("mic-toggled", ({ fromSocketId, micEnabled }) => {
//           console.log("Mic toggled by:", fromSocketId, micEnabled);
//           setRemoteUsers(prev => ({
//             ...prev,
//             [fromSocketId]: {
//               ...prev[fromSocketId],
//               audioEnabled: micEnabled
//             }
//           }));
//         });

//         socket.on("chat-history", (history) => {
//           console.log("history: ", history);
//           setMessages(history);
//         });

//         socket.on("chat-message", (msg) => {
//           setMessages((prev) => [...prev, msg]);
//         });

//         socket.on("user-left", ({ socketId }) => {
//           console.log("User left:", socketId);
//           removePeerConnection(socketId);
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
//       socket.off("mic-toggled");
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
      
//       // Notify other users about mic toggle
//       socket.emit("mic-toggled", { roomId, micEnabled: next });
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
//       // Close all peer connections
//       Object.values(peerConnections.current).forEach(pc => {
//         pc.getSenders().forEach((s) => s.track?.stop());
//         pc.close();
//       });
      
//       localStreamRef.current?.getTracks().forEach((t) => t.stop());
//       peerConnections.current = {};
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
//       sender: username, // Use actual username instead of userLocalId
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
//       sender: username, // Use actual username instead of userLocalId
//       text: newMessage,
//       time: msg.time,
//     });

//     console.log("emited msg:...");

//     setNewMessage("");
//   };

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   // Calculate grid layout based on number of users
//   const totalUsers = Object.keys(remoteUsers).length + 1; // +1 for local user
//   const getGridCols = () => {
//     if (totalUsers <= 2) return "lg:grid-cols-2";
//     if (totalUsers <= 4) return "lg:grid-cols-2";
//     if (totalUsers <= 6) return "lg:grid-cols-3";
//     return "lg:grid-cols-4";
//   };

//   return (
//     <div className="pt-28 md:pt-36">
//       <div className="relative flex h-[calc(100vh-180px)] p-4 gap-4">
//         <div
//           className={`${
//             chatOpen ? "mr-[320px]" : "mr-0"
//           } transition-all duration-300 ease-in-out w-full`}
//         >
//           <div className={`grid grid-cols-1 ${getGridCols()} gap-4 h-full`}>
//             {/* Local user video */}
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
            
//             {/* Remote users videos */}
//             {Object.entries(remoteUsers).map(([socketId, user]) => (
//               <RemoteVideoComponent 
//                 key={socketId}
//                 socketId={socketId}
//                 username={user.username}
//                 videoEnabled={user.videoEnabled}
//               />
//             ))}
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
//             <div className="flex flex-col gap-4">
//               {messages.map((m, i) => (
//                 <div
//                   key={i}
//                   className={`flex flex-col gap-2 ${
//                     m.sender === username ? "items-end" : ""
//                   }`}
//                 >
//                   <div className="text-xs text-white/70">
//                     {m.sender} • {m.time}
//                   </div>
//                   <div
//                     className={`rounded-2xl p-4 text-[14px] max-w-[80%] ${
//                       m.sender === username
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
//             Participants ({totalUsers})
//           </div>
          
//           {/* Local user */}
//           <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg mb-2">
//             <div className="w-10 h-10 bg-gradient-to-br from-indigo-700 to-purple-700 rounded-full flex items-center justify-center text-xl">
//               {username?.charAt(0)?.toUpperCase() || 'Y'}
//             </div>
//             <div className="flex-1">
//               <div className="font-medium mb-1">You</div>
//               <div className="flex gap-2 text-xs opacity-70">
//                 <span className="flex items-center gap-1">
//                   {micOpen ? '🎙️ Active' : '🎙️ Muted'}
//                 </span>
//                 <span className="flex items-center gap-1">
//                   {camOpen ? '🎥 Active' : '🎥 Off'}
//                 </span>
//               </div>
//             </div>
//           </div>
          
//           {/* Remote users */}
//           {Object.entries(remoteUsers).map(([socketId, user]) => (
//             <div key={socketId} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg mb-2">
//               <div className="w-10 h-10 bg-gradient-to-br from-indigo-700 to-purple-700 rounded-full flex items-center justify-center text-xl">
//                 {user.username?.charAt(0)?.toUpperCase() || 'U'}
//               </div>
//               <div className="flex-1">
//                 <div className="font-medium mb-1">{user.username}</div>
//                 <div className="flex gap-2 text-xs opacity-70">
//                   <span className="flex items-center gap-1">
//                     {user.audioEnabled ? '🎙️ Active' : '🎙️ Muted'}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     {user.videoEnabled ? '🎥 Active' : '🎥 Off'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
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






// // src/components/CameraSection.jsx
import { IoIosPerson } from "react-icons/io";
import { useEffect, useRef, useState, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../../services/socket";
import { getUserId } from "../../utils/userId";

// Completely isolated video component that never re-renders unless absolutely necessary
const RemoteVideoComponent = memo(({ socketId, username, videoEnabled }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Store this video ref globally so parent can access it
    if (!window.remoteVideoRefs) window.remoteVideoRefs = {};
    window.remoteVideoRefs[socketId] = videoRef.current;
    
    return () => {
      if (window.remoteVideoRefs && window.remoteVideoRefs[socketId]) {
        delete window.remoteVideoRefs[socketId];
      }
    };
  }, [socketId]);

  // Listen for stream updates via custom events to avoid prop drilling
  useEffect(() => {
    const handleStreamUpdate = (event) => {
      if (event.detail.socketId === socketId && videoRef.current) {
        videoRef.current.srcObject = event.detail.stream;
        streamRef.current = event.detail.stream;
      }
    };

    window.addEventListener('remoteStreamUpdate', handleStreamUpdate);
    return () => window.removeEventListener('remoteStreamUpdate', handleStreamUpdate);
  }, [socketId]);

  return (
    <div className="relative bg-[linear-gradient(135deg,#374151_0%,#1f2937_100%)] shadow-[0_10px_30px_rgba(0,0,0,0.3)]
    rounded-2xl border-2 border-[rgba(255,255,255,0.1)] overflow-hidden">
      <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-lg z-50">
        <h2 className="font-medium text-sm">{username}</h2>
      </div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      {!videoEnabled && (
        <div className="flex justify-center items-center w-full h-full text-9xl text-white/60 relative z-[1] pointer-events-none">
          <IoIosPerson />
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if username or videoEnabled actually changed
  return prevProps.username === nextProps.username && 
         prevProps.videoEnabled === nextProps.videoEnabled &&
         prevProps.socketId === nextProps.socketId;
});

RemoteVideoComponent.displayName = 'RemoteVideoComponent';

const CameraSection = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [showParticipants, setShowPaticipants] = useState(false);
  const [micOpen, setMicOpen] = useState(true);
  const [camOpen, setCamOpen] = useState(true);
  const [videoDisplay, setVideoDisplay] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [remoteUsers, setRemoteUsers] = useState({});
  const [roomStartTime, setRoomStartTime] = useState(new Date());
  const [isConnecting, setIsConnecting] = useState(true);

  const { roomId, username } = useParams();
  const navigate = useNavigate();

  const peerConnections = useRef({});
  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const messagesEndRef = useRef(null);
  const remoteStreamsRef = useRef({});

  const userLocalId = getUserId();

  console.log('socket:', socket.id);
  console.log('remoteUsers:', remoteUsers);

  // Function to update remote streams without causing re-renders
  const updateRemoteStream = (socketId, stream) => {
    remoteStreamsRef.current[socketId] = stream;
    // Dispatch custom event to update video components
    window.dispatchEvent(new CustomEvent('remoteStreamUpdate', {
      detail: { socketId, stream }
    }));
  };

  // Create a new peer connection for a specific user
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

    // Add local tracks to this peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    // Handle incoming remote tracks
    pc.ontrack = (e) => {
      console.log('Received remote track from:', socketId);
      if (e.streams[0]) {
        updateRemoteStream(socketId, e.streams[0]);
      }
    };

    // Send ICE candidates
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          roomId,
          candidate: e.candidate,
          targetSocketId: socketId
        });
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log(`Peer connection with ${socketId}:`, pc.connectionState);
      if (pc.connectionState === 'connected') {
        console.log('Successfully connected to peer:', socketId);
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        console.log('Peer disconnected or failed:', socketId);
      }
    };

    peerConnections.current[socketId] = pc;
    return pc;
  };

  // Remove peer connection
  const removePeerConnection = (socketId) => {
    if (peerConnections.current[socketId]) {
      peerConnections.current[socketId].close();
      delete peerConnections.current[socketId];
    }
    
    setRemoteUsers(prev => {
      const newUsers = { ...prev };
      delete newUsers[socketId];
      return newUsers;
    });
    
    if (remoteStreamsRef.current[socketId]) {
      delete remoteStreamsRef.current[socketId];
    }

    // Clear video element
    if (window.remoteVideoRefs && window.remoteVideoRefs[socketId]) {
      window.remoteVideoRefs[socketId].srcObject = null;
      delete window.remoteVideoRefs[socketId];
    }
  };

  useEffect(() => {
    let mounted = true;
    setRoomStartTime(new Date());

    const start = async () => {
      try {
        setIsConnecting(true);
        
        // 1) start media
        console.log('Requesting media permissions...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        
        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        localStreamRef.current = stream;
        console.log('Local stream obtained successfully');

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          setVideoDisplay(true);
        }

        // 2) connect socket and join room
        console.log('Connecting to signaling server...');
        if (!socket.connected) socket.connect();
        
        // Wait for socket connection
        socket.on('connect', () => {
          console.log('Connected to signaling server, joining room...');
          socket.emit("join-room", { roomId, username });
          setIsConnecting(false);
        });

        if (socket.connected) {
          console.log('Already connected, joining room...');
          socket.emit("join-room", { roomId, username });
          setIsConnecting(false);
        }

        // Handle existing users in the room
        socket.on("existing-users", async (users) => {
          console.log('Existing users in room:', users);
          // Create peer connections for all existing users
          for (const user of users) {
            if (user.socketId !== socket.id) {
              console.log('Setting up connection to existing user:', user.username);
              setRemoteUsers(prev => ({
                ...prev,
                [user.socketId]: { 
                  username: user.username, 
                  videoEnabled: true, 
                  audioEnabled: true 
                }
              }));
              
              const pc = createPeerConnection(user.socketId);
              // Create and send offer to existing user
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              socket.emit("offer", { 
                roomId, 
                sdp: offer, 
                targetSocketId: user.socketId 
              });
              console.log('Sent offer to:', user.username);
            }
          }
        });

        // Handle new user joining
        socket.on("user-joined", async ({ socketId, remoteUsername }) => {
          console.log('New user joined:', remoteUsername, socketId);
          if (socketId !== socket.id) {
            setRemoteUsers(prev => ({
              ...prev,
              [socketId]: { 
                username: remoteUsername, 
                videoEnabled: true, 
                audioEnabled: true 
              }
            }));
            createPeerConnection(socketId);
            console.log('Created peer connection for new user:', remoteUsername);
          }
        });

        // Receive offer -> set remote, create/send answer
        socket.on("offer", async ({ sdp, fromSocketId }) => {
          console.log("Received offer from:", fromSocketId);
          let pc = peerConnections.current[fromSocketId];
          if (!pc) {
            pc = createPeerConnection(fromSocketId);
          }
          
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit("answer", { 
              roomId, 
              sdp: answer, 
              targetSocketId: fromSocketId 
            });
            console.log("Sent answer to:", fromSocketId);
          } catch (error) {
            console.error("Error handling offer:", error);
          }
        });

        // Receive answer -> set remote
        socket.on("answer", async ({ sdp, fromSocketId }) => {
          console.log("Received answer from:", fromSocketId);
          const pc = peerConnections.current[fromSocketId];
          if (pc) {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(sdp));
              console.log("Set remote description for answer from:", fromSocketId);
            } catch (error) {
              console.error("Error setting remote description:", error);
            }
          }
        });

        // Receive ICE -> add to pc
        socket.on("ice-candidate", async ({ candidate, fromSocketId }) => {
          try {
            const pc = peerConnections.current[fromSocketId];
            if (pc && pc.remoteDescription) {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
              console.log("Added ICE candidate from:", fromSocketId);
            }
          } catch (err) {
            console.warn("ICE add error", err);
          }
        });

        // Handle camera toggle from other users
        socket.on("camera-toggled", ({ fromSocketId, camEnabled }) => {
          console.log("Camera toggled by:", fromSocketId, camEnabled);
          setRemoteUsers(prev => ({
            ...prev,
            [fromSocketId]: {
              ...prev[fromSocketId],
              videoEnabled: camEnabled
            }
          }));
        });

        // Handle microphone toggle from other users
        socket.on("mic-toggled", ({ fromSocketId, micEnabled }) => {
          console.log("Mic toggled by:", fromSocketId, micEnabled);
          setRemoteUsers(prev => ({
            ...prev,
            [fromSocketId]: {
              ...prev[fromSocketId],
              audioEnabled: micEnabled
            }
          }));
        });

        // Chat functionality
        socket.on("chat-history", (history) => {
          console.log("Received chat history:", history);
          setMessages(history);
        });

        socket.on("chat-message", (msg) => {
          console.log("Received chat message:", msg);
          setMessages((prev) => [...prev, msg]);
        });

        // Handle user leaving
        socket.on("user-left", ({ socketId }) => {
          console.log("User left:", socketId);
          removePeerConnection(socketId);
        });

        // Handle socket connection errors
        socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          setIsConnecting(false);
        });

        socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          setIsConnecting(false);
        });

      } catch (e) {
        console.error("Failed to start media/connection", e);
        setIsConnecting(false);
        
        // Show user-friendly error message
        if (e.name === 'NotAllowedError') {
          alert('Camera and microphone access is required for video calls. Please allow access and refresh the page.');
        } else if (e.name === 'NotFoundError') {
          alert('No camera or microphone found. Please check your devices and try again.');
        } else {
          alert('Failed to start video call. Please check your devices and connection.');
        }
        
        navigate('/');
      }
    };

    start();

    return () => {
      mounted = false;
      
      // Cleanup event listeners
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-left");
      socket.off("existing-users");
      socket.off("camera-toggled");
      socket.off("mic-toggled");
      socket.off("chat-message");
      socket.off("chat-history");
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, [roomId, username, navigate]);

  const micToggle = () => {
    setMicOpen((prev) => {
      const next = !prev;
      
      // Toggle local audio tracks
      if (localStreamRef.current) {
        localStreamRef.current
          .getAudioTracks()
          .forEach((track) => {
            track.enabled = next;
          });
      }
      
      // Notify other users about mic toggle
      socket.emit("mic-toggled", { roomId, micEnabled: next });
      console.log('Mic toggled to:', next);
      
      return next;
    });
  };

  const camToggle = () => {
    setCamOpen((prev) => {
      const next = !prev;
      
      // Toggle local video tracks
      if (localStreamRef.current) {
        const videoTracks = localStreamRef.current.getVideoTracks();
        videoTracks.forEach((track) => {
          track.enabled = next;
        });
      }
      
      setVideoDisplay(next);
      socket.emit("camera-toggled", { roomId, camEnabled: next });
      console.log('Camera toggled to:', next);
      
      return next;
    });
  };

  const endCall = () => {
    try {
      console.log('Ending call...');
      
      // Close all peer connections
      Object.values(peerConnections.current).forEach(pc => {
        pc.getSenders().forEach((sender) => {
          if (sender.track) {
            sender.track.stop();
          }
        });
        pc.close();
      });
      
      // Stop local media tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
      
      // Clear references
      peerConnections.current = {};
      remoteStreamsRef.current = {};
      
      // Clear video refs
      if (window.remoteVideoRefs) {
        Object.keys(window.remoteVideoRefs).forEach(socketId => {
          if (window.remoteVideoRefs[socketId]) {
            window.remoteVideoRefs[socketId].srcObject = null;
          }
        });
        window.remoteVideoRefs = {};
      }
      
      console.log('Call ended successfully');
    } catch (error) {
      console.error('Error ending call:', error);
    } finally {
      socket.disconnect();
      navigate("/");
    }
  };

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  const toggleParticipants = () => {
    setShowPaticipants(!showParticipants);
  };

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

    // Add to local state immediately for better UX
    setMessages((prev) => [...prev, msg]);

    // Send to other users via socket
    socket.emit("chat-message", {
      roomId,
      sender: username,
      text: newMessage,
      time: msg.time,
    });

    console.log("Sent chat message:", msg);
    setNewMessage("");
  };

  const copyRoomLink = () => {
    const roomUrl = `${window.location.origin}/room/${roomId}/${username}`;
    navigator.clipboard.writeText(roomUrl);
    alert(`Room link copied to clipboard!\n${roomUrl}`);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Calculate grid layout based on number of users
  const totalUsers = Object.keys(remoteUsers).length + 1; // +1 for local user
  const getGridCols = () => {
    if (totalUsers <= 2) return "lg:grid-cols-2";
    if (totalUsers <= 4) return "lg:grid-cols-2";
    if (totalUsers <= 6) return "lg:grid-cols-3";
    return "lg:grid-cols-4";
  };

  // Show loading screen while connecting
  if (isConnecting) {
    return (
      <div className="pt-28 md:pt-36">
        <div className="flex items-center justify-center h-[calc(100vh-180px)]">
          <div className="text-center">
            <div className="text-6xl mb-4">🔄</div>
            <h2 className="text-2xl font-semibold mb-2 text-indigo-200">Connecting to Room</h2>
            <p className="text-white/60">Setting up your video call...</p>
            <div className="mt-6">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-36">
      {/* Room Header */}
      <div className="fixed top-20 left-4 right-4 z-[100]">
        <div className="bg-black/50 backdrop-blur-md rounded-lg px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-sm text-white/80">
              <span className="font-medium">Room:</span> {roomId}
            </div>
            <div className="text-xs text-white/60">
              {totalUsers} participant{totalUsers !== 1 ? 's' : ''}
            </div>
          </div>
          <button
            onClick={copyRoomLink}
            className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded hover:bg-indigo-500/30 transition"
            title="Copy room link"
          >
            📋 Copy Link
          </button>
        </div>
      </div>

      <div className="relative flex h-[calc(100vh-180px)] p-4 gap-4">
        <div
          className={`${
            chatOpen ? "mr-[320px]" : "mr-0"
          } transition-all duration-300 ease-in-out w-full`}
        >
          <div className={`grid grid-cols-1 ${getGridCols()} gap-4 h-full`}>
            {/* Local user video */}
            <div className="relative bg-[linear-gradient(135deg,#374151_0%,#1f2937_100%)] 
            shadow-[0_10px_30px_rgba(0,0,0,0.3)] rounded-2xl border-2 border-[rgba(255,255,255,0.1)] overflow-hidden">
              <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-lg z-50">
                <h2 className="font-medium text-sm">{username} (You)</h2>
              </div>
              
              {/* Connection status indicator */}
              <div className="absolute top-3 right-3 z-50">
                <div className={`w-3 h-3 rounded-full ${socket.connected ? 'bg-green-500' : 'bg-red-500'}`}
                     title={socket.connected ? 'Connected' : 'Disconnected'}>
                </div>
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
            
            {/* Remote users videos */}
            {Object.entries(remoteUsers).map(([socketId, user]) => (
              <RemoteVideoComponent 
                key={socketId}
                socketId={socketId}
                username={user.username}
                videoEnabled={user.videoEnabled}
              />
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        <div
          className={`fixed top-0 ${
            chatOpen ? "right-0" : "-right-full lg:-right-[320px]"
          } w-full lg:w-[320px]  
                h-screen border-l border-l-white/30 bg-[rgba(30,41,59,0.95)] z-[1000] backdrop-blur-[20px] flex flex-col transition-all duration-300 ease-in-out`}
        >
          <div className="border-b border-b-white/30 py-7 px-4 flex justify-between items-center">
            <div className="text-[18px] font-medium text-white/80">
              Room Chat
            </div>
            <button
              className="text-xl font-bold text-white/70 cursor-pointer hover:text-white transition"
              onClick={toggleChat}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          
          <div className="flex-1 px-5 py-3 overflow-y-auto">
            <div className="flex flex-col gap-4">
              {messages.length === 0 ? (
                <div className="text-center text-white/50 py-8">
                  <div className="text-2xl mb-2">💬</div>
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((m, i) => (
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
                      className={`rounded-2xl p-4 text-[14px] max-w-[80%] break-words ${
                        m.sender === username
                          ? "bg-[rgba(79,70,229,0.8)]"
                          : "bg-white/10"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-t-white/10 px-4 py-5 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-white/10 border border-white/20 p-3 rounded-xl placeholder:text-xs text-white text-sm focus:outline-none focus:border-blue-500"
              maxLength={500}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-[rgba(79,70,229,0.8)] px-4 py-3 rounded-xl text-xs font-medium hover:bg-[rgba(79,70,229,0.6)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>

        {/* Participants Panel */}
        <div
          className={`fixed top-28 ${
            showParticipants ? "left-0" : "left-[-280px]"
          }  w-[280px] bg-[rgba(30,41,59,0.95)] backdrop-blur-[10px] 
            border-r border-white/10 rounded-tr-xl rounded-br-xl p-6 transition-[left] duration-300 ease-in-out 
            z-[150]`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold text-indigo-300">
              Participants ({totalUsers})
            </div>
            <button
              onClick={toggleParticipants}
              className="text-white/70 hover:text-white transition"
              aria-label="Close participants"
            >
              ×
            </button>
          </div>
          
          {/* Local user */}
          <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-700 to-purple-700 rounded-full flex items-center justify-center text-xl">
              {username?.charAt(0)?.toUpperCase() || 'Y'}
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">You</div>
              <div className="flex gap-2 text-xs opacity-70">
                <span className="flex items-center gap-1">
                  {micOpen ? '🎙️ Active' : '🎙️ Muted'}
                </span>
                <span className="flex items-center gap-1">
                  {camOpen ? '🎥 Active' : '🎥 Off'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Remote users */}
          {Object.entries(remoteUsers).map(([socketId, user]) => (
            <div key={socketId} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-700 to-purple-700 rounded-full flex items-center justify-center text-xl">
                {user.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <div className="font-medium mb-1">{user.username}</div>
                <div className="flex gap-2 text-xs opacity-70">
                  <span className="flex items-center gap-1">
                    {user.audioEnabled ? '🎙️ Active' : '🎙️ Muted'}
                  </span>
                  <span className="flex items-center gap-1">
                    {user.videoEnabled ? '🎥 Active' : '🎥 Off'}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {totalUsers === 1 && (
            <div className="text-center text-white/50 py-4">
              <div className="text-2xl mb-2">👥</div>
              <p className="text-sm">Waiting for others to join...</p>
            </div>
          )}
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
            className={`rounded-full p-4 md:p-6 transition-all duration-200 hover:scale-110 cursor-pointer ${
              showParticipants
                ? "bg-green-500"
                : "bg-white/10 hover:bg-white/20"
            }`}
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