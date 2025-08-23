import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import Loader from "../utils/loader";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [message, setMessage] = useState("Verifying your email...");
  const [isVerified, setIsVerified] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setLoading(true);
      axios
        .get(`${baseURL}/verifyEmail?token=${token}`)
        .then(() => {
          setLoading(false);
          setMessage("✅ Your email has been verified successfully!");
          setIsVerified(true);
        })
        .catch(() => {
          setLoading(false);
          setMessage("❌ Verification failed. The link may be invalid or expired.");
          setIsVerified(false);
        });
    } else {
      setMessage("❌ No token provided in the link.");
      setIsVerified(false);
    }
  }, [token]);

  const handleResend = () => {
    axios
      .post(`${baseURL}/resendVerification`, { email })
      .then(() => {
        alert("Verification email resent!");
      })
      .catch((err) => {
        alert("Failed to resend. Reason: " + err.response?.data?.message || err.message);
      });
  };

  const btnClass =
    "w-full rounded-xl p-4 text-lg font-semibold text-white relative overflow-hidden hover:translate-y-[-2px] hover:shadow-lg transition cursor-pointer";

  return (
    <div className="flex items-center justify-center min-h-screen py-10 px-5 bg-gradient-to-tr from-slate-800 to-slate-950">
      <div className="w-full max-w-lg bg-slate-800/60 border border-white/10 rounded-3xl p-8 backdrop-blur-lg shadow-2xl relative overflow-hidden">
      
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-t-3xl" />

        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold bg-gradient-to-tr from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Email Verification
          </h2>
          <p className="text-white/70 mt-2">{message}</p>
        </div>

     
        {loading && (
          <Loader/>
        )}

      
        {isVerified === true && (
          <Link to="/auth">
            <button
              className={`${btnClass} bg-gradient-to-tr from-indigo-600 to-purple-600`}
            >
              Go to Login
            </button>
          </Link>
        )}

        {isVerified === false && (
          <button
            onClick={handleResend}
            className={`${btnClass} bg-gradient-to-tr from-yellow-500 to-orange-500`}
          >
            Resend Verification Email
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
