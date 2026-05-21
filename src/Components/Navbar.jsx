import Link from "next/link";
import { FaUserDoctor } from "react-icons/fa6";

const Navbar = () => {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/appoinment", label: "Appointments" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" }

  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white">
            <FaUserDoctor className="text-xl" aria-hidden="true" />
          </span>
          <span className="text-2xl font-bold text-blue-600">MediCare</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
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
          className="hidden rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 sm:inline-flex"
        >
          Book Now
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
