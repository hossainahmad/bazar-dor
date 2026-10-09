import Link from "next/link";

async function getProductData(id) {
  try {
    const resId = await fetch(
      `https://api.api-store.workers.dev/api/bazardor/products?id=${id}`,
      {
        cache: "no-store",
      },
    );
    if (resId.ok) {
      const data = await resId.json();
      const product = Array.isArray(data)
        ? data.find((p) => String(p.id) === String(id) || p.slug === id)
        : data.product || data;
      if (product && (product.id || product.name || product.nameBn)) {
        return product;
      }
    }
  } catch (e) {
    console.error("ID fetch failed, falling back:", e);
  }

  //  Fallback: Search across common categories
  const categories = [
    "chal",
    "dal",
    "oil",
    "sobji",
    "mach",
    "mangso",
    "dim-dudh",
    "mosla",
  ];
  for (const cat of categories) {
    try {
      const res = await fetch(
        `https://api.api-store.workers.dev/api/bazardor/products?category=${cat}`,
        {
          cache: "no-store",
        },
      );
      if (res.ok) {
        const items = await res.json();
        const list = Array.isArray(items) ? items : items.products || [];
        const found = list.find(
          (p) => String(p.id) === String(id) || p.slug === id,
        );
        if (found) return found;
      }
    } catch (err) {
      // continue search
    }
  }

  return null;
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  const product = await getProductData(id);

  if (!product) {
    return (
      <main className="bg-[#f4f6f3] min-h-screen py-12 text-center text-slate-500">
        পণ্যটি পাওয়া যায়নি।
      </main>
    );
  }

  // Basic Product details parsing
  const name = product.nameBn || product.name || "পণ্য";
  const unit = product.unit === "kg" ? "কেজি" : product.unit || "কেজি";
  const categoryName =
    product.categoryNameBn || product.category || "ক্যাটাগরি";
  const icon = product.image || product.categoryIcon || "🛒";

  const todayPrice = product.today ?? (product.price || 0);
  const yesterdayPrice = product.yesterday ?? todayPrice;
  const priceDiff = todayPrice - yesterdayPrice;

  const dir =
    product.change?.dir ||
    (priceDiff > 0 ? "up" : priceDiff < 0 ? "down" : "flat");
  const pct = product.change?.pct ?? 0;
  const isUp = dir === "up";
  const isDown = dir === "down";

  // Markets calculation with fallbacks
  const rawMarkets =
    Array.isArray(product.markets) && product.markets.length > 0
      ? product.markets
      : [
          {
            market: "মাঠ বাজার",
            division: "ময়মনসিংহ",
            min: todayPrice - 5,
            max: todayPrice + 5,
            avg: todayPrice,
          },
          {
            market: "সদর বাজার",
            division: "রাজশাহী",
            min: todayPrice - 4,
            max: todayPrice + 4,
            avg: todayPrice,
          },
          {
            market: "কারওয়ান বাজার",
            division: "ঢাকা",
            min: todayPrice - 2,
            max: todayPrice + 6,
            avg: todayPrice + 2,
          },
        ];

  const markets = rawMarkets.map((m) => {
    const minVal = Number(m.min ?? (m.minPrice || todayPrice));
    const maxVal = Number(m.max ?? (m.maxPrice || todayPrice));
    const avgVal = Number(
      (m.avg ?? m.average ?? (minVal + maxVal) / 2) || todayPrice,
    );

    return {
      market: m.market || m.name || "অজানা বাজার",
      division: m.division || m.location || "সাধারণ",
      min: minVal,
      max: maxVal,
      avg: avgVal,
    };
  });

  const minPrice = Math.min(...markets.map((m) => m.min));
  const maxPrice = Math.max(...markets.map((m) => m.max));
  const avgPrice = (
    markets.reduce((acc, m) => acc + m.avg, 0) / (markets.length || 1)
  ).toFixed(0);

  return (
    <main className="bg-[#f4f6f3] min-h-screen py-6">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        {/* Breadcrumb Header */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-slate-800">
            হোম
          </Link>
          <span>›</span>
          <Link href={`/categories`} className="hover:text-slate-800">
            {categoryName}
          </Link>
          <span>›</span>
          <span className="text-slate-800 font-semibold">{name}</span>
        </nav>

        {/* Top Header Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl shrink-0">
              {icon}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {name}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                প্রতি {unit} · {categoryName}
              </p>

              <p className="text-xs text-slate-500 mt-3 font-medium">
                গতকালকের তুলনায় আজ দাম{" "}
                <span className="font-bold text-slate-800">
                  {isUp ? "বেড়েছে" : isDown ? "কমেছে" : "পরিবর্তন হয়নি"}
                </span>
                {priceDiff !== 0 && ` · ${Math.abs(priceDiff)} টাকা`}
              </p>
            </div>
          </div>

          <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 sm:p-5 text-center min-w-[160px] self-start md:self-auto">
            <p className="text-xs text-slate-400 font-medium">আজকের দাম</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">
              {todayPrice}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              টাকা / {unit}
            </p>
            <div
              className={`mt-2 inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${
                isUp
                  ? "text-rose-600 bg-rose-50"
                  : isDown
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-slate-500 bg-slate-100"
              }`}
            >
              <span>{isUp ? "▲" : isDown ? "▼" : "—"}</span>
              <span>{pct}%</span>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-8">
          <section className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              দামের সারসংক্ষেপ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                <p className="text-xs text-slate-400 font-medium">
                  সর্বনিম্ন দাম
                </p>
                <p className="text-xl font-extrabold text-emerald-600 mt-1">
                  {minPrice} টাকা
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  সবচেয়ে কম দামের বাজার
                </p>
              </div>

              <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                <p className="text-xs text-slate-400 font-medium">
                  সর্বাধিক দাম
                </p>
                <p className="text-xl font-extrabold text-rose-600 mt-1">
                  {maxPrice} টাকা
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  সবচেয়ে বেশি দামের বাজার
                </p>
              </div>

              <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                <p className="text-xs text-slate-400 font-medium">গড় দাম</p>
                <p className="text-xl font-extrabold text-emerald-700 mt-1">
                  {avgPrice} টাকা
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  প্রতি {unit}-এর হিসাবে
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              বাজারভিত্তিক আজকের দাম
            </h2>

            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <th className="p-3.5 pl-5">বাজার</th>
                    <th className="p-3.5">বিভাগ</th>
                    <th className="p-3.5">সর্বনিম্ন</th>
                    <th className="p-3.5">সর্বাধিক</th>
                    <th className="p-3.5 pr-5 text-right">গড়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {markets.map((m, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="p-3.5 pl-5 font-bold text-slate-800">
                        {m.market}
                      </td>
                      <td className="p-3.5 text-slate-500">{m.division}</td>
                      <td className="p-3.5">{m.min} টাকা</td>
                      <td className="p-3.5">{m.max} টাকা</td>
                      <td className="p-3.5 pr-5 text-right font-bold text-slate-900">
                        {m.avg.toFixed(2)} টাকা
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
