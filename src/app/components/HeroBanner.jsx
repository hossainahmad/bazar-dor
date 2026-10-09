import Image from "next/image";
import Link from "next/link";

export default function HeroBanner() {
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });
  return (
    <section className="max-w-6xl mx-auto bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 my-6">
      <div className="space-y-4 max-w-xl text-left">
        <div className="inline-block bg-emerald-50 text-emerald-700 text-xs px-3 py-2 rounded-full font-medium">
          {date}
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight leading-snug">
          আজকের বাজারের দাম এক নজরে
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
          বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
        </p>

        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow active:scale-95"
          >
            সব পণ্য দেখুন
          </Link>
        </div>
      </div>

      <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 flex-shrink-0">
        <Image
          src="/bazar-hero.png"
          alt="বাজারের ফলের ঝুড়ি"
          fill
          priority
          className="object-contain"
        />
      </div>
    </section>
  );
}
