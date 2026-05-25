"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { FaLocationDot, FaStar, FaUserDoctor } from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";

const TopRatedDoctors = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // Handle dynamic data stream states
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the active database list from your api endpoint
  useEffect(() => {
    const fetchTopDoctors = async () => {
      try {
        const res = await fetch("/api/doctors");
        if (!res.ok) throw new Error("Failed to pull live doctor datasets");
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setDoctors(data);
        }
      } catch (error) {
        console.error("Error retrieving records from MongoDB API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopDoctors();
  }, []);

  // Compute sorting dynamically on the fly to isolate the top 3 items
  const topDoctors = useMemo(() => {
    return [...doctors]
      .sort((first, second) => (second.rating || 0) - (first.rating || 0))
      .slice(0, 3);
  }, [doctors]);

  const handleViewDetails = (doctorId) => {
    if (session?.user) {
      router.push(`/doctors/${doctorId}`);
      return;
    }

    router.push(`/login?redirect=/doctors/${doctorId}`);
  };

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-500">
            Top Rated Doctors
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950 dark:text-slate-100 sm:text-4xl">
            Meet doctors patients trust most
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
            Browse highly rated specialists and view their full profile before
            booking an appointment.
          </p>
        </div>

        {/* Loading State Wrapper */}
        {loading ? (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[1, 2, 3].map((skeletonId) => (
              <div 
                key={skeletonId} 
                className="animate-pulse rounded-md border border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/60 p-5 h-72"
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {topDoctors.map((doctor) => (
              <article
                key={doctor.id}
                className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:border-blue-500/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                    <FaUserDoctor className="text-2xl" aria-hidden="true" />
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/20 px-3 py-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
                    <FaStar aria-hidden="true" />
                    {doctor.rating}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-950 dark:text-slate-100">
                  {doctor.name}
                </h3>
                <p className="mt-1 font-medium text-blue-600 dark:text-blue-400">
                  {doctor.specialty}
                </p>

                <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <p>{doctor.experience} experience</p>
                  <p className="flex items-center gap-2">
                    <FaLocationDot className="text-blue-600 dark:text-blue-500" aria-hidden="true" />
                    {doctor.location}
                  </p>
                  <p>
                    Fee:{" "}
                    <span className="font-semibold text-slate-950 dark:text-slate-200">BDT {doctor.fee}</span>
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
        )}

        {/* Fallback Empty State Handler */}
        {!loading && topDoctors.length === 0 && (
          <div className="mt-10 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No profile cards found</h3>
            <p className="text-sm text-slate-500 mt-1">Please verify database collection contents.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopRatedDoctors;