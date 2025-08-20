// src/pages/CreateRoom.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateRoom = () => {
  const { user } = useSelector((state) => state.auth);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [copied, setCopied] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const url = `http://localhost:5173/call-room/${roomId}`;
  const navigate = useNavigate();

  // Local camera preview refs
  const previewRef = useRef(null);
  const localPreviewStreamRef = useRef(null);

  useEffect(() => {
    // Start local camera/mic preview
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localPreviewStreamRef.current = stream;
        if (previewRef.current) {
          previewRef.current.srcObject = stream;
        }
      } catch (e) {
        console.warn("Camera/Mic permission denied or unavailable", e);
      }
    })();

    function generateRoomId(length = 8) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      setRoomId(result);

      return true;
    }

    generateRoomId();

    return () => {
      // Stop preview when leaving
      localPreviewStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function copyToClipboard() {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {
        const el = document.createElement("textarea");
        el.value = url;
        document.body.appendChild(el);
        el.select();
        try {
          document.execCommand("copy");
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch (e) {}
        document.body.removeChild(el);
      });
  }

  const handleStartCall = () => {

    if(user){
      navigate(`/call-room/${roomId}/${user?.username}`);
    }
    else{
      navigate(`/call-room/${roomId}/${username}`);
    }
  };

  const handleShareLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "PeerLink Room", url });
      } else {
        await copyToClipboard();
      }
    } catch {}
  };

  return (
    <main className="pt-32 md:pt-40 px-8 pb-10">
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 items-center">
        {/* Camera Preview */}
        <section className="space-y-6">
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-700 to-slate-800 aspect-video relative">
            {/* ✅ Actual camera feed visible */}
            <video
              ref={previewRef}
              autoPlay
              playsInline
              // muted
              className="absolute inset-0 w-full h-full object-cover z-[1]"
            />
            {/* Emoji overlay (optional) */}
            <div className="w-full h-full flex items-center justify-center text-6xl text-slate-300 relative z-[2] pointer-events-none opacity-50">
              👤
            </div>
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-md text-sm z-[3]">
              Camera Preview (You're live)
            </div>
          </div>

          <div className="flex justify-center gap-4 p-3 bg-slate-800/80 rounded-xl backdrop-blur-sm">
            <button
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl hover:scale-105 transition transform
          ${isMicOn ? "bg-green-500" : "bg-red-500"}`}
              aria-label="Toggle Microphone"
              onClick={() => {
                const enabled =
                  !localPreviewStreamRef.current?.getAudioTracks()?.[0]
                    ?.enabled;

                localPreviewStreamRef.current
                  ?.getAudioTracks()
                  .forEach((t) => (t.enabled = enabled));

                setIsMicOn(enabled); // update state for UI
              }}
            >
              {isMicOn ? "🎙️" : "🔇"}
            </button>

            {/* 🎥 Camera Button */}
            <button
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl hover:scale-105 transition transform
          ${isCamOn ? "bg-green-500" : "bg-red-500"}`}
              aria-label="Toggle Camera"
              onClick={() => {
                const enabled =
                  !localPreviewStreamRef.current?.getVideoTracks()?.[0]
                    ?.enabled;

                localPreviewStreamRef.current
                  ?.getVideoTracks()
                  .forEach((t) => (t.enabled = enabled));

                setIsCamOn(enabled); // update state for UI
              }}
            >
              {isCamOn ? "🎥" : "🚫"}
            </button>
            <button
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl hover:scale-105 transition transform"
              aria-label="Settings"
            >
              ⚙️
            </button>
            <button
              className="w-12 h-12 rounded-full bg-red-500/90 flex items-center justify-center text-xl hover:scale-105 transition transform"
              aria-label="Cancel"
              onClick={() => {
                localPreviewStreamRef.current
                  ?.getTracks()
                  .forEach((t) => t.stop());
                window.history.back();
              }}
            >
              ❌
            </button>
          </div>
        </section>

        {/* Room Info */}
        <aside className="space-y-6">
          <header className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Ready to Connect
            </h1>
            <p className="text-slate-300">
              Your room is ready! Share the link below to invite others.
            </p>
          </header>

          <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-4">
            {!user?.username && (
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-300">
                  Your Name
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1 w-full px-3 py-2 rounded-md bg-black/20 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-300">
                  Room ID
                </div>
                <div className="font-mono text-xl font-semibold text-indigo-400">
                  {roomId}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-black/20 rounded-md p-3">
              <div className="flex-1 font-mono text-sm text-slate-200 break-all">
                {url}
              </div>
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-sm font-medium cursor-pointer"
              >
                {copied ? "Copied!" : "📋 Copy"}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex-1 rounded-xl py-3 text-lg font-semibold bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]  shadow-[0_4px_15px_rgba(102,126,234,0.3)] transform hover:translate-y-[-2px]
             hover:shadow-[0_8px_25px_rgba(102,126,234,0.4)] transition cursor-pointer"
              onClick={handleStartCall}
              disabled={!user?.username ? username.trim() === "" : false}
            >
              🔘 Start Call
            </button>
            <button
              className="flex-1 rounded-xl py-3 text-lg font-semibold
             bg-white/10 border border-white/10 hover:bg-white/20 transition cursor-pointer"
              onClick={handleShareLink}
            >
              🔗 Share Invite Link
            </button>
          </div>

          <div className="p-3 rounded-xl bg-emerald-900/10 border border-emerald-600/20 text-emerald-400 text-center">
            Waiting for others to join
            <span className="inline-flex ml-3 items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce delay-75" />
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce delay-150" />
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce delay-200" />
            </span>
          </div>
        </aside>
      </div>

      {/* Simple responsive helpers */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        .animate-bounce { animation: bounce 1.4s infinite both; }
        .delay-75 { animation-delay: -0.32s; }
        .delay-150 { animation-delay: -0.16s; }
        .delay-200 { animation-delay: 0s; }
      `}</style>
    </main>
  );
};

export default CreateRoom;
