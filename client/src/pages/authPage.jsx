import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { signinUser, registerUser } from "../store/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { FcGoogle } from "react-icons/fc";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const signupSchema = yup.object().shape({
  username: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords do not match")
    .required("Confirm password is required"),
});

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);
  console.log("errr", error);
  const [isLogin, setIsLogin] = useState(true);
  const [loginMessage, setLoginMessage] = useState("");
  const [signupMessage, setSignupMessage] = useState("");
  const [showPassword, setShowPassword] = useState({
    login: false,
    signupPass: false,
    signupConfirm: false,
  });

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const toggleForm = () => setIsLogin(!isLogin);

  const onLoginSubmit = (data) => {
    console.log("Login Data:", data);
    setLoginMessage("Success! Redirecting to dashboard...");
    dispatch(signinUser(data))
      .unwrap()
      .then(() => {
        navigate("/dashboard");
      })
      
  };

  const onSignupSubmit = (data) => {
    console.log("Signup Data:", data);
    // setSignupMessage("Account created successfully! Welcome to PeerLink.");
    dispatch(registerUser(data))
      .unwrap()
      .then((res) => {
        alert(res?.data?.message || "User Registered Successfully!!");
      })
      
  };

  const handleGoogleLogin = () => {
    window.location.href = `${baseURL}/auth/google`;
  };

  const inputClass =
    "w-full bg-white/10 border-2 border-white/20 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-indigo-600 focus:bg-white/15 focus:ring-4 focus:ring-indigo-500/10";

  const labelClass =
    "block text-sm font-semibold text-indigo-300 mb-2 uppercase tracking-wider";

  const btnClass =
    "w-full bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl p-4 text-lg font-semibold text-white relative overflow-hidden hover:translate-y-[-2px] hover:shadow-lg transition cursor-pointer";

  return (
    <div className="flex items-center justify-center py-10 px-5 bg-gradient-to-tr from-slate-800 to-slate-950 min-h-screen">
      <div className="w-full max-w-lg bg-slate-800/60 border border-white/10 rounded-3xl p-8 backdrop-blur-lg shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-t-3xl" />

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 border-b-2 cursor-pointer ${
              isLogin
                ? "border-indigo-500 text-white"
                : "border-transparent text-white/70"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 border-b-2 cursor-pointer ${
              !isLogin
                ? "border-indigo-500 text-white"
                : "border-transparent text-white/70"
            }`}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? (
          <div>
            <form
              onSubmit={handleLoginSubmit(onLoginSubmit)}
              className="space-y-6 animate-fadeIn"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-tr from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome Back
                </h2>
                <p className="text-white/70 text-sm">
                  Sign in to your PeerLink account
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg">
                  {error}
                </div>
              )}

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
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...loginRegister("email")}
                  className={inputClass}
                />
                {loginErrors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {loginErrors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword.login ? "text" : "password"}
                    placeholder="Enter your password"
                    {...loginRegister("password")}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        login: !prev.login,
                      }))
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white cursor-pointer"
                  >
                    {showPassword.login ? "🙈" : "👁️"}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="text-red-400 text-sm mt-1">
                    {loginErrors.password.message}
                  </p>
                )}
              </div>

              <button type="submit" className={btnClass}>
                Sign In to PeerLink
              </button>

             
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="text-xs text-white/60 uppercase tracking-wider">
                  Or continue with
                </span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>
            </form>

            <div className="flex gap-3">
              <button
                onClick={handleGoogleLogin}
                className="flex-1 flex items-center justify-center gap-2 p-3 cursor-pointer
                 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition"
              >
                <FcGoogle className="" />
                Google
              </button>
            </div>

         
            <div className="text-center mt-6 border-t border-white/10 pt-6">
              <p className="text-white/70 mb-2">Don't have an account?</p>
              <button
                type="button"
                onClick={toggleForm}
                className="text-indigo-500 hover:text-purple-500 font-semibold cursor-pointer"
              >
                Create your account →
              </button>
            </div>
          </div>
        ) : (
          <div>
            <form
              onSubmit={handleSignupSubmit(onSignupSubmit)}
              className="space-y-6 animate-fadeIn"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-tr from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Create Account
                </h2>
                <p className="text-white/70 text-sm">
                  Join PeerLink and start connecting
                </p>
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
                <input
                  type="text"
                  placeholder="Enter your full name"
                  {...signupRegister("username")}
                  className={inputClass}
                />
                {signupErrors.name && (
                  <p className="text-red-400 text-sm mt-1">
                    {signupErrors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...signupRegister("email")}
                  className={inputClass}
                />
                {signupErrors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {signupErrors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword.signupPass ? "text" : "password"}
                    placeholder="Create a strong password"
                    {...signupRegister("password")}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        signupPass: !prev.signupPass,
                      }))
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white cursor-pointer"
                  >
                    {showPassword.signupPass ? "🙈" : "👁️"}
                  </button>
                </div>
                {signupErrors.password && (
                  <p className="text-red-400 text-sm mt-1">
                    {signupErrors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPassword.signupConfirm ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...signupRegister("confirmPassword")}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        signupConfirm: !prev.signupConfirm,
                      }))
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white cursor-pointer"
                  >
                    {showPassword.signupConfirm ? "🙈" : "👁️"}
                  </button>
                </div>
                {signupErrors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">
                    {signupErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button type="submit" className={btnClass}>
                Create Your Account
              </button>

             
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="text-xs text-white/60 uppercase tracking-wider">
                  Or sign up with
                </span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>
            </form>

            <div className="flex gap-3">
              <button
                onClick={handleGoogleLogin}
                className="flex-1 flex items-center justify-center gap-2 cursor-pointer
                 p-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition"
              >
                <FcGoogle className="" />
                Google
              </button>
            </div>

            
            <div className="text-center mt-6 border-t border-white/10 pt-6">
              <p className="text-white/70 mb-2">Already have an account?</p>
              <button
                type="button"
                onClick={toggleForm}
                className="text-indigo-500 hover:text-purple-500 font-semibold cursor-pointer"
              >
                Sign in instead →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
