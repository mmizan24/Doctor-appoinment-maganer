import Link from "next/link";
import { FaFacebookF, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";

const Footer = () => {
  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/appoinment", label: "Appointments" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
  ];

  const socialLinks = [
    { href: "#", label: "Facebook", icon: FaFacebookF },
    { href: "#", label: "Instagram", icon: FaInstagram },
    { href: "#", label: "Twitter", icon: FaTwitter },
    { href: "#", label: "GitHub", icon: FaGithub },
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-[1.2fr_1fr_1fr] lg:items-start">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white sm:h-11 sm:w-11">
              <FaUserDoctor className="text-xl" aria-hidden="true" />
            </span>
            <span className="text-xl font-bold sm:text-2xl">MediCare</span>
          </Link>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-300 sm:mx-0">
            Simple appointment management for patients, doctors, and clinic
            teams.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
            Quick Links
          </h2>
          <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm text-slate-300 sm:flex-col sm:justify-start">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit transition hover:text-blue-400"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
            Follow Us
          </h2>
          <div className="mt-4 flex items-center justify-center gap-4 text-lg sm:justify-start">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-300 transition hover:bg-blue-600 hover:text-white"
              >
                <Icon aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 w-full max-w-7xl border-t border-slate-800 pt-6 text-center text-sm text-slate-400">
        &copy; 2026 MediCare. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
