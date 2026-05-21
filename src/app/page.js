import Banner from "@/Components/Banner";
import HomeSections from "@/Components/HomeSections";
import TopRatedDoctors from "@/Components/TopRatedDoctors";

export default function Home() {
  return (
    <div className="w-full">
      <Banner />
      <TopRatedDoctors />
      <HomeSections />
    </div>
  );
}
