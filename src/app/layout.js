import { Suspense } from "react";
import { Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "sonner";

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["latin", "bengali"],
});

export const metadata = {
  title: " বাজার দর - Bazar-Dor",
  description: "বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${notoSerifBengali.className} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <Toaster position="top-right" richColors />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
