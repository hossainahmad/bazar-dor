"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "../components/ProductCard";

const PRODUCTS_API = "https://api.abcz.workers.dev/api/bazardor/products";
const CATEGORIES_API = "https://api.abcz.workers.dev/api/bazardor/categories";
const BENGALI_DIGITS = "০১২৩৪৫৬৭৮৯";

function getNumericPrice(product) {
  const price = product.today ?? product.price ?? 0;
  const normalizedPrice = String(price)
    .replace(/[০-৯]/g, (digit) => String(BENGALI_DIGITS.indexOf(digit)))
    .replace(/,/g, "")
    .replace(/[^\d.-]/g, "");

  const numericPrice = Number(normalizedPrice);
  return Number.isFinite(numericPrice) ? numericPrice : 0;
}

function ProductSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className="h-32 rounded-2xl border border-slate-100 bg-white/60 animate-pulse"
        />
      ))}
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    let cancelled = false;

    async function fetchPageData() {
      setLoading(true);
      const productsUrl = new URL(PRODUCTS_API);
      if (categoryParam && categoryParam !== "all") {
        productsUrl.searchParams.set("category", categoryParam);
      }

      const [productsResult, categoriesResult] = await Promise.allSettled([
        fetch(productsUrl).then((response) => {
          if (!response.ok) throw new Error("Failed to load products");
          return response.json();
        }),
        fetch(CATEGORIES_API).then((response) => {
          if (!response.ok) throw new Error("Failed to load categories");
          return response.json();
        }),
      ]);

      if (cancelled) return;

      if (productsResult.status === "fulfilled") {
        const data = productsResult.value;
        setProducts(Array.isArray(data) ? data : data.products || []);
      } else {
        console.error("Failed to load products:", productsResult.reason);
        setProducts([]);
      }

      if (categoriesResult.status === "fulfilled") {
        const data = categoriesResult.value;
        setCategories(Array.isArray(data) ? data : data.categories || []);
      } else {
        console.error("Failed to load categories:", categoriesResult.reason);
        setCategories([]);
      }

      setLoading(false);
    }

    fetchPageData();
    return () => {
      cancelled = true;
    };
  }, [categoryParam]);

  const isCategoryPage = Boolean(categoryParam && categoryParam !== "all");
  const selectedCategory = categories.find((category) =>
    [category.id, category.slug, category.category, category.nameBn].some(
      (identifier) =>
        identifier != null && String(identifier) === categoryParam,
    ),
  );
  const firstCategorizedProduct = products.find(
    (product) => product.categoryNameBn || product.categoryIcon,
  );
  const categoryTitle = isCategoryPage
    ? selectedCategory?.nameBn ||
      firstCategorizedProduct?.categoryNameBn ||
      "ক্যাটাগরি খুঁজে পাওয়া যায়নি"
    : "সব পণ্য";
  const categoryIcon = isCategoryPage
    ? selectedCategory?.icon || firstCategorizedProduct?.categoryIcon || "📦"
    : "🏷️";

  const filteredProducts = products.filter((product) =>
    (product.nameBn || product.name || "")
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase()),
  );
  const sortedProducts = filteredProducts.sort(
    (firstProduct, secondProduct) => {
      if (sortOrder === "price-asc") {
        return getNumericPrice(firstProduct) - getNumericPrice(secondProduct);
      }
      if (sortOrder === "price-desc") {
        return getNumericPrice(secondProduct) - getNumericPrice(firstProduct);
      }
      return 0;
    },
  );

  let emptyMessage = "কোনো পণ্য পাওয়া যায়নি";
  if (isCategoryPage && searchQuery.trim()) {
    emptyMessage = "এই খোঁজের সঙ্গে মেলে এমন পণ্য পাওয়া যায়নি";
  } else if (isCategoryPage && selectedCategory) {
    emptyMessage = "এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি";
  } else if (isCategoryPage) {
    emptyMessage = "ক্যাটাগরিটি খুঁজে পাওয়া যায়নি";
  } else if (searchQuery.trim()) {
    emptyMessage = "এই খোঁজের সঙ্গে মেলে এমন পণ্য পাওয়া যায়নি";
  }

  return (
    <main className="bg-[#f4f6f3] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="space-y-4 border-b border-slate-200/60 pb-4">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="w-12 h-12 shrink-0 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-2xl shadow-sm"
            >
              {categoryIcon}
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-slate-800 break-words">
                {categoryTitle}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {loading
                  ? "পণ্য লোড হচ্ছে..."
                  : `মোট ${filteredProducts.length}টি পণ্য দেখানো হচ্ছে`}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="relative w-full sm:max-w-sm">
              <label htmlFor="product-search" className="sr-only">
                পণ্য খুঁজুন
              </label>
              <input
                id="product-search"
                type="search"
                placeholder="পণ্য খুঁজুন..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span
                aria-hidden="true"
                className="absolute left-3 top-2.5 text-xs text-slate-400"
              >
                🔍
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="product-sort"
                className="shrink-0 text-xs font-semibold text-slate-600"
              >
                সাজান:
              </label>
              <div className="relative min-w-0 flex-1 sm:flex-none">
                <select
                  id="product-sort"
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:min-w-52"
                >
                  <option value="default">ডিফল্ট</option>
                  <option value="price-asc">দাম: কম থেকে বেশি</option>
                  <option value="price-desc">দাম: বেশি থেকে কম</option>
                </select>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 h-1.5 w-1.5 -translate-y-[70%] rotate-45 border-b-2 border-r-2 border-slate-500"
                />
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <ProductSkeletonGrid />
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 px-5 py-12 text-center shadow-sm">
            <span aria-hidden="true" className="text-4xl block mb-3">
              {isCategoryPage ? "📦" : "🔍"}
            </span>
            <h2 className="text-base font-bold text-slate-800">
              {emptyMessage}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              অন্য ক্যাটাগরি দেখুন অথবা হোম পেজে ফিরে যান।
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center mt-5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductSkeletonGrid />}>
      <ProductsContent />
    </Suspense>
  );
}
