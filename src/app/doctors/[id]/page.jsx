import { notFound } from "next/navigation";
import { doctors } from "@/data/doctors";

const DoctorDetailsPage = async ({ params }) => {
  const { id } = await params;
  const doctor = doctors.find((item) => item.id === id);

  if (!doctor) {
    notFound();
  }

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Doctor Details
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          {doctor.name}
        </h1>
        <p className="mt-2 text-lg font-medium text-blue-600">
          {doctor.specialty}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-md bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Rating</p>
            <p className="mt-1 font-semibold text-slate-950">
              {doctor.rating} / 5
            </p>
          </div>
          <div className="rounded-md bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Experience</p>
            <p className="mt-1 font-semibold text-slate-950">
              {doctor.experience}
            </p>
          </div>
          <div className="rounded-md bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Consultation Fee</p>
            <p className="mt-1 font-semibold text-slate-950">{doctor.fee}</p>
          </div>
          <div className="rounded-md bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Available Slot</p>
            <p className="mt-1 font-semibold text-slate-950">
              {doctor.availability}
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm leading-6 text-slate-600">
          Location: {doctor.location}
        </p>
      </div>
    </section>
  );
};

export default DoctorDetailsPage;
