import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { EyeIcon } from "../components/icons";
import { useSeo } from "../hooks/useSeo";
import { supabase } from "../lib/supabaseClient";
import { useAuthStore } from "../stores/useAuthStore";

type Mode = "login" | "register";

interface LocationState {
  from?: string;
}

const Auth = () => {
  useSeo({
    title: "Log in or register | JME Forge Shop",
    description: "Log in or create an account to buy from JME Forge Shop.",
    noindex: true,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const returnTo = (location.state as LocationState | null)?.from ?? "/account";

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    onSuccess: () => navigate(returnTo),
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.session) {
        navigate(returnTo);
      } else {
        setConfirmationMessage("Check your email to confirm your account, then log in.");
        setMode("login");
      }
    },
  });

  if (user) {
    return <Navigate to={returnTo} replace />;
  }

  const activeMutation = mode === "login" ? loginMutation : registerMutation;
  const isLogin = mode === "login";

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

  const tabClasses = (tabMode: Mode) =>
    `flex-1 rounded-xs py-3 text-[0.7rem] font-semibold tracking-[0.2em] uppercase transition-colors ${
      mode === tabMode ? "bg-ember text-canvas" : "text-muted hover:text-fg"
    }`;

  return (
    <section className="container-page flex justify-center py-16 sm:py-24">
      <div className="w-full max-w-md">
        <div className="text-center">
          <img
            src="/images/logo.png"
            alt=""
            width={321}
            height={310}
            className="mx-auto h-20 w-auto"
          />
          <h1 className="mt-6 font-display text-4xl font-medium text-fg">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-3 text-sm text-muted">
            {isLogin
              ? "Log in to buy from the forge and track your orders."
              : "Register to buy from the forge and track your orders."}
          </p>
        </div>

        <div className="card mt-10 p-6 sm:p-8">
          <div className="flex rounded-xs border border-line p-0.5">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={tabClasses("login")}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={tabClasses("register")}
            >
              Register
            </button>
          </div>

          {confirmationMessage && <p className="alert-info mt-6">{confirmationMessage}</p>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="input mt-2"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((shown) => !shown)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-subtle transition-colors hover:text-fg"
                >
                  <EyeIcon className="h-5 w-5" crossed={showPassword} />
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label htmlFor="confirm-password" className="label">
                  Confirm password
                </label>
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="input mt-2"
                />
              </div>
            )}

            {formError && <p className="alert-error">{formError}</p>}
            {activeMutation.isError && (
              <p className="alert-error">
                {activeMutation.error instanceof Error
                  ? activeMutation.error.message
                  : "Something went wrong. Please try again."}
              </p>
            )}

            <button
              type="submit"
              disabled={activeMutation.isPending}
              className="btn btn-primary w-full py-4"
            >
              {activeMutation.isPending ? "Please wait…" : isLogin ? "Log in" : "Create account"}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          <Link to="/products" className="link-underline">
            Continue browsing
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Auth;
