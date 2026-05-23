"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("error") === "github") {
      const timeoutId = window.setTimeout(() => {
        setError("GitHub login was cancelled or failed. Please try again.");
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, []);

  const getRedirectPath = () => {
    const params = new URLSearchParams(window.location.search);
    const redirectPath = params.get("redirect") || "/";

    return redirectPath.startsWith("/") && !redirectPath.startsWith("//")
      ? redirectPath
      : "/";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const saveSession = (user) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("auth-changed"));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const user = users.find(
      (item) =>
        item.email === formData.email && item.password === formData.password,
    );

    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    saveSession(user);
    setToast("Login successful!");
    router.push(getRedirectPath());
  };

  const handleGithubLogin = async () => {
    setError("");

    const statusResponse = await fetch("/api/auth/github-status");
    const status = await statusResponse.json();

    if (!status.configured) {
      setError(
        "GitHub login is not configured yet. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to .env, then restart the dev server.",
      );
      return;
    }

    const { error: githubError } = await authClient.signIn.social({
      provider: "github",
      callbackURL: getRedirectPath(),
      errorCallbackURL: "/login?error=github",
    });

    if (githubError) {
      setError(githubError.message || "GitHub login failed.");
    }
  };

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 bg-white dark:bg-slate-950/20 min-h-[85vh] transition-colors duration-300 flex items-center justify-center">
      {toast && (
        <div className="fixed right-4 top-4 z-[120] rounded-md bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}

      <div className="w-full max-w-md rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h1 className="text-center text-3xl font-bold text-slate-950 dark:text-blue-100">Login</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-100 px-3 py-3 text-sm outline-none transition focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-100 px-3 py-3 text-sm outline-none transition focus:border-blue-600"
            />
          </div>

          <div className="text-right">
            <Link href="#" className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Forgot Password
            </Link>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 dark:bg-red-950/20 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
          >
            Login
          </button>
        </form>

        <button
          type="button"
          onClick={handleGithubLogin}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-slate-950 dark:hover:border-slate-100 hover:text-slate-950 dark:hover:text-slate-100 cursor-pointer"
        >
          <FaGithub aria-hidden="true" />
          Continue with GitHub
        </button>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-blue-600 dark:text-blue-400">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
