import {
  FaBell,
  FaCalendarDays,
  FaClipboardCheck,
  FaHeadset,
  FaShieldHeart,
  FaUserDoctor,
} from "react-icons/fa6";

const HomeSections = () => {
  const steps = [
    {
      title: "Choose a specialist",
      text: "Compare doctors by rating, department, experience, and schedule.",
      icon: FaUserDoctor,
    },
    {
      title: "Book a time",
      text: "Select an available appointment slot that fits your day.",
      icon: FaCalendarDays,
    },
    {
      title: "Manage visits",
      text: "Track patient queues, reminders, and updates from the dashboard.",
      icon: FaClipboardCheck,
    },
  ];

  const features = [
    { title: "Appointment reminders", icon: FaBell },
    { title: "Verified doctor profiles", icon: FaShieldHeart },
    { title: "Patient support", icon: FaHeadset },
  ];

  return (
    <>
      <section className="bg-white dark:bg-slate-950 px-4 py-16 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="mx-auto w-full max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-500">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 dark:text-slate-100 sm:text-4xl">
              Book care in three simple steps
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map(({ title, text, icon: Icon }) => (
              <div
                key={title}
                className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Icon className="text-xl" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-slate-950 dark:text-slate-100">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white dark:bg-slate-950/20 transition-colors duration-300">
        <div className="mx-auto grid w-full max-w-7xl gap-8 rounded-md bg-slate-950 dark:bg-slate-900 border dark:border-slate-800 p-6 text-white sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-300 dark:text-blue-400">
              Why Choose MediCare
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl text-white">
              A calmer way to manage healthcare appointments
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300 dark:text-slate-400">
              MediCare keeps booking, doctor discovery, and clinic coordination
              in one organized place for patients and care teams.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {features.map(({ title, icon: Icon }) => (
              <div key={title} className="rounded-md bg-white/10 dark:bg-slate-800/50 p-5">
                <Icon className="text-2xl text-blue-300" aria-hidden="true" />
                <p className="mt-4 text-sm font-semibold text-white">{title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeSections;
