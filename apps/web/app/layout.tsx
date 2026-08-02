import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "زوفادري — نبني مشروعك البرمجي",
  description: "زوفادري: فريق برمجي مصري بينفذلك مواقع، متاجر إلكترونية، تطبيقات موبايل، وبوتات واتساب وتيليجرام — من الفكرة للتسليم.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Header />
        <main className="z-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
