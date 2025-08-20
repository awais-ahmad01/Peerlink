// import { useState } from "react";

// const Dashboard= ()=> {
//   const [recentRooms, setRecentRooms] = useState([
//     {
//       id: "abc123",
//       date: "Today 2:30 PM",
//       duration: "45 minutes",
//       participants: 2,
//     },
//     {
//       id: "xyz789",
//       date: "Yesterday 4:15 PM",
//       duration: "1 hour 20 minutes",
//       participants: 3,
//     },
//     {
//       id: "def456",
//       date: "2 days ago",
//       duration: "30 minutes",
//       participants: 2,
//     },
//   ]);

//   const handleCopy = (roomId) => {
//     navigator.clipboard.writeText(roomId);
//     alert(`Copied room code: ${roomId}`);
//   };

//   const handleDelete = (roomId) => {
//     if (confirm("Are you sure you want to delete this room?")) {
//       setRecentRooms((rooms) => rooms.filter((room) => room.id !== roomId));
//     }
//   };

//   const handleJoin = () => {
//     const code = document.getElementById("joinCode").value.trim();
//     if (code) {
//       console.log("Joining room:", code);
//     } else {
//       alert("Please enter a room code or link");
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-4 md:p-8 pt-32 md:pt-40 grid gap-8">
//       {/* Welcome Header */}
//       <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-800/60 border border-white/10 rounded-xl backdrop-blur-md p-6">
//         <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-3xl font-bold shadow-lg">
//           A
//         </div>
//         <div className="text-center md:text-left">
//           <h1 className="text-3xl font-bold bg-gradient-to-br from-indigo-500 to-purple-500 bg-clip-text text-transparent">
//             Welcome, Awais 👋
//           </h1>
//           <p className="text-white/70 text-lg">
//             Ready to connect with others? Start a new room or join an existing one.
//           </p>
//         </div>
//       </div>

//       {/* Primary Actions Panel */}
//       <div className="grid md:grid-cols-[2fr_1fr] gap-6">
//         {/* Create Room */}
//         <div className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl">
//           <div className="relative z-10">
//             <h2 className="text-2xl font-bold mb-2">🟢 Create New Room</h2>
//             <p className="mb-4 opacity-90">
//               Start an instant video call with secure, private rooms. No downloads needed.
//             </p>
//             <button
//               onClick={() => console.log("Redirecting to create room...")}
//               className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-lg font-semibold backdrop-blur-sm hover:bg-white/30 transition"
//             >
//               <span>➕</span>
//               Create Room
//             </button>
//           </div>
//           <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-white/10 rounded-full pointer-events-none"></div>
//         </div>

//         {/* Join Room */}
//         <div className="bg-slate-800/60 border border-white/10 rounded-xl backdrop-blur-md p-4">
//           <h3 className="text-lg font-semibold mb-4 text-indigo-200">🔗 Join a Room</h3>
//           <input
//             id="joinCode"
//             type="text"
//             placeholder="Enter room code or paste link..."
//             className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm text-white placeholder-white/50 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//           />
//           <button
//             onClick={handleJoin}
//             className="w-full flex-1 rounded-xl py-3 text-lg font-semibold bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]  shadow-[0_4px_15px_rgba(102,126,234,0.3)] transform hover:translate-y-[-2px]
//              hover:shadow-[0_8px_25px_rgba(102,126,234,0.4)] transition cursor-pointer"
//           >
//             Join Room
//           </button>
//         </div>
//       </div>

//       {/* Recent Rooms */}
//       <div className="bg-slate-800/60 border border-white/10 rounded-xl backdrop-blur-md p-4">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-2xl font-semibold text-indigo-200">📜 Recent Rooms</h2>
//         </div>
//         {recentRooms.length > 0 ? (
//           <div className="flex flex-col gap-4">
//             {recentRooms.map((room) => (
//               <div
//                 key={room.id}
//                 className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
//               >
//                 <div>
//                   <div className="font-semibold">Room #{room.id}</div>
//                   <div className="text-sm text-white/60 flex flex-wrap gap-4">
//                     <span>📅 {room.date}</span>
//                     <span>⏱️ {room.duration}</span>
//                     <span>👥 {room.participants} participants</span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => console.log("Rejoining room", room.id)}
//                     className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition"
//                   >
//                     ↩️ Rejoin
//                   </button>
//                   <button
//                     onClick={() => handleCopy(room.id)}
//                     className="px-2 py-1 bg-white/10 rounded hover:bg-white/20 transition"
//                   >
//                     📋 Copy
//                   </button>
//                   <button
//                     onClick={() => handleDelete(room.id)}
//                     className="px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
//                   >
//                     🗑️ Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-8 text-white/60">
//             <div className="text-4xl mb-2">📭</div>
//             No recent rooms found.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// export default Dashboard;





import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { getRecentRooms, deleteRoom } from "../../store/actions/rooms";

const Dashboard = () => {
  const dispatch= useDispatch();

  const {user} = useSelector(state => state.auth);
  const {rooms, isloading} = useSelector(state => state.rooms);

  console.log("rooms: ", rooms)

  // const [rooms, setRecentRooms] = useState([]);
  // const [isloading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const roomRef = useRef();
  

  // const API_BASE_URL = "http://localhost:3000"; 

  useEffect(() => {

    fetchRecentRooms();

    // fetchRecentRooms();
  }, [user]);


  const fetchRecentRooms = ()=>{
    console.log("dispatching...")
    const username = user?.username || 'Awais';
    dispatch(getRecentRooms(username));
  }

  // const fetchRecentRooms = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch(`${API_BASE_URL}/get-rooms/${username}`);
      
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch rooms");
  //     }
      
  //     const rooms = await response.json();
  //     setRecentRooms(rooms);
  //     setError(null);
  //   } catch (err) {
  //     console.error("Error fetching recent rooms:", err);
  //     setError("Failed to load recent rooms");
  //     // Fallback to empty array if API fails
  //     setRecentRooms([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleCopy = (roomId) => {
    const roomUrl = `${window.location.origin}/room/${roomId}/${username}`;
    navigator.clipboard.writeText(roomUrl);
    alert(`Copied room link: ${roomUrl}`);
  };

  // const handleDelete = async (roomId) => {
  //   if (confirm("Are you sure you want to delete this room from your history?")) {
  //     try {
  //       const response = await fetch(`${API_BASE_URL}/delete-room/${roomId}/${username}`, {
  //         method: 'POST',
  //       });
        
  //       if (response.ok) {
  //         setRecentRooms((rooms) => rooms.filter((room) => room.id !== roomId));
  //       } else {
  //         alert("Failed to delete room");
  //       }
  //     } catch (error) {
  //       console.error("Error deleting room:", error);
  //       alert("Failed to delete room");
  //     }
  //   }
  // };


    const handleDelete = async (roomId) => {
    if (confirm("Are you sure you want to delete this room from your history?")) {
      dispatch(deleteRoom({username:user?.username, roomId}));
    }
  };


  
  const handleJoinRoom = ()=>{
    const input = roomRef.current?.value.trim();

    if(!input) return

    let roomId = input;
    
    if(input.startsWith('http')){
      const path = new URL(input);
      
      roomId = path.pathname.split('/').pop();
    }

    console.log('user:', user.username);
    
    navigate(`/call-room/${roomId}/${user?.username}`);
  }



  const handleRejoin = (roomId) => {
    navigate(`/room/${roomId}/${username}`);
  };

  const getParticipantsList = (participantNames) => {
    if (!participantNames || participantNames.length === 0) return "No participants";
    
    
    return participantNames.join(", ");
    
  };




  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pt-32 md:pt-40 grid gap-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-800/60 border border-white/10 rounded-xl backdrop-blur-md p-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-3xl font-bold shadow-lg">
          {user?.username.charAt(0).toUpperCase()}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold bg-gradient-to-br from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Welcome, {user?.username} 👋
          </h1>
          <p className="text-white/70 text-lg">
            Ready to connect with others? Start a new room or join an existing one.
          </p>
        </div>
      </div>

      {/* Primary Actions Panel */}
      <div className="grid md:grid-cols-[2fr_1fr] gap-6">
        {/* Create Room */}
        <div className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">🟢 Create New Room</h2>
            <p className="mb-4 opacity-90">
              Start an instant video call with secure, private rooms. No downloads needed.
            </p>
           <Link to='/create-room'>
               <button
              
              className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-lg font-semibold backdrop-blur-sm hover:bg-white/30 transition"
            >
              <span>➕</span>
              Create Room
            </button>
           </Link>
          </div>
          <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-white/10 rounded-full pointer-events-none"></div>
        </div>

        {/* Join Room */}
        <div className="bg-slate-800/60 border border-white/10 rounded-xl backdrop-blur-md p-4">
          <h3 className="text-lg font-semibold mb-4 text-indigo-200">🔗 Join a Room</h3>
          <input
            ref={roomRef}
            id="joinCode"
            type="text"
            placeholder="Enter room code or paste link..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm text-white placeholder-white/50 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
          />
          <button
            onClick={handleJoinRoom}
            className="w-full flex-1 rounded-xl py-3 text-lg font-semibold bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] shadow-[0_4px_15px_rgba(102,126,234,0.3)] transform hover:translate-y-[-2px] hover:shadow-[0_8px_25px_rgba(102,126,234,0.4)] transition cursor-pointer"
          >
            Join Room
          </button>
        </div>
      </div>

      {/* Recent Rooms */}
      <div className="bg-slate-800/60 border border-white/10 rounded-xl backdrop-blur-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-indigo-200">📜 Recent Rooms</h2>
          {!isloading && (
            <button
              onClick={fetchRecentRooms}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              🔄 Refresh
            </button>
          )}
        </div>

        {isloading ? (
          <div className="text-center py-8 text-white/60">
            <div className="text-2xl mb-2">⏳</div>
            Loading recent rooms...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-400">
            <div className="text-2xl mb-2">❌</div>
            {error}
            <button
              onClick={fetchRecentRooms}
              className="block mt-2 mx-auto text-sm text-indigo-400 hover:text-indigo-300"
            >
              Try Again
            </button>
          </div>
        ) : rooms.length > 0 ? (
          <div className="flex flex-col gap-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
              >
                <div className="flex-1">
                  <div className="font-semibold text-indigo-200 mb-1">Room #{room.id}</div>
                  <div className="text-sm text-white/60 flex flex-wrap gap-4 mb-2">
                    <span>📅 {room.date}</span>
                    <span>⏱️ {room.duration}</span>
                    <span>👥 {room.participants} participants</span>
                  </div>
                  <div className="text-xs text-white/50">
                    <span className="font-medium">Participants: </span>
                    {getParticipantsList(room?.participantNames)}
                  </div>

                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleRejoin(room.id)}
                    className="px-3 py-2 text-sm bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition"
                    title="Rejoin this room"
                  >
                    ↩️ Rejoin
                  </button>
                  <button
                    onClick={() => handleCopy(room.id)}
                    className="px-3 py-2 text-sm bg-white/10 rounded hover:bg-white/20 transition"
                    title="Copy room link"
                  >
                    📋 Copy Link
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="px-3 py-2 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
                    title="Remove from history"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-white/60">
            <div className="text-4xl mb-2">📭</div>
            <p className="mb-2">No recent rooms found.</p>
            <p className="text-sm">Join or create a room to see your history here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;