"use client";

import { useRouter } from "next/navigation";
import { FaLocationDot, FaStar, FaUserDoctor } from "react-icons/fa6";
import { doctors } from "@/data/doctors";

const TopRatedDoctors = () => {
  const router = useRouter();
  const topDoctors = [...doctors]
    .sort((first, second) => second.rating - first.rating)
    .slice(0, 3);

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
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Top Rated Doctors
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            Meet doctors patients trust most
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Browse highly rated specialists and view their full profile before
            booking an appointment.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {topDoctors.map((doctor) => (
            <article
              key={doctor.id}
              className="rounded-md border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
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

              <h3 className="mt-5 text-xl font-bold text-slate-950">
                {doctor.name}
              </h3>
              <p className="mt-1 font-medium text-blue-600">
                {doctor.specialty}
              </p>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>{doctor.experience} experience</p>
                <p className="flex items-center gap-2">
                  <FaLocationDot className="text-blue-600" aria-hidden="true" />
                  {doctor.location}
                </p>
                <p>
                  Fee: <span className="font-semibold">{doctor.fee}</span>
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

export default TopRatedDoctors;
