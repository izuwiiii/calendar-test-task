"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import "../../globals.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function Login() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);

      router.push("/events");
      toast.success("User Logged In Succesfully!", {
        position: "top-center",
      });
    } catch (error: any) {
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  if (user) {
    router.push("/events");
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="shadow w-xl flex flex-col rounded-2xl p-8 self-center"
    >
      <h3 className="mb-3">Login</h3>

      <div className="mb-3 flex flex-col justify-between">
        <label>Email address</label>
        <input
          type="email"
          className="input"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3 flex flex-col justify-between">
        <label>Password</label>
        <input
          type="password"
          className="input"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="d-grid">
        <button
          type="submit"
          className="bg-[#212529] hover:bg-[#343a40] cursor-pointer text-[#f8f9fa] rounded-md py-1.5 px-2"
        >
          Submit
        </button>
      </div>
      <p className="forgot-password text-right">
        New user{" "}
        <a href="/register" className="text-blue-400">
          Register Here
        </a>
      </p>
    </form>
  );
}

export default Login;
