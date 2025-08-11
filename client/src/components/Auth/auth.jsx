import { useState } from "react";

const AuthPage =()=> {
  const [isLogin, setIsLogin] = useState(true);
  const [loginMessage, setLoginMessage] = useState("");
  const [signupMessage, setSignupMessage] = useState("");
  const [signupPasswords, setSignupPasswords] = useState({ pass: "", confirm: "" });
  const [showPassword, setShowPassword] = useState({ login: false, signupPass: false, signupConfirm: false });

  const toggleForm = () => setIsLogin(!isLogin);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginMessage("Success! Redirecting to dashboard...");
    setTimeout(() => {
      console.log("Redirecting to dashboard...");
    }, 2000);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (signupPasswords.pass !== signupPasswords.confirm) {
      setSignupMessage("Passwords do not match. Please try again.");
      return;
    }
    setSignupMessage("Account created successfully! Welcome to PeerLink.");
    setTimeout(() => {
      console.log("Redirecting to dashboard...");
    }, 2000);
  };

  const inputClass =
    "w-full bg-white/10 border-2 border-white/20 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-indigo-600 focus:bg-white/15 focus:ring-4 focus:ring-indigo-500/10";

  const labelClass =
    "block text-sm font-semibold text-indigo-300 mb-2 uppercase tracking-wider";

  const btnClass =
    "w-full bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl p-4 text-lg font-semibold text-white relative overflow-hidden hover:translate-y-[-2px] hover:shadow-lg transition";

  return (
    <div className="py-10 px-5">
      <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-800/60 border border-white/10 rounded-3xl p-8 backdrop-blur-lg shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-t-3xl" />

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 border-b-2 ${
              isLogin ? "border-indigo-500 text-white" : "border-transparent text-white/70"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 border-b-2 ${
              !isLogin ? "border-indigo-500 text-white" : "border-transparent text-white/70"
            }`}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-6 animate-fadeIn">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-tr from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-white/70 text-sm">Sign in to your PeerLink account</p>
            </div>

            {loginMessage && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  loginMessage.includes("Success")
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}
              >
                {loginMessage}
              </div>
            )}

            <div>
              <label className={labelClass}>Email Address</label>
              <input type="email" placeholder="Enter your email" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPassword.login ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({ ...prev, login: !prev.login }))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white cursor-pointer"
                >
                  {showPassword.login ? "🙈" : "👁️"}
                </button>
              </div>
              <div className="text-right mt-2">
                <a href="#" className="text-indigo-500 hover:text-purple-500 text-sm">
                  Forgot Password?
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 accent-indigo-600" />
              <span className="text-sm text-white/80">Remember me for 30 days</span>
            </div>

            <button type="submit" className={btnClass}>
              Sign In to PeerLink
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="text-xs text-white/60 uppercase tracking-wider">Or continue with</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            <div className="flex gap-3">
              <a
                href="#"
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition"
              >
                🔍 Google
              </a>
              {/* <a
                href="#"
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition"
              >
                📘 Facebook
              </a> */}
            </div>

            <div className="text-center mt-6 border-t border-white/10 pt-6">
              <p className="text-white/70 mb-2">Don't have an account?</p>
              <button
                type="button"
                onClick={toggleForm}
                className="text-indigo-500 hover:text-purple-500 font-semibold"
              >
                Create your account →
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-6 animate-fadeIn">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-tr from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Create Account
              </h2>
              <p className="text-white/70 text-sm">Join PeerLink and start connecting</p>
            </div>

            {signupMessage && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  signupMessage.includes("successfully")
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}
              >
                {signupMessage}
              </div>
            )}

            <div>
              <label className={labelClass}>Full Name</label>
              <input type="text" placeholder="Enter your full name" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Email Address</label>
              <input type="email" placeholder="Enter your email" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPassword.signupPass ? "text" : "password"}
                  placeholder="Create a strong password"
                  required
                  className={inputClass}
                  value={signupPasswords.pass}
                  onChange={(e) => setSignupPasswords((p) => ({ ...p, pass: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({ ...prev, signupPass: !prev.signupPass }))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white cursor-pointer"
                >
                  {showPassword.signupPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword.signupConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  required
                  className={inputClass}
                  value={signupPasswords.confirm}
                  onChange={(e) => setSignupPasswords((p) => ({ ...p, confirm: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => ({ ...prev, signupConfirm: !prev.signupConfirm }))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white cursor-pointer"
                >
                  {showPassword.signupConfirm ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" required className="w-5 h-5 accent-indigo-600" />
              <span className="text-sm text-white/80">
                I agree to the{" "}
                <a href="#" className="text-indigo-500 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-indigo-500 hover:underline">
                  Privacy Policy
                </a>
              </span>
            </div>

           

            <button type="submit" className={btnClass}>
              Create Your Account
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="text-xs text-white/60 uppercase tracking-wider">Or sign up with</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            <div className="flex gap-3">
              <a
                href="#"
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition"
              >
                🔍 Google
              </a>
              {/* <a
                href="#"
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition"
              >
                📘 Facebook
              </a> */}
            </div>

            <div className="text-center mt-6 border-t border-white/10 pt-6">
              <p className="text-white/70 mb-2">Already have an account?</p>
              <button
                type="button"
                onClick={toggleForm}
                className="text-indigo-500 hover:text-purple-500 font-semibold"
              >
                Sign in instead →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
    </div>
  );
}


export default AuthPage;