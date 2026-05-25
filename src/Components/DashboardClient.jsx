"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaCalendarCheck,
  FaPen,
  FaSpinner,
  FaTrash,
  FaUser,
  FaXmark,
  FaStar,
  FaRegStar,
} from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";
import { apiUrl } from "@/lib/api";

const bookingFields = [
  "patientName",
  "gender",
  "phone",
  "appointmentDate",
  "appointmentTime",
];

const DashboardClient = () => {
  const router = useRouter();
  const {
    data: session,
    isPending: isSessionPending,
    refetch: refetchSession,
  } = authClient.useSession();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [dbDoctors, setDbDoctors] = useState([]); // Dynamically store doctors from MongoDB
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  // Sorting state
  const [sortBy, setSortBy] = useState("date-asc");

  // Review states
  const [reviewingBooking, setReviewingBooking] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [isSavingReview, setIsSavingReview] = useState(false);

  const [editingBooking, setEditingBooking] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    patientName: "",
    gender: "Male",
    phone: "",
    appointmentDate: "",
    appointmentTime: "",
  });
  const [isSavingBooking, setIsSavingBooking] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    photoURL: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };

  // Memoized sorted bookings
  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      if (sortBy === "date-asc") {
        return new Date(a.appointmentDate) - new Date(b.appointmentDate);
      }
      if (sortBy === "date-desc") {
        return new Date(b.appointmentDate) - new Date(a.appointmentDate);
      }
      if (sortBy === "created-desc") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === "created-asc") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sortBy === "doctor-name") {
        return (a.doctorName || "").localeCompare(b.doctorName || "");
      }
      if (sortBy === "fee-high") {
        return (b.fee || 0) - (a.fee || 0);
      }
      if (sortBy === "fee-low") {
        return (a.fee || 0) - (b.fee || 0);
      }
      return 0;
    });
  }, [bookings, sortBy]);

  useEffect(() => {
    if (isSessionPending) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (!session?.user) {
        setUser(null);
        setAuthChecked(true);
        return;
      }

      const authUser = {
        name: session.user.name || "",
        email: session.user.email || "",
        photoURL: session.user.image || "",
      };

      setUser(authUser);
      setProfileForm({
        name: authUser.name,
        photoURL: authUser.photoURL,
      });
      setAuthChecked(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isSessionPending, session]);

  useEffect(() => {
    if (authChecked && !isSessionPending && !user) {
      router.replace("/login?redirect=/dashboard");
    }
  }, [authChecked, isSessionPending, router, user]);

  // Synchronized parallel database load sequence
  useEffect(() => {
    if (!user?.email) {
      return;
    }

    const loadDashboardData = async () => {
      setIsLoadingBookings(true);
      setError("");

      try {
        // Fetch both appointments and actual doctors from the database parallelly
        const [appRes, docRes] = await Promise.all([
          fetch(apiUrl("/appointments")),
          fetch("/api/doctors")
        ]);

        const appResult = await appRes.json();
        let docResult = [];
        if (docRes.ok) {
          docResult = await docRes.json();
        }

        if (!appRes.ok) {
          throw new Error(appResult.message || "Failed to load bookings.");
        }

        setBookings(appResult.appointments || []);
        setDbDoctors(Array.isArray(docResult) ? docResult : []);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    loadDashboardData();
  }, [user?.email]);

  const stats = useMemo(
    () => ({
      total: bookings.length,
      doctors: new Set(bookings.map((booking) => booking.doctorName)).size,
    }),
    [bookings],
  );

  const openBookingEditor = (booking) => {
    setEditingBooking(booking);
    setBookingForm({
      patientName: booking.patientName || "",
      gender: booking.gender || "Male",
      phone: booking.phone || "",
      appointmentDate: booking.appointmentDate || "",
      appointmentTime: booking.appointmentTime || "",
    });
  };

  const handleBookingChange = (event) => {
    const { name, value } = event.target;
    setBookingForm((current) => ({ ...current, [name]: value }));
  };

  const handleBookingUpdate = async (event) => {
    event.preventDefault();

    if (!editingBooking || !user?.email) {
      return;
    }

    setIsSavingBooking(true);
    setError("");

    try {
      const response = await fetch(apiUrl(`/appointments/${editingBooking._id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingForm,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update appointment.");
      }

      setBookings((current) =>
        current.map((booking) =>
          booking._id === editingBooking._id ? result.appointment : booking,
        ),
      );
      setEditingBooking(null);
      showToast("Appointment updated successfully!");
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setIsSavingBooking(false);
    }
  };

  const handleBookingDelete = async (bookingId) => {
    if (!user?.email) {
      return;
    }

    setError("");

    try {
      const response = await fetch(apiUrl(`/appointments/${bookingId}`), {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete appointment.");
      }

      setBookings((current) =>
        current.filter((booking) => booking._id !== bookingId),
      );
      showToast("Appointment deleted successfully!");
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();

    setIsSavingProfile(true);
    setError("");

    const { error: updateError } = await authClient.updateUser({
      name: profileForm.name,
      image: profileForm.photoURL || null,
    });

    setIsSavingProfile(false);

    if (updateError) {
      setError(updateError.message || "Failed to update profile.");
      return;
    }

    await refetchSession?.();
    setUser((current) => ({
      ...current,
      name: profileForm.name,
      photoURL: profileForm.photoURL,
    }));
    setIsProfileOpen(false);
    showToast("Profile updated successfully!");
  };

  const openReviewModal = (booking) => {
    setError("");
    setReviewingBooking(booking);
    setReviewForm({ rating: 5, comment: "" });
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!reviewingBooking || !user) return;

    const comment = reviewForm.comment.trim();

    if (!comment) {
      setError("Please write a review before submitting.");
      return;
    }

    setIsSavingReview(true);
    setError("");

    // Safe lookup against dynamic database records
    const matchedDoctor = dbDoctors.find(
      (doctor) =>
        (doctor.name || "").toLowerCase() ===
        (reviewingBooking.doctorName || "").trim().toLowerCase(),
    );

    // Fallback safely to booking properties or matched dynamic id
    const doctorId = reviewingBooking.doctorId || matchedDoctor?.id || matchedDoctor?._id || "d1";

    try {
      const response = await fetch(apiUrl("/reviews"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: reviewingBooking._id,
          doctorId,
          doctorName: reviewingBooking.doctorName,
          rating: reviewForm.rating,
          comment,
          userName: user.name || "Anonymous",
          userPhoto: user.photoURL || "",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit review.");
      }

      setBookings((current) =>
        current.map((booking) =>
          booking._id === reviewingBooking._id
            ? { ...booking, reviewId: result.review?._id, reviewed: true }
            : booking,
        ),
      );
      setReviewingBooking(null);
      setReviewForm({ rating: 5, comment: "" });
      showToast("Review submitted successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSavingReview(false);
    }
  };

  if (!authChecked || isSessionPending || !user) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
      </section>
    );
  }

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 transition-colors duration-300">
      {toast && (
        <div className="fixed right-4 top-4 z-[130] rounded-md bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}

      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-500">
              Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-blue-100 sm:text-4xl">
              Welcome back, {user?.name || "Patient"}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-blue-600 dark:text-slate-400">
              Manage your booked appointments and profile details from one
              organized workspace.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:w-auto">
            <div className="rounded-md border border-blue-100 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-950/20 px-5 py-4">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-400">Bookings</p>
              <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-blue-100">
                {stats.total}
              </p>
            </div>
            <div className="rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-5 py-4">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Doctors</p>
              <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-blue-100">
                {stats.doctors}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${activeTab === "bookings"
                ? "bg-blue-600 text-white"
                : "border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600"
              }`}
          >
            My Bookings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${activeTab === "profile"
                ? "bg-blue-600 text-white"
                : "border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600"
              }`}
          >
            My Profile
          </button>
        </div>

        {error && (
          <p className="mt-6 rounded-md bg-red-50 dark:bg-red-950/20 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {activeTab === "bookings" && (
          <div className="mt-8">
            {isLoadingBookings ? (
              <div className="flex min-h-56 items-center justify-center rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <FaSpinner className="animate-spin text-3xl text-blue-600" />
              </div>
            ) : bookings.length ? (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
                  <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100">
                    Your Booked Appointments
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none transition focus:border-blue-600"
                    >
                      <option value="date-asc">Date (Nearest first)</option>
                      <option value="date-desc">Date (Furthest first)</option>
                      <option value="created-desc">Booking Date (Newest first)</option>
                      <option value="created-asc">Booking Date (Oldest first)</option>
                      <option value="doctor-name">Doctor Name (A-Z)</option>
                      <option value="fee-high">Fee (Highest first)</option>
                      <option value="fee-low">Fee (Lowest first)</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  {sortedBookings.map((booking) => (
                    <article
                      key={booking._id}
                      className="flex h-full flex-col rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-blue-600 dark:text-blue-500">
                            {booking.specialty || "Medical Appointment"}
                          </p>
                          <h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-blue-100">
                            {booking.doctorName}
                          </h2>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            {booking.hospital}
                          </p>
                        </div>
                        <span className="inline-flex w-fit items-center gap-2 rounded-md bg-blue-50 dark:bg-blue-950/40 px-3 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                          <FaCalendarCheck aria-hidden="true" />
                          {booking.appointmentDate}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                        <p>
                          <span className="font-semibold text-slate-950 dark:text-slate-200">
                            Patient:
                          </span>{" "}
                          {booking.patientName}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-950 dark:text-slate-200">
                            Time:
                          </span>{" "}
                          {booking.appointmentTime}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-950 dark:text-slate-200">
                            Phone:
                          </span>{" "}
                          {booking.phone}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-950 dark:text-slate-200">
                            Fee:
                          </span>{" "}
                          BDT {booking.fee}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => openBookingEditor(booking)}
                          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
                        >
                          <FaPen aria-hidden="true" />
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => openReviewModal(booking)}
                          className="inline-flex items-center gap-2 rounded-md border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 px-4 py-2 text-sm font-semibold text-amber-700 dark:text-amber-400 transition hover:bg-amber-100 dark:hover:bg-amber-950/45 cursor-pointer"
                        >
                          <FaStar aria-hidden="true" className="text-amber-500" />
                          Add Review
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBookingDelete(booking._id)}
                          className="inline-flex items-center gap-2 rounded-md border border-red-200 dark:border-red-900/60 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 transition hover:bg-red-50 dark:hover:bg-red-950/10 cursor-pointer"
                        >
                          <FaTrash aria-hidden="true" />
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100">
                  No bookings yet
                </h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  Book a doctor appointment and it will appear here instantly.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="mt-8 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name || user.email}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/40 text-2xl text-blue-600 dark:text-blue-400">
                    <FaUser aria-hidden="true" />
                  </span>
                )}
                <div className="min-w-0">
                  <h2 className="truncate text-2xl font-bold text-slate-950 dark:text-blue-100">
                    {user?.name || "Patient"}
                  </h2>
                  <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-400">
                    {user?.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsProfileOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
              >
                <FaPen aria-hidden="true" />
                Update Profile
              </button>
            </div>
          </div>
        )}
      </div>

      {editingBooking && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-slate-950/60 px-4 py-6">
          <div className="w-full max-w-2xl rounded-md bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-500">
                  Update Appointment
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-blue-100">
                  {editingBooking.doctorName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingBooking(null)}
                aria-label="Close update modal"
                className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                <FaXmark aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleBookingUpdate} className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  User Email
                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="mt-2 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 px-3 py-3 text-sm text-slate-500 dark:text-slate-400 outline-none"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Doctor
                  <input
                    type="text"
                    value={editingBooking.doctorName || ""}
                    readOnly
                    className="mt-2 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 px-3 py-3 text-sm text-slate-500 dark:text-slate-400 outline-none"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Patient Name
                  <input
                    type="text"
                    name="patientName"
                    value={bookingForm.patientName}
                    onChange={handleBookingChange}
                    required
                    className="mt-2 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-100 px-3 py-3 text-sm outline-none transition focus:border-blue-600"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Gender
                  <select
                    name="gender"
                    value={bookingForm.gender}
                    onChange={handleBookingChange}
                    className="mt-2 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-100 px-3 py-3 text-sm outline-none transition focus:border-blue-600"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {bookingFields.slice(2).map((field) => (
                  <label
                    key={field}
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    {field === "phone"
                      ? "Phone"
                      : field === "appointmentDate"
                        ? "Appointment Date"
                        : "Appointment Time"}
                    <input
                      type={
                        field === "appointmentDate"
                          ? "date"
                          : field === "phone"
                            ? "tel"
                            : "text"
                      }
                      name={field}
                      value={bookingForm[field]}
                      onChange={handleBookingChange}
                      required
                      className="mt-2 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-100 px-3 py-3 text-sm outline-none transition focus:border-blue-600"
                    />
                  </label>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSavingBooking}
                className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 cursor-pointer"
              >
                {isSavingBooking ? "Saving..." : "Save Appointment"}
              </button>
            </form>
          </div>
        </div>
      )}

      {isProfileOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-slate-950/60 px-4 py-6">
          <div className="w-full max-w-lg rounded-md bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-500">
                  My Profile
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-slate-100">
                  Update Profile
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                aria-label="Close profile modal"
                className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                <FaXmark aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleProfileUpdate} className="mt-6 grid gap-4">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Name
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  required
                  className="mt-2 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-100 px-3 py-3 text-sm outline-none transition focus:border-blue-600"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email Address
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="mt-2 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 px-3 py-3 text-sm text-slate-500 dark:text-slate-400 outline-none"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Photo URL
                <input
                  type="url"
                  name="photoURL"
                  value={profileForm.photoURL}
                  onChange={handleProfileChange}
                  className="mt-2 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-100 px-3 py-3 text-sm outline-none transition focus:border-blue-600"
                />
              </label>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 cursor-pointer"
              >
                {isSavingProfile ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>
        </div>
      )}

      {reviewingBooking && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-slate-950/60 px-4 py-6">
          <div className="w-full max-w-lg rounded-md bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-500">
                  Rate & Review Doctor
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-slate-100">
                  {reviewingBooking.doctorName}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {reviewingBooking.specialty || "Medical Specialist"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReviewingBooking(null);
                  setError("");
                }}
                aria-label="Close review modal"
                className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                <FaXmark aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="mt-6 grid gap-6">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Select Rating
                </label>
                <div className="mt-3 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key = { star }
                      type = "button"
                      onClick = {() => setReviewForm((curr) => ({...curr, rating: star }))}
                  className="text-3xl transition duration-150 hover:scale-110 active:scale-95 cursor-pointer"
                    >
                  {star <= reviewForm.rating ? (
                    <FaStar className="text-amber-500" />
                  ) : (
                    <FaRegStar className="text-slate-300 dark:text-slate-600" />
                  )}
                </button>
                  ))}
              </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Your Review
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((curr) => ({ ...curr, comment: e.target.value }))}
                required
                rows={4}
                placeholder="Share your experience with this doctor..."
                className="mt-2 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-100 p-3 text-sm outline-none transition focus:border-blue-600"
              />
            </label>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 dark:bg-red-950/20 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSavingReview}
            className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 cursor-pointer"
          >
            {isSavingReview ? "Saving..." : "Submit Review"}
          </button>
        </form>
          </div>
        </div >
      )}
    </section >
  );
};

export default DashboardClient;