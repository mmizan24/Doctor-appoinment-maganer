"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react"; // Added useEffect
import {
  FaCalendarCheck,
  FaClock,
  FaLocationDot,
  FaMagnifyingGlass,
  FaStar,
  FaUserDoctor,
} from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";

const getExperienceYears = (exp) => {
  if (!exp) return 0;
  const matched = exp.match(/\d+/);
  return matched ? parseInt(matched[0], 10) : 0;
};

const AppointmentPage = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // 1. Replaced static import with dynamic state
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // 2. Fetch the MongoDB data on client component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/doctors");
        const data = await res.json();
        if (Array.isArray(data)) {
          setDoctors(data);
        }
      } catch (error) {
        console.error("Error fetching doctors from MongoDB:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const visibleDoctors = useMemo(() => {
    // Add optional chaining check safely in case data loading lags
    const filteredDoctors = doctors.filter((doctor) =>
      doctor.name?.toLowerCase().includes(searchText.trim().toLowerCase()),
    );

    return [...filteredDoctors].sort((firstDoctor, secondDoctor) => {
      if (sortBy === "rating") return secondDoctor.rating - firstDoctor.rating;
      if (sortBy === "fee-low") return firstDoctor.fee - secondDoctor.fee;
      if (sortBy === "fee-high") return secondDoctor.fee - firstDoctor.fee;
      if (sortBy === "name-asc") return firstDoctor.name.localeCompare(secondDoctor.name);
      if (sortBy === "name-desc") return secondDoctor.name.localeCompare(firstDoctor.name);
      if (sortBy === "experience-high") return getExperienceYears(secondDoctor.experience) - getExperienceYears(firstDoctor.experience);
      if (sortBy === "experience-low") return getExperienceYears(firstDoctor.experience) - getExperienceYears(secondDoctor.experience);
      return 0;
    });
  }, [doctors, searchText, sortBy]);

  const handleViewDetails = (doctorId) => {
    if (session?.user) {
      router.push(`/doctors/${doctorId}`);
      return;
    }
    router.push(`/login?redirect=/doctors/${doctorId}`);
  };

  // 3. Simple Loading state guard
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-500">
        Loading appointments from database...
      </div>
    );
  }

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto w-full max-w-7xl">

        {/* Top Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-500">
              Available Appointments
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-slate-100 sm:text-4xl">
              Choose your next doctor visit
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-100">
              Browse all available appointments and open a doctor profile before
              confirming your schedule.
            </p>
          </div>

          <div className="rounded-md border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20 px-4 py-3 text-sm font-semibold text-blue-700 dark:text-blue-400">
            {visibleDoctors.length} appointments available
          </div>
        </div>

        {/* Filters and Search controls */}
        <div className="mt-8 grid gap-4 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm md:grid-cols-[1fr_auto]">
          <label className="relative block">
            <FaMagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search by doctor name"
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-100 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-600"
            />
          </label>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none transition focus:border-blue-600 cursor-pointer"
          >
            <option value="default">Default sort</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="rating">Highest rating</option>
            <option value="experience-high">Most Experience</option>
            <option value="experience-low">Least Experience</option>
            <option value="fee-low">Lowest fee</option>
            <option value="fee-high">Highest fee</option>
          </select>
        </div>

        {/* Doctors Grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visibleDoctors.map((doctor) => (
            <article
              key={doctor.id}
              className="flex h-full flex-col rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-400/40"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <FaUserDoctor className="text-2xl" aria-hidden="true" />
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/20 px-3 py-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
                  <FaStar aria-hidden="true" />
                  {doctor.rating}
                </span>
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-blue-100">
                {doctor.name}
              </h2>
              <p className="mt-1 font-medium text-blue-600 dark:text-blue-400">
                {doctor.specialty}
              </p>

              <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
                <p className="flex items-center gap-2">
                  <FaCalendarCheck
                    className="text-blue-600 dark:text-blue-500"
                    aria-hidden="true"
                  />
                  {doctor.availability?.[0] || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <FaClock className="text-blue-600 dark:text-blue-500" aria-hidden="true" />
                  {doctor.experience} experience
                </p>
                <p className="flex items-center gap-2">
                  <FaLocationDot
                    className="text-blue-600 dark:text-blue-500"
                    aria-hidden="true"
                  />
                  {doctor.location}
                </p>
              </div>

              <div className="mt-5 rounded-md bg-slate-50 dark:bg-slate-800/40 p-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">Consultation Fee</p>
                <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-blue-100">
                  BDT {doctor.fee}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleViewDetails(doctor.id)}
                className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
              >
                View Details
              </button>
            </article>
          ))}
        </div>

        {/* Fallback empty view */}
        {!visibleDoctors.length && (
          <div className="mt-10 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">
              No appointments found
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Try searching with another doctor name.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AppointmentPage;