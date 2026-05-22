"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUser, FaUserDoctor } from "react-icons/fa6";

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/appoinment", label: "Appointments" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  useEffect(() => {
    const loadUser = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const savedUser = localStorage.getItem("user");

      if (!isLoggedIn || !savedUser) {
        setUser(null);
        return;
      }

      setUser(JSON.parse(savedUser));
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    window.addEventListener("auth-changed", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("auth-changed", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("auth-changed"));
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white sm:h-11 sm:w-11">
              <FaUserDoctor className="text-lg sm:text-xl" aria-hidden="true" />
            </span>
            <span className="truncate text-xl font-bold text-blue-600 sm:text-2xl">
              NavidMediCare
            </span>
          </Link>

          <Link
            href="/appoinment"
            className="inline-flex shrink-0 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 sm:px-4 lg:hidden"
          >
            Book
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium text-slate-700 sm:gap-x-8 lg:justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-blue-600"
            >
              {link.label}
            </Link>
          ))}

          {!user && (
            <>
              <Link href="/login" className="transition hover:text-blue-600">
                Login
              </Link>
              <Link href="/register" className="transition hover:text-blue-600">
                Register
              </Link>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {user ? (
            <>
              <div className="flex min-w-0 items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name || user.email}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <FaUser aria-hidden="true" />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">
                    {user.name || "User"}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-500 hover:text-red-600"
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
