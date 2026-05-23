import { notFound } from "next/navigation";
import {
  FaGraduationCap,
  FaHospital,
  FaLanguage,
  FaLocationDot,
  FaStar,
  FaUserDoctor,
} from "react-icons/fa6";
import BookAppointmentModal from "@/Components/BookAppointmentModal";
import { doctors } from "@/data/doctors";
import clientPromise from "@/lib/mongodb";

const DoctorDetailsPage = async ({ params }) => {
  const { id } = await params;
  const doctor = doctors.find((item) => item.id === id);

  if (!doctor) {
    notFound();
  }

  // 1. Fetch live reviews from MongoDB
  let reviews = [];
  try {
    if (clientPromise) {
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB || "doctor_manager");
      const fetchedReviews = await db
        .collection("reviews")
        .find({ doctorId: id })
        .sort({ createdAt: -1 })
        .toArray();
      
      reviews = fetchedReviews.map((r) => ({
        ...r,
        _id: r._id.toString(),
        createdAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }) : "Recently",
      }));
    }
  } catch (error) {
    console.error("Failed to fetch reviews from MongoDB:", error);
  }

  // 2. Compute dynamic rating averages
  const hasReviews = reviews.length > 0;
  const reviewCount = reviews.length;
  const avgRating = hasReviews
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
    : doctor.rating;

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          
          {/* Left Details Sidebar */}
          <aside className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm self-start">
            <div
              className="flex aspect-[4/3] items-center justify-center rounded-md bg-cover bg-center text-blue-600"
              style={{
                backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.08), rgba(37, 99, 235, 0.08)), url(${doctor.image})`,
              }}
            >
              <span className="sr-only">{doctor.name}</span>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-500">
                Doctor Details
              </p>
              <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-slate-100">
                {doctor.name}
              </h1>
              <p className="mt-2 text-lg font-medium text-blue-600 dark:text-blue-400">
                {doctor.specialty}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-slate-50 dark:bg-slate-800/40 p-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Rating</p>
                <p className="mt-1 flex items-center gap-1 font-bold text-slate-950 dark:text-slate-100">
                  <FaStar className="text-amber-500 animate-pulse" aria-hidden="true" />
                  {avgRating} <span className="text-xs font-normal text-slate-400">({reviewCount})</span>
                </p>
              </div>
              <div className="rounded-md bg-slate-50 dark:bg-slate-800/40 p-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Patients</p>
                <p className="mt-1 font-bold text-slate-950 dark:text-slate-100">
                  {doctor.patients}
                </p>
              </div>
              <div className="rounded-md bg-slate-50 dark:bg-slate-800/40 p-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Experience</p>
                <p className="mt-1 font-bold text-slate-950 dark:text-slate-100">
                  {doctor.experience}
                </p>
              </div>
              <div className="rounded-md bg-slate-50 dark:bg-slate-800/40 p-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Fee</p>
                <p className="mt-1 font-bold text-slate-950 dark:text-slate-100">
                  BDT {doctor.fee}
                </p>
              </div>
            </div>
          </aside>

          {/* Right Info Section */}
          <div className="space-y-6">
            
            {/* About Card */}
            <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">
                About {doctor.name}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {doctor.description}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex gap-3 rounded-md bg-slate-50 dark:bg-slate-800/30 p-4">
                  <FaHospital
                    className="mt-1 shrink-0 text-blue-600 dark:text-blue-500"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Hospital</p>
                    <p className="mt-1 font-semibold text-slate-950 dark:text-slate-200">
                      {doctor.hospital}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-md bg-slate-50 dark:bg-slate-800/30 p-4">
                  <FaLocationDot
                    className="mt-1 shrink-0 text-blue-600 dark:text-blue-500"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Location</p>
                    <p className="mt-1 font-semibold text-slate-950 dark:text-slate-200">
                      {doctor.location}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-md bg-slate-50 dark:bg-slate-800/30 p-4">
                  <FaGraduationCap
                    className="mt-1 shrink-0 text-blue-600 dark:text-blue-500"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Education</p>
                    <p className="mt-1 font-semibold text-slate-950 dark:text-slate-200">
                      {doctor.education}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-md bg-slate-50 dark:bg-slate-800/30 p-4">
                  <FaLanguage
                    className="mt-1 shrink-0 text-blue-600 dark:text-blue-500"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Languages</p>
                    <p className="mt-1 font-semibold text-slate-950 dark:text-slate-200">
                      {doctor.languages.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Slots / Booking Card */}
            <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">
                    Available Slots
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Choose a time slot and book your appointment.
                  </p>
                </div>
                <BookAppointmentModal doctor={doctor} />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {doctor.availability.map((slot) => (
                  <div
                    key={slot}
                    className="flex items-center gap-3 rounded-md border border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-950/20 p-4 text-sm font-semibold text-blue-700 dark:text-blue-300"
                  >
                    <FaUserDoctor aria-hidden="true" />
                    {slot}
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Reviews Card */}
            <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">
                Patient Reviews ({reviewCount})
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Read experiences of patients who successfully finished appointments.
              </p>

              <div className="mt-6 space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div
                      key={review._id}
                      className="border-b border-slate-100 dark:border-slate-800/60 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {review.userPhoto ? (
                            <img
                              src={review.userPhoto}
                              alt={review.userName}
                              className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                              {review.userName.charAt(0).toUpperCase()}
                            </span>
                          )}
                          <div>
                            <h3 className="text-sm font-bold text-slate-950 dark:text-slate-200">
                              {review.userName}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {review.createdAt}
                            </p>
                          </div>
                        </div>
                        
                        {/* Rating stars */}
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`text-sm ${
                                star <= review.rating
                                  ? "text-amber-500"
                                  : "text-slate-200 dark:text-slate-700"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-950/20 rounded-md p-3">
                        {review.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-500 dark:text-slate-400">
                    <p className="text-sm font-medium">No reviews yet for Dr. {doctor.name}.</p>
                    <p className="text-xs text-slate-400 mt-1">Be the first to review after booking!</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorDetailsPage;
