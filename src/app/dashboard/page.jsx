import DashboardClient from "@/Components/DashboardClient";

export const metadata = {
  title: "Dashboard | NavidMediCare",
  description:
    "Manage your NavidMediCare appointments, booking updates, cancellations, and patient profile information.",
};

const DashboardPage = () => {
  return <DashboardClient />;
};

export default DashboardPage;
