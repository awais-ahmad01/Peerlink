import { useEffect, useRef, useState, useCallback } from 'react';
import { socket } from '../services/socket';

const iceConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' } // add TURN for production
  ]
};

export default function useWebRTC(roomId, displayName) {
  const [peers, setPeers] = useState([]); // [{socketId, displayName}]
  const [chat, setChat] = useState([]);   // [{from, message, at}]
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null); // for 1:1; for multi, manage map
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const meRef = useRef(null);
  const otherRef = useRef(null); // 1:1 convenience

  // device toggles
  const toggleMic = useCallback((on) => {
    localStreamRef.current?.getAudioTracks().forEach(t => t.enabled = on);
  }, []);
  const toggleCam = useCallback((on) => {
    localStreamRef.current?.getVideoTracks().forEach(t => t.enabled = on);
  }, []);

  const startLocal = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
  }, []);

  const makePC = useCallback(() => {
    pcRef.current = new RTCPeerConnection(iceConfig);

    // Local tracks
    localStreamRef.current.getTracks().forEach(track => {
      pcRef.current.addTrack(track, localStreamRef.current);
    });

    // Remote track(s)
    pcRef.current.ontrack = (e) => {
      // 1:1: first stream
      if (remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
        remoteVideoRef.current.srcObject = e.streams[0];
      }
    };

    // ICE
    pcRef.current.onicecandidate = (e) => {
      if (e.candidate && otherRef.current) {
        socket.emit('ice-candidate', {
          to: otherRef.current,
          from: meRef.current,
          candidate: e.candidate
        });
      }
    };
  }, []);

  const createOfferTo = useCallback(async (toSocketId) => {
    otherRef.current = toSocketId;
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    socket.emit('offer', { to: toSocketId, from: meRef.current, sdp: offer });
  }, []);

  const handleIncomingOffer = useCallback(async ({ from, sdp }) => {
    otherRef.current = from;
    await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);
    socket.emit('answer', { to: from, from: meRef.current, sdp: answer });
  }, []);

  const handleIncomingAnswer = useCallback(async ({ from, sdp }) => {
    await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
  }, []);

  const handleIncomingIce = useCallback(async ({ candidate }) => {
    try {
      await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (e) {
      console.warn('Error adding ICE candidate', e);
    }
  }, []);

  const sendMessage = useCallback((text) => {
    socket.emit('send-message', { roomId, from: meRef.current, message: text });
  }, [roomId]);

  const leave = useCallback(() => {
    socket.emit('leave-room', { roomId, userId: meRef.current });
    try {
      pcRef.current?.getSenders().forEach(s => s.track?.stop());
      localStreamRef.current?.getTracks().forEach(t => t.stop());
      pcRef.current?.close();
    } catch {}
    socket.disconnect();
  }, [roomId]);

  useEffect(() => {
    (async () => {
      await startLocal();
      socket.connect();

      socket.on('connect', () => {
        meRef.current = socket.id;
        socket.emit('join-room', { roomId, displayName });
      });

      // roster / who is here
      socket.on('joined', ({ you, users }) => {
        meRef.current = you;
        setPeers(users);
        makePC();

        // If someone else is already here (1:1), be the caller
        const others = users.filter(u => u.socketId !== you);
        if (others.length > 0) {
          createOfferTo(others[0].socketId);
        }
      });

      socket.on('user-joined', (user) => {
        setPeers(prev => {
          const exists = prev.some(p => p.socketId === user.socketId);
          return exists ? prev : [...prev, user];
        });
        // If we are alone until now, initiate call to the newcomer (1:1)
        createOfferTo(user.socketId);
      });

      // signaling
      socket.on('incoming-offer', handleIncomingOffer);
      socket.on('incoming-answer', handleIncomingAnswer);
      socket.on('incoming-ice', handleIncomingIce);

      // chat
      socket.on('chat-message', (msg) => setChat(prev => [...prev, msg]));

      // user left
      socket.on('user-left', ({ socketId }) => {
        setPeers(prev => prev.filter(p => p.socketId !== socketId));
        // For 1:1, you may want to clear remote video
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      });
    })();

    return () => {
      socket.off(); // remove all listeners
    };
  }, [roomId, displayName, startLocal, makePC, createOfferTo, handleIncomingOffer, handleIncomingAnswer, handleIncomingIce]);

  return {
    localVideoRef,
    remoteVideoRef,
    peers,
    chat,
    sendMessage,
    toggleMic,
    toggleCam,
    leave
  };
}
