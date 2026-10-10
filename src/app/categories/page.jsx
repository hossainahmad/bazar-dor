// src/app/categories/page.jsx
import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";

async function getCategories() {
  try {
    const res = await fetch(
      "https://api.api-store.workers.dev/api/bazardor/categories",
      {
        cache: "no-store",
      },
    );
    const data = await res.json();
    return Array.isArray(data) ? data : data.categories || [];
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    return [];
  }
}

function CategoriesSkeleton() {
  return (
    <main className="bg-[#f4f6f3] min-h-screen pb-16 pt-6">
      <div className="max-w-6xl mx-auto px-4 space-y-6" role="status">
        <div className="h-28 rounded-3xl border border-slate-100 bg-white animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="h-36 rounded-2xl border border-slate-100 bg-white animate-pulse"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

async function CategoriesContent() {
  await connection();
  const categories = await getCategories();

  return (
    <main className="bg-[#f4f6f3] min-h-screen pb-16 pt-6">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              সকল ক্যাটাগরি
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              পণ্যের ধরন অনুযায়ী ক্যাটাগরি নির্বাচন করে আজকের বাজার দর দেখুন
            </p>
          </div>
          <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full font-semibold self-start sm:self-auto">
            মোট ক্যাটাগরি: {categories.length}টি
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const slug = cat.slug || cat.id;
            const name = cat.nameBn || cat.name || cat.title;
            const icon = cat.icon || cat.emoji || "🛒";
            const count = cat.productCount || cat.count;

            return (
              <Link
                key={cat.id || slug}
                href={`/products?category=${slug}`}
                className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 group-hover:bg-emerald-50 group-hover:scale-105 transition-all flex items-center justify-center text-3xl mb-3 shrink-0">
                  {icon}
                </div>

                <h3 className="font-bold text-slate-800 group-hover:text-emerald-700 text-sm transition-colors leading-snug">
                  {name}
                </h3>

                {count !== undefined && (
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">
                    {count} টি পণ্য
                  </p>
                )}
              </Link>
            );
          })}
        </div>
        {categories.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
            <p className="text-slate-400 text-sm">কোনো ক্যাটাগরি পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<CategoriesSkeleton />}>
      <CategoriesContent />
    </Suspense>
  );
}
