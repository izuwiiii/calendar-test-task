"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../../../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import "../../globals.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function Register() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: user.email,
        });
      }
      toast.success("User Registered Succesfully!", { position: "top-center" });
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/events");
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
      onSubmit={handleRegister}
      className="shadow w-xl flex flex-col rounded-2xl p-8 self-center"
    >
      <h3 className="mb-3">Sign Up</h3>

      <div className="mb-3 flex justify-between flex-col">
        <label>Name</label>
        <input
          type="text"
          placeholder="Enter name"
          className="input"
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3 flex justify-between flex-col">
        <label>Email address</label>
        <input
          type="email"
          className="input"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3 flex justify-between flex-col">
        <label>Password</label>
        <input
          type="password"
          className="input"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="d-grid">
        <button
          type="submit"
          className="bg-[#212529] hover:bg-[#343a40] cursor-pointer text-[#f8f9fa] rounded-md py-1.5 px-1.5"
        >
          Sign Up
        </button>
      </div>
      <p className="forgot-password text-right">
        Already registered{" "}
        <Link href="/login" className="text-blue-400">
          Login
        </Link>
      </p>
    </form>
  );
}
export default Register;
