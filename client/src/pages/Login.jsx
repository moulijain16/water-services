import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../services/api";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const action = isSignup ? signup : login;
      const res = await action(username, password);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-ink-300/30 p-6 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4 text-center">RO Water Services</h1>
        <input className="input mb-3" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="input mb-4" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-danger mb-3">{error}</p>}
        <button type="submit" className="btn-primary w-full mb-3">
          {isSignup ? "Sign up" : "Log in"}
        </button>
        <p className="text-xs text-center text-ink-500">
          {isSignup ? "Already have an account?" : "First time here?"}{" "}
          <button type="button" onClick={() => setIsSignup(!isSignup)} className="text-teal-600 underline">
            {isSignup ? "Log in" : "Sign up"}
          </button>
        </p>
      </form>
    </div>
  );
}