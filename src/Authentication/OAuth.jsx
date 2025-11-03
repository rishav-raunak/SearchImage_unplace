import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Github,
  Facebook,
  LogIn,
  AlertCircle,
  User 
} from "lucide-react";


const API_URL = "http://localhost:5000";


const MessageDisplay = ({ message }) => {
  if (!message) return null;
  const isError = message.type === "error";
  return (
    <div
      className={`p-3 rounded-md flex items-center gap-2 text-sm ${isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        }`}
    >
      <AlertCircle className="w-5 h-5" />
      <span>{message.text}</span>
    </div>
  );
};


export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'/'error', text: '...' }

  
  useEffect(() => {
    const handleAuthMessage = (event) => {
 
      if (event.origin !== "http://localhost:5000" && event.origin !== window.origin) {
         console.warn("Received message from unknown origin:", event.origin);
        
      }

      const { token, user, error } = event.data;

      if (token && user) {
        onLogin(token, user);
      } else if (error) {
        setMessage({ type: "error", text: error });
      }
    };

    window.addEventListener("message", handleAuthMessage);

   
    return () => {
      window.removeEventListener("message", handleAuthMessage);
    };
  }, [onLogin]); 

 
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!email || !password) {
      return setMessage({ type: "error", text: "Please enter all fields" });
    }
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.token, data.user); 
      } else {
        setMessage({ type: "error", text: data.error || "Login failed" });
      }
    } catch (err) {
      console.error("Login Fetch Error:", err); 
      setMessage({ type: "error", text: "Server error. Please try again." });
    }
  };

  //  Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!name || !email || !password) {
      return setMessage({ type: "error", text: "Please enter all fields" });
    }
    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text: "Registration successful! Please login now.",
        });
        setIsRegister(false); // Login tab par bhej do
      } else {
        setMessage({ type: "error", text: data.error || "Registration failed" });
      }
    } catch (err) {
      console.error("Register Fetch Error:", err);
      setMessage({ type: "error", text: "Server error. Please try again." });
    }
  };

 
  const handleOAuth = (provider) => {
    const url = `${API_URL}/auth/${provider.toLowerCase()}`;
    // Popup window
    window.open(url, "OAuthLogin", "width=500,height=600");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-center">
          <LogIn className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          {isRegister ? "Create Account" : "Log in to Soul"}
        </h2>

        
        <MessageDisplay message={message} />

       
        <form
          onSubmit={isRegister ? handleRegister : handleLogin}
          className="space-y-4"
        >
          {isRegister && (
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <div className="relative mt-1">
                <User className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your Name"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <div className="relative mt-1">
              <Mail className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full p-3 pl-10 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full p-3 pl-10 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-3 text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700"
          >
            {isRegister ? "Register" : "Log In"}
          </button>
        </form>

        <p
          onClick={() => {
            setIsRegister(!isRegister);
            setMessage(null); // Toggle karte waqt message clear kar do
          }}
          className="text-center text-sm text-blue-600 cursor-pointer hover:underline"
        >
          {isRegister
            ? "Already have an account? Login"
            : "Don’t have an account? Register"}
        </p>

        {/* Separator */}
        <div className="flex items-center justify-center space-x-2">
          <span className="w-full h-px bg-gray-300 dark:bg-gray-600"></span>
          <span className="text-sm text-gray-500 dark:text-gray-400">OR</span>
          <span className="w-full h-px bg-gray-300 dark:bg-gray-600"></span>
        </div>

      
        <div className="space-y-3">
          <button
            onClick={() => handleOAuth("Google")}
            className="w-full flex items-center justify-center gap-3 p-3 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.828 14.82C34.557 11.023 29.61 9 24 9C12.955 9 4 17.955 4 29s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691c2.866-2.583 6.606-4.131 10.74-4.131C23.045 10.56 28.18 13.518 31.391 17.843l-4.223 3.918C25.43 19.336 21.94 18 18 18c-3.045 0-5.833 1.173-7.961 3.039l-4.223-3.918z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-4.707-4.509C30.65 36.678 27.53 38 24 38c-3.645 0-6.89-1.556-9.101-4.018l-4.707 4.509C14.14 42.023 18.834 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l4.707 4.509C39.123 34.015 42.064 29.56 42.823 24H43.611z"
              />
            </svg>
            Continue with Google
          </button>

          <button
            onClick={() => handleOAuth("Facebook")}
            className="w-full flex items-center justify-center gap-3 p-3 text-white bg-[#1877F2] rounded-md shadow-md hover:bg-opacity-90"
          >
            <Facebook className="w-5 h-5" />
            Continue with Facebook
          </button>

          <button
            onClick={() => handleOAuth("GitHub")}
            className="w-full flex items-center justify-center gap-3 p-3 text-white bg-[#333] rounded-md shadow-md hover:bg-opacity-90"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}

