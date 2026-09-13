import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PK Multispeciality Hospital Salem — Digital Hospital Management System",
  description: "PK Multispeciality Hospital Salem — Advanced patient care with intelligent hospital operations, priority queue management, and real-time bed allocation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-cyan-500 selection:text-black">
        {children}
        {/* Compliance & Educational Prototype Notice Footer */}
        <footer className="w-full py-2 bg-slate-950/90 border-t border-slate-800/80 text-center text-[10px] text-slate-500 px-4">
          ⚠️ PK Multispeciality Hospital Salem — Digital Hospital Management System. For operational and demonstration use. Not a clinical diagnostic system.
        </footer>
      </body>
    </html>
  );
}