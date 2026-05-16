import Link from "next/link";
import { Button } from "../ui/button";

export default function Cta() {
  return (
    <div className="w-full py-10 bg-primary/5 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
          Semua Topik Kesehatan yang Anda Butuhkan di satu tempat
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-4 sm:px-8">
          Mulai dari Topik dengan Skill yang sangat penting hingga teknis, MyDoc Mendukung pengembangan pengetahuan Anda.
        </p>
        <Link href="/explore">
          <Button 
            size="lg" 
            className="font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
          >
            Daftar Sekarang
          </Button>
        </Link>
      </div>
    </div>
  );
}
