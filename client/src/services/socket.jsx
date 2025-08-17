// src/services/socket.js
import { io } from "socket.io-client";

// change this for production:
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
// const SOCKET_URL = "peerlink.up.railway.app";

export const socket = io(SOCKET_URL, {
  autoConnect: false, // connect on demand
  transports: ["websocket"],
});
