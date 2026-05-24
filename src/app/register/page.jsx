"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("error") === "github") {
      const timeoutId = window.setTimeout(() => {
        setError("GitHub signup was cancelled or failed. Please try again.");
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, []);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least 1 uppercase letter.";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain at least 1 lowercase letter.";
    }

    return "";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const passwordError = validatePassword(formData.password);

    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsSubmitting(true);

    const { error: signupError } = await authClient.signUp.email({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      image: formData.photoURL,
      callbackURL: "/dashboard",
    });

    setIsSubmitting(false);

    if (signupError) {
      setError(signupError.message || "Registration failed.");
      return;
    }

    router.push("/dashboard");
  };

  const handleGithubSignup = async () => {
    setError("");

    const statusResponse = await fetch("/api/auth/github-status");
    const status = await statusResponse.json();

    if (!status.configured) {
      setError(
        "GitHub signup is not configured yet. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to .env, then restart the dev server.",
      );
      return;
    }

    const { error: githubError } = await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
      errorCallbackURL: "/register?error=github",
    });

    if (githubError) {
      setError(githubError.message || "GitHub signup failed.");
    }
  };

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 bg-white dark:bg-slate-950/20 min-h-[85vh] transition-colors duration-300 flex items-center justify-center">
      <div className="w-full max-w-md rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h1 className="text-center text-3xl font-bold text-slate-950 dark:text-blue-100">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-100 px-3 py-3 text-sm outline-none transition focus:border-blue-600"
            />
          </div>

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
              Photo URL
            </label>
            <input
              type="url"
              name="photoURL"
              value={formData.photoURL}
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

          {error && (
            <p className="rounded-md bg-red-50 dark:bg-red-950/20 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 cursor-pointer"
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleGithubSignup}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-slate-950 dark:hover:border-slate-100 hover:text-slate-950 dark:hover:text-slate-100 cursor-pointer"
        >
          <FaGithub aria-hidden="true" />
          Continue with GitHub
        </button>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-600 dark:text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
