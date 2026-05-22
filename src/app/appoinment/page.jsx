"use client";

import { useRouter } from "next/navigation";
import {
  FaCalendarCheck,
  FaClock,
  FaLocationDot,
  FaStar,
  FaUserDoctor,
} from "react-icons/fa6";
import { doctors } from "@/data/doctors";

const AppointmentPage = () => {
  const router = useRouter();

  const handleViewDetails = (doctorId) => {
    const isLoggedIn =
      localStorage.getItem("isLoggedIn") === "true" ||
      Boolean(localStorage.getItem("user"));

    if (isLoggedIn) {
      router.push(`/doctors/${doctorId}`);
      return;
    }

    router.push(`/login?redirect=/doctors/${doctorId}`);
  };

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Available Appointments
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
              Choose your next doctor visit
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Browse all available appointments and open a doctor profile before
              confirming your schedule.
            </p>
          </div>

          <div className="rounded-md border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            {doctors.length} appointments available
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {doctors.map((doctor) => (
            <article
              key={doctor.id}
              className="flex h-full flex-col rounded-md border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <FaUserDoctor className="text-2xl" aria-hidden="true" />
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-600">
                  <FaStar aria-hidden="true" />
                  {doctor.rating}
                </span>
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-950">
                {doctor.name}
              </h2>
              <p className="mt-1 font-medium text-blue-600">
                {doctor.specialty}
              </p>

              <div className="mt-5 grid gap-3 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <FaCalendarCheck
                    className="text-blue-600"
                    aria-hidden="true"
                  />
                  {doctor.availability[0]}
                </p>
                <p className="flex items-center gap-2">
                  <FaClock className="text-blue-600" aria-hidden="true" />
                  {doctor.experience} experience
                </p>
                <p className="flex items-center gap-2">
                  <FaLocationDot
                    className="text-blue-600"
                    aria-hidden="true"
                  />
                  {doctor.location}
                </p>
              </div>

              <div className="mt-5 rounded-md bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Consultation Fee</p>
                <p className="mt-1 text-2xl font-bold text-slate-950">
                  BDT {doctor.fee}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleViewDetails(doctor.id)}
                className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                View Details
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppointmentPage;
