import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rattel Operational Platform",
  description: "Operational platform for Rattel Quran education.",
};

const navItems = [
  { href: "/admin", label: "الإدارة" },
  { href: "/operations", label: "التشغيل" },
  { href: "/finance", label: "المالية" },
  { href: "/teacher", label: "المعلم" },
  { href: "/parent", label: "ولي الأمر" },
  { href: "/login", label: "تسجيل الدخول" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="min-h-screen bg-slate-50 text-slate-950">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
              <a href="/" className="text-lg font-bold tracking-tight">
                Rattel Operational Platform
              </a>

              <nav
                aria-label="Primary navigation"
                className="flex flex-wrap gap-2 text-sm"
              >
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </header>

          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}