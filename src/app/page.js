import HeroBanner from "./components/HeroBanner";
import ProductCard from "./components/ProductCard";

async function getHomeProducts() {
  try {
    const res = await fetch(
      "https://api.api-store.workers.dev/api/bazardor/products",
      {
        cache: "no-store",
      },
    );
    const data = await res.json();
    return Array.isArray(data) ? data : data.products || [];
  } catch (err) {
    console.error("Failed to fetch home products:", err);
    return [];
  }
}

export default async function HomePage() {
  const products = await getHomeProducts();

  const priceUpProducts = products.filter(
    (p) => p.change?.dir === "up" || p.changeType === "up" || p.change > 0,
  );

  const priceDownProducts = products.filter(
    (p) => p.change?.dir === "down" || p.changeType === "down" || p.change < 0,
  );

  return (
    <main className="bg-[#f4f6f3] min-h-screen pb-12">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Banner Section */}
        <HeroBanner />

        {/* Section: Price Increased */}
        {priceUpProducts.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-lg">
              <span>▲</span>
              <h2>আজ দাম বেড়েছে</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {priceUpProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Section: Price Decreased */}
        {priceDownProducts.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
              <span>▼</span>
              <h2>আজ দাম কমেছে</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {priceDownProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
