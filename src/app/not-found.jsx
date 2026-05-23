import Link from "next/link";
import { FaHouse, FaStethoscope } from "react-icons/fa6";

export const metadata = {
  title: "Page Not Found",
  description:
    "The requested NavidMediCare page could not be found. Return home or browse available appointments.",
};

const NotFoundPage = () => {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl rounded-md border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl text-blue-600">
          <FaStethoscope aria-hidden="true" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-blue-600">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
          This page is off the schedule
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-600">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <FaHouse aria-hidden="true" />
            Back Home
          </Link>
          <Link
            href="/appoinment"
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
          >
            Browse Appointments
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
