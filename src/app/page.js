// src/app/page.js
import { Suspense } from "react";
import HeroBanner from "./components/HeroBanner";
import ProductCard from "./components/ProductCard";

// Helper function to fetch products across categories
async function getAllProducts() {
  const categories = [
    "chal",
    "dal",
    "tel",
    "sobji",
    "mach",
    "mangsho",
    "dim-dui",
    "mosla",
  ];
  let allProducts = [];

  try {
    const fetchPromises = categories.map((cat) =>
      fetch(
        `https://api.api-store.workers.dev/api/bazardor/products?category=${cat}`,
        {
          cache: "no-store",
        },
      )
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => (Array.isArray(data) ? data : data.products || []))
        .catch(() => []),
    );

    const results = await Promise.all(fetchPromises);
    allProducts = results.flat();
  } catch (err) {
    console.error("Error fetching home page products:", err);
  }

  // Deduplicate products by id
  const uniqueProducts = Array.from(
    new Map(allProducts.map((item) => [item.id || item.slug, item])).values(),
  );

  return uniqueProducts;
}

// Convert numbers to Bengali digits (e.g. 148 -> ১৪৮)
function toBengaliNumerals(num) {
  if (num === undefined || num === null || isNaN(num)) return "০";
  const digitsMap = {
    0: "০",
    1: "১",
    2: "২",
    3: "৩",
    4: "৪",
    5: "৫",
    6: "৬",
    7: "৭",
    8: "৮",
    9: "৯",
  };
  return Number(num)
    .toLocaleString("en-US")
    .replace(/[0-9]/g, (digit) => digitsMap[digit]);
}

function HomePageSkeleton() {
  return (
    <main className="bg-[#f4f6f3] min-h-screen pb-16 pt-4">
      <div
        role="status"
        aria-label="পণ্য লোড হচ্ছে"
        className="max-w-6xl mx-auto px-4 space-y-10"
      >
        <div className="h-80 rounded-3xl border border-slate-100 bg-white animate-pulse" />
        {["risers", "fallers", "products"].map((section) => (
          <section key={section} className="space-y-4">
            <div className="h-7 w-48 rounded bg-slate-200 animate-pulse" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 rounded-2xl border border-slate-100 bg-white animate-pulse"
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageContent />
    </Suspense>
  );
}

async function HomePageContent() {
  const products = await getAllProducts();

  // Filter top 6 risers
  const risers = products
    .filter(
      (p) =>
        (p.change?.dir || p.changeType) === "up" || (p.change?.pct ?? 0) > 0,
    )
    .sort((a, b) => (b.change?.pct ?? 0) - (a.change?.pct ?? 0))
    .slice(0, 6);

  // Filter top 6 fallers
  const fallers = products
    .filter(
      (p) =>
        (p.change?.dir || p.changeType) === "down" || (p.change?.pct ?? 0) < 0,
    )
    .sort((a, b) => Math.abs(b.change?.pct ?? 0) - Math.abs(a.change?.pct ?? 0))
    .slice(0, 6);

  return (
    <main className="bg-[#f4f6f3] min-h-screen pb-16 pt-4 space-y-8">
      <div className="max-w-6xl mx-auto px-4 space-y-10">
        {/* Hero Banner Component */}
        <Suspense fallback={null}>
          <HeroBanner />
        </Suspense>

        {/* আজ দাম বেড়েছে */}
        {risers.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-rose-600 text-lg">▲</span>
              <h2 className="text-xl font-extrabold text-slate-800">
                আজ দাম বেড়েছে
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {risers.map((product) => (
                <ProductCard
                  key={product.id || product.slug}
                  product={product}
                />
              ))}
            </div>
          </section>
        )}

        {/* আজ দাম কমেছে */}
        {fallers.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 text-lg">▼</span>
              <h2 className="text-xl font-extrabold text-slate-800">
                আজ দাম কমেছে
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {fallers.map((product) => (
                <ProductCard
                  key={product.id || product.slug}
                  product={product}
                />
              ))}
            </div>
          </section>
        )}

        {/*All Products*/}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800">
                সব পণ্য
              </h2>
              <p className="text-[15px] text-slate-500 mt-0.5">
                মোট {toBengaliNumerals(products.length)} টি পণ্য দেখানো হচ্ছে
              </p>
            </div>
          </div>

          {/*Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id || product.slug} product={product} />
            ))}
          </div>

          {/* Fallback Empty State */}
          {products.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-sm font-medium">
                কোনো পণ্যের তথ্য পাওয়া যায়নি
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
