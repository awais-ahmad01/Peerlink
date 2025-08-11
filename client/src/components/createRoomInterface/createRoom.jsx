import React, { useState } from "react";

const CreateRoom = ({ roomId = "abc123", roomUrl }) => {
  const [copied, setCopied] = useState(false);
  const url = roomUrl ?? `https://peerlink.app/room/${roomId}`;

  function copyToClipboard() {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {
        // fallback
        const el = document.createElement("textarea");
        el.value = url;
        document.body.appendChild(el);
        el.select();
        try {
          document.execCommand("copy");
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch (e) {
          /* ignore */
        }
        document.body.removeChild(el);
      });
  }

  return (
    <main className="pt-32 md:pt-40 px-8 pb-10">
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 items-center">
        {/* Camera Preview */}
        <section className="space-y-6">
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-700 to-slate-800 aspect-video relative">
            {/* simulated camera feed area */}
            <div className="w-full h-full flex items-center justify-center text-6xl text-slate-300">
              👤
            </div>
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-md text-sm">
              Camera Preview (You're live)
            </div>
          </div>

          <div className="flex justify-center gap-4 p-3 bg-slate-800/80 rounded-xl backdrop-blur-sm">
            <button
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl hover:scale-105 transition transform"
              aria-label="Toggle Microphone"
            >
              🎙️
            </button>
            <button
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl hover:scale-105 transition transform"
              aria-label="Toggle Camera"
            >
              🎥
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
            >
              🔘 Start Call
            </button>
            <button
              className="flex-1 rounded-xl py-3 text-lg font-semibold
             bg-white/10 border border-white/10 hover:bg-white/20 transition cursor-pointer"
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
