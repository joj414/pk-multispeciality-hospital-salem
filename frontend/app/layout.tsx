import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartCare Flow — 3D Digital Hospital Operations Platform",
  description: "Intelligent Hospital Operations. Faster Decisions. Better Patient Flow. Interactive 3D WebGL Digital Twin and Priority Patient Scheduling.",
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
          ⚠️ SmartCare Flow is an educational and operational workflow prototype. It is not a medical diagnostic or clinical decision-support system.
        </footer>
      </body>
    </html>
  );
}