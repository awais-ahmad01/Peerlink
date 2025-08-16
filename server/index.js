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

// optional: in-memory room -> Set(socketId) (for debugging/roster if needed)
const rooms = new Map();

io.on("connection", (socket) => {
  // client asks to join a room
  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);

    if (!rooms.has(roomId)) rooms.set(roomId, new Set());
    rooms.get(roomId).add(socket.id);

    // notify other peers that a new user joined
    socket.to(roomId).emit("user-joined", { socketId: socket.id });
  });

  // WebRTC signaling relays
  socket.on("offer", ({ roomId, sdp }) => {
    socket.to(roomId).emit("offer", { sdp, from: socket.id });
  });

  socket.on("answer", ({ roomId, sdp }) => {
    socket.to(roomId).emit("answer", { sdp, from: socket.id });
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", { candidate, from: socket.id });
  });

  socket.on("camera-toggled", ({roomId, camEnabled})=>{
    socket.to(roomId).socket.emit("camera-toggled", {camEnabled});
  })

  // cleanup
  socket.on("disconnecting", () => {
    for (const roomId of socket.rooms) {
      if (rooms.has(roomId)) {
        rooms.get(roomId).delete(socket.id);
        if (rooms.get(roomId).size === 0) rooms.delete(roomId);
        socket.to(roomId).emit("user-left", { socketId: socket.id });
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Signaling server listening on http://localhost:${PORT}`);
});
