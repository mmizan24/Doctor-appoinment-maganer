import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import Sidebar from "@/Components/Sidebar";
import { ThemeProvider } from "@/Components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "NavidMediCare | Doctor Appointment Manager",
    template: "%s | NavidMediCare",
  },
  description:
    "Book trusted doctors, manage appointments, and update your patient profile through NavidMediCare.",
  keywords: [
    "doctor appointment",
    "healthcare booking",
    "patient dashboard",
    "NavidMediCare",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <Navbar />
          <div className="mx-auto flex w-full max-w-7xl flex-1">
            <Sidebar />
            <main className="min-w-0 flex-1">
              <div className="mx-auto w-full max-w-7xl">{children}</div>
            </main>
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
