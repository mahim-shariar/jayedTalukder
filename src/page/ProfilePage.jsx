import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  updatePassword,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} from "../services/api";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    createdAt: "",
  });
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password update state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Forgot password state
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");

  // Reset password state

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await getCurrentUser();
        setUserData({
          name: response.data.user.name,
          email: response.data.user.email,
          createdAt: new Date(
            response.data.user.createdAt
          ).toLocaleDateString(),
        });
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        // If unauthorized, redirect to login
        if (
          err.message === "You are not logged in! Please log in to get access."
        ) {
          navigate("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Check for reset token in URL
    const token = searchParams.get("token");
    if (token) {
      setActiveTab("security");
    } else {
      fetchUserData();
    }
  }, [searchParams]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  // Update the handlePasswordSubmit function:
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    setIsLoading(true);

    console.log(passwordForm);
    try {
      await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setSuccess("Password updated successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  // Update the handleForgotPasswordSubmit function:
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setForgotPasswordSuccess("");

    if (!forgotPasswordEmail) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword({ email: forgotPasswordEmail });
      setForgotPasswordSuccess("Password reset link sent to your email");
      setForgotPasswordEmail("");
      setShowForgotPasswordForm(false);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] z-0"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjA1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')] opacity-15 pointer-events-none z-10"></div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 py-20 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Profile header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 border-b border-white/10 pb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600 mb-2">
                {userData.name}'s Profile
              </h1>
              <p className="text-white/60 font-mono">
                EDITOR_DASHBOARD / PROFILE_SETTINGS
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 md:mt-0 px-4 py-2 border border-white/20 hover:border-red-500 text-white/80 hover:text-red-400 transition-colors duration-300 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              Back to Dashboard
            </button>
          </div>

          {/* Tab navigation */}
          <div className="flex border-b border-white/10 mb-8">
            <button
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === "profile"
                  ? "border-red-500 text-red-400"
                  : "border-transparent text-white/50 hover:text-white/80"
              } transition-colors`}
              onClick={() => setActiveTab("profile")}
            >
              Profile Info
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === "security"
                  ? "border-red-500 text-red-400"
                  : "border-transparent text-white/50 hover:text-white/80"
              } transition-colors`}
              onClick={() => setActiveTab("security")}
            >
              Security
            </button>
          </div>

          {/* Profile tab content */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0f0f0f]/50 border border-white/10 rounded-lg p-6 md:p-8 backdrop-blur-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile image */}
                <div className="md:col-span-1 flex flex-col items-center">
                  <div className="relative w-40 h-40 rounded-full border-4 border-red-500/30 overflow-hidden mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-blue-500/10"></div>
                    <div className="absolute inset-0 bg-[url('/image/jayed-2.JPG')] bg-cover bg-center"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjAzIiBudW1PY3RhdmVzPSIyIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4xIi8+Cjwvc3ZnPg==')] opacity-20"></div>
                  </div>
                  <button className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors rounded text-sm">
                    Change Avatar
                  </button>
                </div>

                {/* Profile info */}
                <div className="md:col-span-2">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-mono text-red-400 mb-2">
                        FULL NAME
                      </label>
                      <div className="bg-black/20 border border-white/10 rounded-lg px-4 py-3 font-mono">
                        {userData.name}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-mono text-red-400 mb-2">
                        EMAIL
                      </label>
                      <div className="bg-black/20 border border-white/10 rounded-lg px-4 py-3 font-mono">
                        {userData.email}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-mono text-red-400 mb-2">
                        MEMBER SINCE
                      </label>
                      <div className="bg-black/20 border border-white/10 rounded-lg px-4 py-3 font-mono">
                        {userData.createdAt}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Security tab content */}
          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0f0f0f]/50 border border-white/10 rounded-lg p-6 md:p-8 backdrop-blur-sm"
            >
              {showForgotPasswordForm ? (
                <>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mb-6">
                    Forgot Password
                  </h2>

                  {error && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-900/50 rounded-lg text-red-400">
                      {error}
                    </div>
                  )}

                  {forgotPasswordSuccess && (
                    <div className="mb-6 p-4 bg-green-900/30 border border-green-900/50 rounded-lg text-green-400">
                      {forgotPasswordSuccess}
                    </div>
                  )}

                  <form onSubmit={handleForgotPasswordSubmit}>
                    <div className="space-y-6 max-w-lg">
                      <div>
                        <label className="block text-sm font-mono text-red-400 mb-2">
                          EMAIL ADDRESS
                        </label>
                        <input
                          type="email"
                          value={forgotPasswordEmail}
                          onChange={(e) =>
                            setForgotPasswordEmail(e.target.value)
                          }
                          className="w-full bg-black/30 border border-white/10 focus:border-red-500/50 rounded-lg px-4 py-3 text-white font-mono transition-all duration-300"
                          required
                        />
                      </div>

                      <div className="pt-4 flex space-x-4">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded transition-colors duration-300 flex items-center justify-center min-w-40"
                        >
                          {isLoading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Sending...
                            </>
                          ) : (
                            "Send Reset Link"
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowForgotPasswordForm(false)}
                          className="px-6 py-3 border border-white/20 hover:border-red-500 text-white/80 hover:text-red-400 transition-colors duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mb-6">
                    Password Settings
                  </h2>

                  {error && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-900/50 rounded-lg text-red-400">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="mb-6 p-4 bg-green-900/30 border border-green-900/50 rounded-lg text-green-400">
                      {success}
                    </div>
                  )}

                  <form onSubmit={handlePasswordSubmit}>
                    <div className="space-y-6 max-w-lg">
                      <div>
                        <label className="block text-sm font-mono text-red-400 mb-2">
                          CURRENT PASSWORD
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full bg-black/30 border border-white/10 focus:border-red-500/50 rounded-lg px-4 py-3 text-white font-mono transition-all duration-300"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-mono text-red-400 mb-2">
                          NEW PASSWORD
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full bg-black/30 border border-white/10 focus:border-red-500/50 rounded-lg px-4 py-3 text-white font-mono transition-all duration-300"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-mono text-red-400 mb-2">
                          CONFIRM NEW PASSWORD
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full bg-black/30 border border-white/10 focus:border-red-500/50 rounded-lg px-4 py-3 text-white font-mono transition-all duration-300"
                          required
                        />
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded transition-colors duration-300 flex items-center justify-center min-w-40"
                        >
                          {isLoading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Updating...
                            </>
                          ) : (
                            "Update Password"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="mt-12 pt-6 border-t border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Security Recommendations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-white/10 bg-black/20 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          <h4 className="font-medium">Strong Passwords</h4>
                        </div>
                        <p className="text-sm text-white/70">
                          Use a mix of letters, numbers, and special characters.
                        </p>
                      </div>
                      <div className="p-4 border border-white/10 bg-black/20 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          <h4 className="font-medium">Regular Updates</h4>
                        </div>
                        <p className="text-sm text-white/70">
                          Change your password every 3-6 months.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Floating film particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `scale(${0.5 + Math.random() * 2})`,
            }}
          />
        ))}
      </div>

      {/* Film strip borders */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#1a1a1a] border-b border-white/10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#1a1a1a] border-t border-white/10"></div>
    </div>
  );
}
