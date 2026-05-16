import Cta from "@/components/shared/cta";
import Footer from "@/components/shared/footer";
import Hero from "@/components/shared/hero";
import Navbar from "@/components/shared/navbar";
import ProductTabs from "@/components/shared/product-tabs";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const banners = await prisma.banner.findMany({
    where: {
      status: "ACTIVE"
    }
  });
  return (
    <div className="mt-16">
      <Navbar />
      <Hero banners={banners} />
      <Cta />
      <ProductTabs />
      <Footer />
    </div>
  );
}
