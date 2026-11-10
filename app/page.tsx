import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Header } from "@/components/layout/Header";
import { Services } from "@/components/sections/Services";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        {/* Berikutnya: Skills, Projects, Experience. Tambahkan di sini, lalu ubah `ready` di lib/site.ts. */}
        <Services />
      </main>
      <Footer />
    </>
  );
}
