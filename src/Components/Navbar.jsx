"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { FaUser, FaUserDoctor, FaSun, FaMoon } from "react-icons/fa6";
import { useTheme } from "@/Components/ThemeProvider";
import { authClient } from "@/lib/auth-client";

const Navbar = () => {
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const { data: session } = authClient.useSession();
  const user = useMemo(() => {
    if (!session?.user) {
      return null;
    }

    return {
      name: session.user.name || "",
      email: session.user.email || "",
      photoURL: session.user.image || "",
    };
  }, [session]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/appoinment", label: "Appointments" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/95">
      <nav className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white sm:h-11 sm:w-11">
              <FaUserDoctor className="text-lg sm:text-xl" aria-hidden="true" />
            </span>
            <span className="truncate text-xl font-bold text-blue-600 sm:text-2xl dark:text-blue-500">
              NavidMediCare
            </span>
          </Link>

          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-600 transition duration-300 hover:bg-slate-100 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <FaSun className="hidden text-lg text-amber-500 dark:block" />
              <FaMoon className="text-lg dark:hidden" />
            </button>
            <Link
              href="/appoinment"
              className="inline-flex shrink-0 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 sm:px-4"
            >
              Book
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium text-slate-700 sm:gap-x-8 lg:justify-center dark:text-slate-300">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-blue-600 dark:hover:text-blue-400"
            >
              {link.label}
            </Link>
          ))}

          {!user && (
            <>
              <Link href="/login" className="transition hover:text-blue-600 dark:hover:text-blue-400">
                Login
              </Link>
              <Link href="/register" className="transition hover:text-blue-600 dark:hover:text-blue-400">
                Register
              </Link>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Theme Toggle for Desktop */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="hidden h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-600 transition-all duration-300 hover:scale-105 hover:bg-slate-100 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 lg:inline-flex"
          >
            <FaSun className="hidden animate-pulse text-lg text-amber-500 dark:block" />
            <FaMoon className="text-lg dark:hidden" />
          </button>

          {user ? (
            <>
              <div className="flex min-w-0 items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/40">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name || user.email}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                    <FaUser aria-hidden="true" />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-100">
                    {user.name || "User"}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-500 hover:text-red-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-red-500 dark:hover:text-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/appoinment"
              className="hidden rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 lg:inline-flex"
            >
              Book Now
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
