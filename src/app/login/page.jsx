"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const getRedirectPath = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("redirect") || "/";
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

  const handleGithubLogin = () => {
    saveSession({
      name: "GitHub User",
      email: "github.user@example.com",
      photoURL: "",
      provider: "github",
    });
    setToast("GitHub login successful!");
    router.push(getRedirectPath());
  };

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      {toast && (
        <div className="fixed right-4 top-4 z-[120] rounded-md bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}

      <div className="mx-auto w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-center text-3xl font-bold text-slate-950">Login</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-600"
            />
          </div>

          <div className="text-right">
            <Link href="#" className="text-sm font-medium text-blue-600">
              Forgot Password
            </Link>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <button
          type="button"
          onClick={handleGithubLogin}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
        >
          <FaGithub aria-hidden="true" />
          Continue with GitHub
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-blue-600">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
