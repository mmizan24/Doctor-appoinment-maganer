"use client";

import Link from "next/link";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Banner = () => {
  const slides = [
    {
      title: "Book trusted doctors without the waiting-room stress.",
      subtitle:
        "Find high-rated specialists, compare available slots, and book appointments in minutes.",
      tag: "Doctor Appointment Manager",
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80",
    },
    {
      title: "Manage every clinic visit from one clear dashboard.",
      subtitle:
        "Track schedules, patient queues, and appointment updates with a calm, organized workflow.",
      tag: "Smart Clinic Scheduling",
      image:
        "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1400&q=80",
    },
    {
      title: "Connect patients with the right specialist faster.",
      subtitle:
        "Support better care decisions with verified doctors, ratings, and transparent availability.",
      tag: "Patient First Care",
      image:
        "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1400&q=80",
    },
  ];

  return (
    <section className="bg-white dark:bg-slate-950/20 px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="mx-auto w-full max-w-7xl">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          loop
          speed={900}
          slidesPerView={1}
          className="banner-swiper"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.title}>
              <div
                className="relative flex min-h-[520px] items-center overflow-hidden rounded-md bg-slate-900 px-5 py-14 sm:min-h-[600px] sm:px-10 lg:px-14"
                style={{
                  backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.62), rgba(15, 23, 42, 0.2)), url(${slide.image})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                <div className="relative z-10 max-w-2xl text-white">
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
                    {slide.tag}
                  </p>
                  <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-7 text-slate-100 sm:text-lg">
                    {slide.subtitle}
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/appoinment"
                      className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Book Appointment
                    </Link>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center rounded-md border border-white/70 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-slate-950"
                    >
                      View Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Banner;
