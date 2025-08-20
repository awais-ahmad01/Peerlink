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