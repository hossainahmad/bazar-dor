"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "../components/ProductCard";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let url = "https://api.api-store.workers.dev/api/bazardor/products";
        if (categoryParam && categoryParam !== "all") {
          url = `https://api.api-store.workers.dev/api/bazardor/products?category=${categoryParam}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [categoryParam]);

  const filteredProducts = products.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main className="bg-[#f4f6f3] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Page Title & Count Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">সব পণ্য</h1>
            <p className="text-xs text-slate-500 mt-1">
              মোট {filteredProducts.length}টি পণ্য দেখানো হচ্ছে
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="পণ্য খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="absolute left-3 top-2.5 text-xs text-slate-400">
              🔍
            </span>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-white/60 animate-pulse rounded-2xl border border-slate-100"
              />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 bg-white rounded-2xl border border-slate-100">
            <span className="text-4xl block mb-2">🔍</span>
            <p className="text-sm">কোনো পণ্য পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">লোড হচ্ছে...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
