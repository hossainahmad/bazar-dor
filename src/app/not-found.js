import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] bg-[#f4f6f3] px-4 py-16 flex items-center justify-center">
      <section className="w-full max-w-lg rounded-2xl border border-slate-100 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
        <p className="text-sm font-bold text-emerald-700">404</p>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-800">
          পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          এই ঠিকানায় কোনো পৃষ্ঠা নেই বা এটি সরিয়ে ফেলা হয়েছে।
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          হোম পেজে ফিরে যান
        </Link>
      </section>
    </main>
  );
}
