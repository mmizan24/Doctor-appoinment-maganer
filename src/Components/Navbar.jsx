import Link from "next/link";
import { FaUserDoctor } from "react-icons/fa6";

const Navbar = () => {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/appoinment", label: "Appointments" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white sm:h-11 sm:w-11">
              <FaUserDoctor className="text-lg sm:text-xl" aria-hidden="true" />
            </span>
            <span className="truncate text-xl font-bold text-blue-600 sm:text-2xl">
              MediCare
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
        </div>

        <Link
          href="/appoinment"
          className="hidden rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 lg:inline-flex"
        >
          Book Now
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
