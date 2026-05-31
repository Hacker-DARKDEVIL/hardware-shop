import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Ticker } from "@/components/sections/Ticker";
import { Categories } from "@/components/sections/Categories";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { NewsletterCta } from "@/components/sections/NewsletterCta";
import { Footer } from "@/components/sections/Footer";
import { CartDrawer } from "@/components/ui/CartDrawer";

export default function Home() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main>
        <Hero />
        <Ticker />
        <Categories />
        <FeaturedProducts />
        <ComparisonTable />
        <NewsletterCta />
      </main>
      <Footer />
    </>
  );
}
