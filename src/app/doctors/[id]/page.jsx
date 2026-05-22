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

const DoctorDetailsPage = async ({ params }) => {
  const { id } = await params;
  const doctor = doctors.find((item) => item.id === id);

  if (!doctor) {
    notFound();
  }

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
            <div
              className="flex aspect-[4/3] items-center justify-center rounded-md bg-cover bg-center text-blue-600"
              style={{
                backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.08), rgba(37, 99, 235, 0.08)), url(${doctor.image})`,
              }}
            >
              <span className="sr-only">{doctor.name}</span>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Doctor Details
              </p>
              <h1 className="mt-3 text-3xl font-bold text-slate-950">
                {doctor.name}
              </h1>
              <p className="mt-2 text-lg font-medium text-blue-600">
                {doctor.specialty}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Rating</p>
                <p className="mt-1 flex items-center gap-1 font-semibold text-slate-950">
                  <FaStar className="text-amber-500" aria-hidden="true" />
                  {doctor.rating}
                </p>
              </div>
              <div className="rounded-md bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Patients</p>
                <p className="mt-1 font-semibold text-slate-950">
                  {doctor.patients}
                </p>
              </div>
              <div className="rounded-md bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Experience</p>
                <p className="mt-1 font-semibold text-slate-950">
                  {doctor.experience}
                </p>
              </div>
              <div className="rounded-md bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Fee</p>
                <p className="mt-1 font-semibold text-slate-950">
                  BDT {doctor.fee}
                </p>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950">
                About {doctor.name}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {doctor.description}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex gap-3 rounded-md bg-slate-50 p-4">
                  <FaHospital
                    className="mt-1 shrink-0 text-blue-600"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm text-slate-500">Hospital</p>
                    <p className="mt-1 font-semibold text-slate-950">
                      {doctor.hospital}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-md bg-slate-50 p-4">
                  <FaLocationDot
                    className="mt-1 shrink-0 text-blue-600"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="mt-1 font-semibold text-slate-950">
                      {doctor.location}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-md bg-slate-50 p-4">
                  <FaGraduationCap
                    className="mt-1 shrink-0 text-blue-600"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm text-slate-500">Education</p>
                    <p className="mt-1 font-semibold text-slate-950">
                      {doctor.education}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-md bg-slate-50 p-4">
                  <FaLanguage
                    className="mt-1 shrink-0 text-blue-600"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm text-slate-500">Languages</p>
                    <p className="mt-1 font-semibold text-slate-950">
                      {doctor.languages.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-950">
                    Available Slots
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Choose a time slot and book your appointment.
                  </p>
                </div>
                <BookAppointmentModal doctor={doctor} />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {doctor.availability.map((slot) => (
                  <div
                    key={slot}
                    className="flex items-center gap-3 rounded-md border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-700"
                  >
                    <FaUserDoctor aria-hidden="true" />
                    {slot}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorDetailsPage;
