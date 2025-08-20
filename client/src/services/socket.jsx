// // src/services/socket.js
// import { io } from "socket.io-client";

// // change this for production:
// const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";
// console.log('URL:', SOCKET_URL)
// // const SOCKET_URL = "peerlink.up.railway.app";

// export const socket = io(SOCKET_URL, {
//   autoConnect: false, // connect on demand
//   transports: ["websocket"],
// });



import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// Ensure the URL uses wss:// for secure WebSocket connections
const getSocketUrl = () => {
  if (SOCKET_URL.includes('https://')) {
    return SOCKET_URL;
  }
  // For production, force wss:// if the frontend is HTTPS
  if (window.location.protocol === 'https:') {
    return SOCKET_URL.replace('http://', 'https://');
  }
  return SOCKET_URL;
};

export const socket = io(getSocketUrl(), {
  autoConnect: false,
  transports: ["websocket"],
  secure: window.location.protocol === 'https:',
  // Add reconnection options
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000
});




// import { io } from "socket.io-client";

// const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// // Enhanced socket URL configuration for production
// const getSocketUrl = () => {
//   if (!SOCKET_URL) {
//     console.error('VITE_SOCKET_URL environment variable is not set');
//     return 'https://peerlink.up.railway.app';
//   }
  
//   // For Railway deployment, ensure we use the correct protocol
//   if (SOCKET_URL.includes('railway.app')) {
//     // Railway provides HTTPS by default, but we need to handle WebSocket protocol correctly
//     return SOCKET_URL.replace('http://', 'https://');
//   }
  
//   // For production, force HTTPS if the frontend is served over HTTPS
//   if (window.location.protocol === 'https:' && SOCKET_URL.startsWith('http://')) {
//     return SOCKET_URL.replace('http://', 'https://');
//   }
  
//   return SOCKET_URL;
// };

// console.log('Socket URL:', getSocketUrl());

// export const socket = io(getSocketUrl(), {
//   autoConnect: false,
//   // Use both websocket and polling for better compatibility
//   transports: ["websocket", "polling"],
  
//   // For HTTPS sites, ensure secure connection
//   secure: window.location.protocol === 'https:',
  
//   // Enhanced reconnection options for production
//   reconnection: true,
//   reconnectionAttempts: 10,
//   reconnectionDelay: 1000,
//   reconnectionDelayMax: 5000,
//   maxReconnectionAttempts: 10,
//   timeout: 20000,
  
//   // Additional options for production stability
//   forceNew: false,
//   multiplex: true,
  
//   // Upgrade options
//   upgrade: true,
//   rememberUpgrade: true,
  
//   // Add query parameters for debugging
//   query: {
//     client: 'web',
//     version: '1.0.0'
//   }
// });

// // Add connection event listeners for debugging
// socket.on('connect', () => {
//   console.log('✅ Socket connected successfully:', socket.id);
// });

// socket.on('disconnect', (reason) => {
//   console.log('❌ Socket disconnected:', reason);
// });

// socket.on('connect_error', (error) => {
//   console.error('🔴 Socket connection error:', error.message);
//   console.error('Error details:', error);
// });

// socket.on('reconnect', (attemptNumber) => {
//   console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
// });

// socket.on('reconnect_error', (error) => {
//   console.error('🔴 Socket reconnection error:', error.message);
// });

// socket.on('reconnect_failed', () => {
//   console.error('🔴 Socket reconnection failed after all attempts');
// });