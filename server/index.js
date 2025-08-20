// const app = require('express')();

// const dotenv = require('dotenv');
// dotenv.config();
// const session = require('express-session');
// const passport = require('passport');
// require('./config/passport');



// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const authRoute = require('./routes/auth-routes');




// mongoose.connect(process.env.MONGO_URI)
// .then(() => {
//     console.log('Connected to MongoDB');
// })
// .catch(err => {
//     console.error('MongoDB connection error:', err);
// });

// app.use(cors({
//     origin: 'http://localhost:5173',
//     // origin: 'https://mind-map-puce-mu.vercel.app',
//     methods: 'GET,POST', 
// }));
// app.use(bodyParser.json());


// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true
// }));
// app.use(passport.initialize());
// app.use(passport.session());


// app.use(authRoute)




// app.listen(process.env.PORT || 3001, () => {
//     console.log('Server is running on port ', process.env.PORT);
// });







// const app = require('express')();

// const dotenv = require('dotenv');
// dotenv.config();
// const session = require('express-session');
// const passport = require('passport');
// require('./config/passport');

// const http = require("http");
// const { Server } = require("socket.io");

// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mongoose = require('mongoose');

// const authRoute = require('./routes/auth-routes');
// const roomRoute = require('./routes/room-routes');
// const Room = require('./models/room');


// mongoose.connect(process.env.MONGO_URI)
// .then(() => {
//     console.log('Connected to MongoDB');
// })
// .catch(err => {
//     console.error('MongoDB connection error:', err);
// });



// app.use(cors({
//     origin: [
//       "https://peerlink-phi.vercel.app",
//       "http://localhost:5173"
//     ],
//     methods: 'GET,POST', 
//     credentials: true
// }));

// app.use(bodyParser.json());

// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true
// }));

// app.use(passport.initialize());

// app.use(passport.session());


// app.use(authRoute);
// app.use(roomRoute);



// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//    origin: [
//       "https://peerlink-phi.vercel.app",
//       "http://localhost:5173"
//     ],
//     methods: ["GET", "POST"],
//     credentials: true
//   },
// });

// // Store room information: { roomId: { socketId: { username, socketId, joinedAt } } }
// const activeRooms = new Map();
// const msgRooms = {}; // { roomId: [ { sender, text, time }, ... ] }

// io.on("connection", (socket) => {
//   console.log('User connected:', socket.id);

//   // Client asks to join a room
//   socket.on("join-room", async ({ roomId, username }) => {
//     console.log('User joining room:', username, 'Room:', roomId, 'Socket:', socket.id);
    
//     socket.join(roomId);

//     try {
//       // Find or create room in database
//       let room = await Room.findOne({ roomId, status: 'active' });
      
//       if (!room) {
//         room = new Room({
//           roomId,
//           participants: [],
//           status: 'active'
//         });
//       }

//       // Add participant to database
//       const participantExists = room.participants.some(p => p.username === username);
//       if (!participantExists) {
//         room.participants.push({
//           username,
//           socketId: socket.id,
//           joinedAt: new Date()
//         });
//       }

//       // Update max participants count
//       const currentParticipants = room.participants.filter(p => !p.leftAt).length;
//       if (currentParticipants > room.maxParticipants) {
//         room.maxParticipants = currentParticipants;
//       }

//       await room.save();

//       // Initialize active room if it doesn't exist
//       if (!activeRooms.has(roomId)) {
//         activeRooms.set(roomId, new Map());
//       }

//       const activeRoom = activeRooms.get(roomId);
      
//       // Get existing users in the room (before adding the new user)
//       const existingUsers = Array.from(activeRoom.values());
      
//       // Add the new user to active room
//       activeRoom.set(socket.id, { 
//         username, 
//         socketId: socket.id,
//         joinedAt: new Date()
//       });

//       // Send chat history to the new user
//       if (msgRooms[roomId]) {
//         console.log('Sending chat history to new user:', msgRooms[roomId]);
//         socket.emit("chat-history", msgRooms[roomId]);
//       }

//       // Send existing users list to the new user
//       socket.emit("existing-users", existingUsers);

//       // Notify existing users that a new user joined
//       socket.to(roomId).emit("user-joined", { 
//         socketId: socket.id, 
//         remoteUsername: username 
//       });

//       console.log(`Room ${roomId} now has ${activeRoom.size} users`);
//     } catch (error) {
//       console.error("Error handling join-room:", error);
//     }
//   });

//   // WebRTC signaling relays with target socket specification
//   socket.on("offer", ({ roomId, sdp, targetSocketId }) => {
//     console.log('Relaying offer from', socket.id, 'to', targetSocketId);
//     socket.to(targetSocketId).emit("offer", { 
//       sdp, 
//       fromSocketId: socket.id 
//     });
//   });

//   socket.on("answer", ({ roomId, sdp, targetSocketId }) => {
//     console.log('Relaying answer from', socket.id, 'to', targetSocketId);
//     socket.to(targetSocketId).emit("answer", { 
//       sdp, 
//       fromSocketId: socket.id 
//     });
//   });

//   socket.on("ice-candidate", ({ roomId, candidate, targetSocketId }) => {
//     console.log('Relaying ICE candidate from', socket.id, 'to', targetSocketId);
//     socket.to(targetSocketId).emit("ice-candidate", { 
//       candidate, 
//       fromSocketId: socket.id 
//     });
//   });

//   // Media control events
//   socket.on("camera-toggled", ({ roomId, camEnabled }) => {
//     console.log('Camera toggled by', socket.id, ':', camEnabled);
//     socket.to(roomId).emit("camera-toggled", { 
//       fromSocketId: socket.id, 
//       camEnabled 
//     });
//   });

//   socket.on("mic-toggled", ({ roomId, micEnabled }) => {
//     console.log('Mic toggled by', socket.id, ':', micEnabled);
//     socket.to(roomId).emit("mic-toggled", { 
//       fromSocketId: socket.id, 
//       micEnabled 
//     });
//   });

//   // Chat message handling
//   socket.on("chat-message", ({ roomId, sender, text, time }) => {
//     console.log('Chat message from:', sender, 'Text:', text);

//     const msg = { sender, text, time };

//     // Store message in room history
//     if (!msgRooms[roomId]) msgRooms[roomId] = [];
//     msgRooms[roomId].push(msg);

//     // Broadcast message to all other users in the room
//     socket.to(roomId).emit("chat-message", msg);
//   });

//   // Cleanup when user disconnects
//   socket.on("disconnecting", async () => {
//     console.log('User disconnecting:', socket.id);
    
//     // Get all rooms this socket was in
//     for (const roomId of socket.rooms) {
//       if (roomId !== socket.id && activeRooms.has(roomId)) { // Skip the socket's own room
//         const activeRoom = activeRooms.get(roomId);
        
//         if (activeRoom.has(socket.id)) {
//           const userData = activeRoom.get(socket.id);
          
//           try {
//             // Update database - mark participant as left
//             await Room.findOneAndUpdate(
//               { 
//                 roomId, 
//                 status: 'active',
//                 "participants.socketId": socket.id 
//               },
//               { 
//                 $set: { 
//                   "participants.$.leftAt": new Date() 
//                 } 
//               }
//             );

//             // Check if this was the last user in the room
//             const remainingUsers = activeRoom.size - 1;
            
//             if (remainingUsers === 0) {
//               // End the room in database
//               const room = await Room.findOne({ roomId, status: 'active' });
//               if (room) {
//                 const duration = Math.round((new Date() - room.createdAt) / (1000 * 60)); // in minutes
//                 await Room.findOneAndUpdate(
//                   { roomId, status: 'active' },
//                   { 
//                     endedAt: new Date(),
//                     duration,
//                     status: 'ended'
//                   }
//                 );
//               }
//             }
//           } catch (error) {
//             console.error("Error updating room on disconnect:", error);
//           }

//           // Remove user from active room
//           activeRoom.delete(socket.id);
          
//           // Notify other users in the room
//           socket.to(roomId).emit("user-left", { socketId: socket.id });
          
//           console.log(`User ${socket.id} left room ${roomId}. Room now has ${activeRoom.size} users`);
          
//           // Clean up empty rooms
//           if (activeRoom.size === 0) {
//             activeRooms.delete(roomId);
//             console.log(`Room ${roomId} deleted (empty)`);
//           }
//         }
//       }
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log('User disconnected:', socket.id);
//   });
// });




// server.listen(process.env.PORT || 3001, () => {
//     console.log('Server is running on port ', process.env.PORT);
// });


const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const session = require('express-session');
const passport = require('passport');

// Only require passport config if the file exists
try {
  require('./config/passport');
} catch (error) {
  console.log('Passport config not found, skipping...');
}

const http = require("http");
const { Server } = require("socket.io");

const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Only require routes if they exist
let authRoute, roomRoute, Room;
try {
  authRoute = require('./routes/auth-routes');
  roomRoute = require('./routes/room-routes');
  Room = require('./models/room');
} catch (error) {
  console.log('Some routes/models not found, creating fallbacks...');
  authRoute = express.Router();
  roomRoute = express.Router();
}

// Enhanced error handling for MongoDB
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
      console.log('✅ Connected to MongoDB');
  })
  .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      // Don't exit - let the app run without DB for now
  });
} else {
  console.log('⚠️ MONGO_URI not provided, skipping database connection');
}

// CORS configuration
app.use(cors({
    origin: [
      "https://peerlink-phi.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Basic middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint - MUST be first
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Basic test endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'PeerLink Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint for Socket.IO
app.get('/socket-test', (req, res) => {
  res.json({ 
    message: 'Socket.IO endpoint ready',
    transport: 'http'
  });
});

// Use routes if they exist
app.use('/auth', authRoute);
app.use('/room', roomRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  console.log('404 - Not found:', req.method, req.path);
  res.status(404).json({ 
    error: 'Not found',
    path: req.path,
    method: req.method
  });
});

// Create HTTP server
const server = http.createServer(app);

// Socket.IO configuration with enhanced error handling
const io = new Server(server, {
  cors: {
    origin: [
      "https://peerlink-phi.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  // Start with polling for better compatibility
  transports: ['polling', 'websocket'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  // Add these for Railway
  allowRequest: (req, callback) => {
    console.log('Socket.IO connection attempt from:', req.headers.origin);
    callback(null, true);
  }
});

// Store room information
const activeRooms = new Map();
const msgRooms = {};

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log('✅ User connected:', socket.id);
  console.log('🔗 Transport:', socket.conn.transport.name);

  // Test event
  socket.emit('welcome', { message: 'Connected to PeerLink server!' });

  // Client asks to join a room
  socket.on("join-room", async ({ roomId, username }) => {
    console.log('👤 User joining room:', username, 'Room:', roomId, 'Socket:', socket.id);
    
    socket.join(roomId);

    try {
      let room;
      
      // Only use database if Room model is available
      if (Room) {
        room = await Room.findOne({ roomId, status: 'active' });
        
        if (!room) {
          room = new Room({
            roomId,
            participants: [],
            status: 'active'
          });
        }

        const participantExists = room.participants.some(p => p.username === username);
        if (!participantExists) {
          room.participants.push({
            username,
            socketId: socket.id,
            joinedAt: new Date()
          });
        }

        const currentParticipants = room.participants.filter(p => !p.leftAt).length;
        if (currentParticipants > room.maxParticipants) {
          room.maxParticipants = currentParticipants;
        }

        await room.save();
      }

      // Initialize active room if it doesn't exist
      if (!activeRooms.has(roomId)) {
        activeRooms.set(roomId, new Map());
      }

      const activeRoom = activeRooms.get(roomId);
      const existingUsers = Array.from(activeRoom.values());
      
      activeRoom.set(socket.id, { 
        username, 
        socketId: socket.id,
        joinedAt: new Date()
      });

      // Send chat history to the new user
      if (msgRooms[roomId]) {
        console.log('📜 Sending chat history to new user');
        socket.emit("chat-history", msgRooms[roomId]);
      }

      // Send existing users list to the new user
      socket.emit("existing-users", existingUsers);

      // Notify existing users that a new user joined
      socket.to(roomId).emit("user-joined", { 
        socketId: socket.id, 
        remoteUsername: username 
      });

      console.log(`🏠 Room ${roomId} now has ${activeRoom.size} users`);
    } catch (error) {
      console.error("❌ Error handling join-room:", error.message);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  // WebRTC signaling events
  socket.on("offer", ({ roomId, sdp, targetSocketId }) => {
    console.log('📡 Relaying offer from', socket.id, 'to', targetSocketId);
    socket.to(targetSocketId).emit("offer", { 
      sdp, 
      fromSocketId: socket.id 
    });
  });

  socket.on("answer", ({ roomId, sdp, targetSocketId }) => {
    console.log('📡 Relaying answer from', socket.id, 'to', targetSocketId);
    socket.to(targetSocketId).emit("answer", { 
      sdp, 
      fromSocketId: socket.id 
    });
  });

  socket.on("ice-candidate", ({ roomId, candidate, targetSocketId }) => {
    console.log('📡 Relaying ICE candidate from', socket.id, 'to', targetSocketId);
    socket.to(targetSocketId).emit("ice-candidate", { 
      candidate, 
      fromSocketId: socket.id 
    });
  });

  // Media control events
  socket.on("camera-toggled", ({ roomId, camEnabled }) => {
    console.log('📹 Camera toggled by', socket.id, ':', camEnabled);
    socket.to(roomId).emit("camera-toggled", { 
      fromSocketId: socket.id, 
      camEnabled 
    });
  });

  socket.on("mic-toggled", ({ roomId, micEnabled }) => {
    console.log('🎙️ Mic toggled by', socket.id, ':', micEnabled);
    socket.to(roomId).emit("mic-toggled", { 
      fromSocketId: socket.id, 
      micEnabled 
    });
  });

  // Chat message handling
  socket.on("chat-message", ({ roomId, sender, text, time }) => {
    console.log('💬 Chat message from:', sender);

    const msg = { sender, text, time };

    if (!msgRooms[roomId]) msgRooms[roomId] = [];
    msgRooms[roomId].push(msg);

    socket.to(roomId).emit("chat-message", msg);
  });

  // Handle disconnection
  socket.on("disconnecting", async () => {
    console.log('👋 User disconnecting:', socket.id);
    
    for (const roomId of socket.rooms) {
      if (roomId !== socket.id && activeRooms.has(roomId)) {
        const activeRoom = activeRooms.get(roomId);
        
        if (activeRoom.has(socket.id)) {
          try {
            // Update database if available
            if (Room) {
              await Room.findOneAndUpdate(
                { 
                  roomId, 
                  status: 'active',
                  "participants.socketId": socket.id 
                },
                { 
                  $set: { 
                    "participants.$.leftAt": new Date() 
                  } 
                }
              );

              const remainingUsers = activeRoom.size - 1;
              if (remainingUsers === 0) {
                const room = await Room.findOne({ roomId, status: 'active' });
                if (room) {
                  const duration = Math.round((new Date() - room.createdAt) / (1000 * 60));
                  await Room.findOneAndUpdate(
                    { roomId, status: 'active' },
                    { 
                      endedAt: new Date(),
                      duration,
                      status: 'ended'
                    }
                  );
                }
              }
            }
          } catch (error) {
            console.error("❌ Error updating room on disconnect:", error.message);
          }

          activeRoom.delete(socket.id);
          socket.to(roomId).emit("user-left", { socketId: socket.id });
          
          console.log(`🏠 User left room ${roomId}. Room now has ${activeRoom.size} users`);
          
          if (activeRoom.size === 0) {
            activeRooms.delete(roomId);
            console.log(`🏠 Room ${roomId} deleted (empty)`);
          }
        }
      }
    }
  });

  socket.on("disconnect", (reason) => {
    console.log('❌ User disconnected:', socket.id, 'Reason:', reason);
  });

  socket.on("error", (error) => {
    console.error("❌ Socket error:", error);
  });
});

// Server error handling
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Start server
const PORT = process.env.PORT || 3001;

server.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 Server is running on port', PORT);
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    console.log('📡 Socket.IO ready for connections');
    console.log('🔗 Health check available at /health');
});

// Log any unhandled errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});