"use client";

import { useMemo, useState } from "react";
import { FaCalendarCheck, FaXmark } from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";
import { apiUrl } from "@/lib/api";

const BookAppointmentModal = ({ doctor }) => {
  const { data: session } = authClient.useSession();
  const firstSlot = doctor.availability[0];
  const defaultTime = useMemo(() => firstSlot.split(" - ")[0], [firstSlot]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    userEmail: "",
    patientName: "",
    gender: "Male",
    phone: "",
    appointmentDate: "",
    appointmentTime: defaultTime,
  });

  const openBookingModal = () => {
    const email = session?.user?.email || "";

    setFormData((current) => ({
      ...current,
      userEmail: email || current.userEmail,
    }));
    setIsOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setToast("");
    setIsSubmitting(true);

    try {
      const bookingData = { ...formData };
      delete bookingData.userEmail;

      const response = await fetch(apiUrl("/appointments"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingData,
          doctorId: doctor.id,
          doctorName: doctor.name,
          specialty: doctor.specialty,
          hospital: doctor.hospital,
          fee: doctor.fee,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to book appointment.");
      }

      setToast("Appointment booked successfully!");
      setIsOpen(false);
      setFormData({
        userEmail: formData.userEmail,
        patientName: "",
        gender: "Male",
        phone: "",
        appointmentDate: "",
        appointmentTime: defaultTime,
      });
    } catch (bookingError) {
      setError(bookingError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {toast && (
        <div className="fixed right-4 top-4 z-[120] rounded-md bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}

      <button
        type="button"
        onClick={openBookingModal}
        className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto cursor-pointer"
      >
        Book Appointment
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 px-4 py-6">
          <div className="w-full max-w-2xl rounded-md bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-500">
                  Appointment Booking
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-slate-100">
                  {doctor.name}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {doctor.specialty} at {doctor.hospital}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close booking modal"
                className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <FaXmark aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    User Email
                  </label>
                  <input
                    type="email"
                    name="userEmail"
                    value={formData.userEmail}
                    readOnly
                    required
                    placeholder="user@gmail.com"
                    className="mt-2 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 px-3 py-3 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                    placeholder="Rahim Uddin"
                    className="mt-2 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-100 px-3 py-3 text-sm outline-none transition focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-100 px-3 py-3 text-sm outline-none transition focus:border-blue-600 cursor-pointer"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="01712345678"
                    className="mt-2 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-100 px-3 py-3 text-sm outline-none transition focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-100 px-3 py-3 text-sm outline-none transition focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Appointment Time
                  </label>
                  <select
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-100 px-3 py-3 text-sm outline-none transition focus:border-blue-600 cursor-pointer"
                  >
                    {doctor.availability.map((slot) => (
                      <option key={slot} value={slot.split(" - ")[0]}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-md bg-slate-50 dark:bg-slate-800/40 p-4 text-sm text-slate-600 dark:text-slate-300 border dark:border-slate-800">
                <p>
                  Fee:{" "}
                  <span className="font-semibold text-slate-950 dark:text-slate-100">
                    BDT {doctor.fee}
                  </span>
                </p>
                <p className="mt-2">Location: {doctor.location}</p>
              </div>

              {error && (
                <p className="rounded-md bg-red-50 dark:bg-red-950/20 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 cursor-pointer"
              >
                <FaCalendarCheck aria-hidden="true" />
                {isSubmitting ? "Saving..." : "Submit Booking"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BookAppointmentModal;
