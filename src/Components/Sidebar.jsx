"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FaCalendarCheck,
  FaChartLine,
  FaChevronLeft,
  FaChevronRight,
  FaHouse,
  FaRightToBracket,
  FaUserPlus,
} from "react-icons/fa6";

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", icon: FaHouse },
    { href: "/appoinment", label: "Appointments", icon: FaCalendarCheck },
    { href: "/dashboard", label: "Dashboard", icon: FaChartLine },
    { href: "/login", label: "Login", icon: FaRightToBracket },
    { href: "/register", label: "Register", icon: FaUserPlus },
  ];

  return (
    <aside
      className={`sticky top-[136px] z-40 h-[calc(100vh-136px)] shrink-0 border-r border-slate-200 bg-white shadow-sm transition-all duration-300 sm:top-[120px] sm:h-[calc(100vh-120px)] lg:top-[81px] lg:h-[calc(100vh-81px)] ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-3 py-5">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="mb-5 flex h-10 w-10 items-center justify-center self-end rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
        >
          {isOpen ? (
            <FaChevronLeft aria-hidden="true" />
          ) : (
            <FaChevronRight aria-hidden="true" />
          )}
        </button>

        <nav className="flex flex-1 flex-col gap-2">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                title={!isOpen ? label : undefined}
                className={`flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                } ${isOpen ? "justify-start" : "justify-center"}`}
              >
                <Icon className="shrink-0 text-base" aria-hidden="true" />
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                    isOpen ? "w-36 opacity-100" : "w-0 opacity-0"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div
          className={`rounded-md bg-slate-50 p-3 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Clinic Status
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-950">
            8 patients waiting
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
