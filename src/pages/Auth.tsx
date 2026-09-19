import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuthStore } from "../stores/useAuthStore";

type Mode = "login" | "register";

const Auth = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    onSuccess: () => navigate("/account"),
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.session) {
        navigate("/account");
      } else {
        setConfirmationMessage("Check your email to confirm your account, then log in.");
        setMode("login");
      }
    },
  });

  if (user) {
    return <Navigate to="/account" replace />;
  }

  const activeMutation = mode === "login" ? loginMutation : registerMutation;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setConfirmationMessage(null);

    if (!email.trim() || !password) {
      setFormError("Please enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (mode === "register") {
      if (password.length < 6) {
        setFormError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setFormError("Passwords do not match.");
        return;
      }
    }

    activeMutation.mutate();
  };

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setFormError(null);
    setConfirmationMessage(null);
  };

  return (
    <section className="mx-auto max-w-sm px-6 py-16">
      <div className="mb-8 flex border border-neutral-700">
        <button
          type="button"
          onClick={() => switchMode("login")}
          className={`flex-1 py-3 text-xs uppercase tracking-widest transition-colors ${
            mode === "login" ? "bg-white text-neutral-900" : "text-neutral-400 hover:text-white"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => switchMode("register")}
          className={`flex-1 py-3 text-xs uppercase tracking-widest transition-colors ${
            mode === "register" ? "bg-white text-neutral-900" : "text-neutral-400 hover:text-white"
          }`}
        >
          Register
        </button>
      </div>

      {confirmationMessage && (
        <p className="mb-6 text-sm text-neutral-300">{confirmationMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-xs uppercase tracking-widest text-neutral-400"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-white focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs uppercase tracking-widest text-neutral-400"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-white focus:outline-none"
          />
        </div>

        {mode === "register" && (
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-xs uppercase tracking-widest text-neutral-400"
            >
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-2 w-full border border-neutral-700 bg-neutral-800 px-4 py-2 text-white focus:border-white focus:outline-none"
            />
          </div>
        )}

        {formError && <p className="text-sm text-red-400">{formError}</p>}
        {activeMutation.isError && (
          <p className="text-sm text-red-400">
            {activeMutation.error instanceof Error
              ? activeMutation.error.message
              : "Something went wrong. Please try again."}
          </p>
        )}

        <button
          type="submit"
          disabled={activeMutation.isPending}
          className="w-full border border-white py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {activeMutation.isPending
            ? "Please wait…"
            : mode === "login"
              ? "Log in"
              : "Create account"}
        </button>
      </form>
    </section>
  );
};

export default Auth;
