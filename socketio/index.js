// // server/index.js
// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import cors from "cors";


// const app = express();
// app.use(cors());
// app.get("/", (_req, res) => res.send("PeerLink signaling server running"));

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "*", // in prod set: ['https://your-frontend.com']
//     methods: ["GET", "POST"],
//   },
// });

// // optional: in-memory room -> Set(socketId) (for debugging/roster if needed)
// const rooms = new Map();

// const msgRooms = {}; // { roomId: [ { sender, text, time }, ... ] }

// io.on("connection", (socket) => {
//   // client asks to join a room
//   socket.on("join-room", ({ roomId, username }) => {
//     console.log('userJoined::', username);
//     console.log('roomId::', roomId);
//     socket.join(roomId);

//     if (!rooms.has(roomId)) rooms.set(roomId, new Set());
//     rooms.get(roomId).add(socket.id);

//      if (msgRooms[roomId]) {
//       console.log('histroy..', msgRooms[roomId]);
//       socket.emit("chat-history", msgRooms[roomId]);
//     }

//      console.log('histroy:');
//     // notify other peers that a new user joined
//     socket.to(roomId).emit("user-joined", { socketId: socket.id , remoteUsername: username});
//   });

//   // WebRTC signaling relays
//   socket.on("offer", ({ roomId, sdp }) => {
//        console.log('Offer:')
//     socket.to(roomId).emit("offer", { sdp, from: socket.id });
//   });

//   socket.on("answer", ({ roomId, sdp }) => {
//        console.log('Answer:')
//     socket.to(roomId).emit("answer", { sdp, from: socket.id });
//   });

//   socket.on("ice-candidate", ({ roomId, candidate }) => {
//        console.log('Ice Cand:')
//     socket.to(roomId).emit("ice-candidate", { candidate, from: socket.id });
//   });

//   socket.on("camera-toggled", ({roomId, camEnabled})=>{
//        console.log('Camera Togg:')
//     socket.to(roomId).emit("camera-toggled", {camEnabled});
//   })


//   socket.on("chat-message", ({ roomId, sender, text, time }) => {
//     console.log('sneder:', sender);
//     console.log("text: ", text);

//     const msg = { sender, text, time };

//     if (!msgRooms[roomId]) msgRooms[roomId] = [];
//     msgRooms[roomId].push(msg);

//     // broadcast to everyone in room
//     // io.to(roomId).emit("chat-message", msg);

//     socket.to(roomId).emit("chat-message", msg);
//   });




//   // cleanup
//   socket.on("disconnecting", () => {
//     for (const roomId of socket.rooms) {
//       if (rooms.has(roomId)) {
//         rooms.get(roomId).delete(socket.id);
//         if (rooms.get(roomId).size === 0) rooms.delete(roomId);
//         socket.to(roomId).emit("user-left", { socketId: socket.id });
//       }
//     }
//   });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Signaling server listening on http://localhost:${PORT}`);
// });







// // server/index.js
// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import cors from "cors";

// const app = express();
// app.use(cors());
// app.get("/", (_req, res) => res.send("PeerLink signaling server running"));

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*", methods: ["GET", "POST"] },
// });

// // rooms = { roomId: Set<socketId> }
// const rooms = new Map();
// const msgRooms = {};

// io.on("connection", (socket) => {
//   socket.on("join-room", ({ roomId, username }) => {
//     socket.join(roomId);

//     if (!rooms.has(roomId)) rooms.set(roomId, new Set());
//     rooms.get(roomId).add(socket.id);

//     // Send chat history if exists
//     if (msgRooms[roomId]) {
//       socket.emit("chat-history", msgRooms[roomId]);
//     }

//     // Tell new user who’s already in the room
//     const existingUsers = [...rooms.get(roomId)].filter((id) => id !== socket.id);
//     socket.emit("existing-users", existingUsers);

//     // Notify others that a new user joined
//     socket.to(roomId).emit("user-joined", { socketId: socket.id, remoteUsername: username });
//   });

//   // Relay WebRTC messages
//   socket.on("offer", ({ sdp, to }) => {
//     io.to(to).emit("offer", { sdp, from: socket.id });
//   });

//   socket.on("answer", ({ sdp, to }) => {
//     io.to(to).emit("answer", { sdp, from: socket.id });
//   });

//   socket.on("ice-candidate", ({ candidate, to }) => {
//     io.to(to).emit("ice-candidate", { candidate, from: socket.id });
//   });

//   // Camera toggle
//   socket.on("camera-toggled", ({ roomId, camEnabled }) => {
//     socket.to(roomId).emit("camera-toggled", { socketId: socket.id, camEnabled });
//   });

//   // Chat messages
//   socket.on("chat-message", ({ roomId, sender, text, time }) => {
//     const msg = { sender, text, time };
//     if (!msgRooms[roomId]) msgRooms[roomId] = [];
//     msgRooms[roomId].push(msg);

//     io.to(roomId).emit("chat-message", msg);
//   });

//   // Handle disconnect
//   socket.on("disconnecting", () => {
//     for (const roomId of socket.rooms) {
//       if (rooms.has(roomId)) {
//         rooms.get(roomId).delete(socket.id);
//         if (rooms.get(roomId).size === 0) rooms.delete(roomId);
//         socket.to(roomId).emit("user-left", { socketId: socket.id });
//       }
//     }
//   });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Signaling server on http://localhost:${PORT}`));




// server/index.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.get("/", (_req, res) => res.send("PeerLink signaling server running"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // in prod set: ['https://your-frontend.com']
    methods: ["GET", "POST"],
  },
});

// Store room information: { roomId: { socketId: { username, socketId } } }
const rooms = new Map();
const msgRooms = {}; // { roomId: [ { sender, text, time }, ... ] }

io.on("connection", (socket) => {
  console.log('User connected:', socket.id);

  // Client asks to join a room
  socket.on("join-room", ({ roomId, username }) => {
    console.log('User joining room:', username, 'Room:', roomId, 'Socket:', socket.id);
    
    socket.join(roomId);

    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }

    const room = rooms.get(roomId);
    
    // Get existing users in the room (before adding the new user)
    const existingUsers = Array.from(room.values());
    
    // Add the new user to the room
    room.set(socket.id, { username, socketId: socket.id });

    // Send chat history to the new user
    if (msgRooms[roomId]) {
      console.log('Sending chat history to new user:', msgRooms[roomId]);
      socket.emit("chat-history", msgRooms[roomId]);
    }

    // Send existing users list to the new user
    socket.emit("existing-users", existingUsers);

    // Notify existing users that a new user joined
    socket.to(roomId).emit("user-joined", { 
      socketId: socket.id, 
      remoteUsername: username 
    });

    console.log(`Room ${roomId} now has ${room.size} users`);
  });

  // WebRTC signaling relays with target socket specification
  socket.on("offer", ({ roomId, sdp, targetSocketId }) => {
    console.log('Relaying offer from', socket.id, 'to', targetSocketId);
    socket.to(targetSocketId).emit("offer", { 
      sdp, 
      fromSocketId: socket.id 
    });
  });

  socket.on("answer", ({ roomId, sdp, targetSocketId }) => {
    console.log('Relaying answer from', socket.id, 'to', targetSocketId);
    socket.to(targetSocketId).emit("answer", { 
      sdp, 
      fromSocketId: socket.id 
    });
  });

  socket.on("ice-candidate", ({ roomId, candidate, targetSocketId }) => {
    console.log('Relaying ICE candidate from', socket.id, 'to', targetSocketId);
    socket.to(targetSocketId).emit("ice-candidate", { 
      candidate, 
      fromSocketId: socket.id 
    });
  });

  // Media control events
  socket.on("camera-toggled", ({ roomId, camEnabled }) => {
    console.log('Camera toggled by', socket.id, ':', camEnabled);
    socket.to(roomId).emit("camera-toggled", { 
      fromSocketId: socket.id, 
      camEnabled 
    });
  });

  socket.on("mic-toggled", ({ roomId, micEnabled }) => {
    console.log('Mic toggled by', socket.id, ':', micEnabled);
    socket.to(roomId).emit("mic-toggled", { 
      fromSocketId: socket.id, 
      micEnabled 
    });
  });

  // Chat message handling
  socket.on("chat-message", ({ roomId, sender, text, time }) => {
    console.log('Chat message from:', sender, 'Text:', text);

    const msg = { sender, text, time };

    // Store message in room history
    if (!msgRooms[roomId]) msgRooms[roomId] = [];
    msgRooms[roomId].push(msg);

    // Broadcast message to all other users in the room
    socket.to(roomId).emit("chat-message", msg);
  });

  // Cleanup when user disconnects
  socket.on("disconnecting", () => {
    console.log('User disconnecting:', socket.id);
    
    // Get all rooms this socket was in
    for (const roomId of socket.rooms) {
      if (roomId !== socket.id && rooms.has(roomId)) { // Skip the socket's own room
        const room = rooms.get(roomId);
        
        if (room.has(socket.id)) {
          // Remove user from room
          room.delete(socket.id);
          
          // Notify other users in the room
          socket.to(roomId).emit("user-left", { socketId: socket.id });
          
          console.log(`User ${socket.id} left room ${roomId}. Room now has ${room.size} users`);
          
          // Clean up empty rooms
          if (room.size === 0) {
            rooms.delete(roomId);
            // Optionally clean up chat history for empty rooms
            // delete msgRooms[roomId];
            console.log(`Room ${roomId} deleted (empty)`);
          }
        }
      }
    }
  });

  socket.on("disconnect", () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Signaling server listening on http://localhost:${PORT}`);
});