const planningDocuments = [
  "AGENTS.md",
  "TECHNICAL_AUDIT.md",
  "ARCHITECTURE_DECISIONS.md",
  "ARCHITECTURE.md",
  "DATABASE_SCHEMA.md",
  "PERMISSIONS.md",
  "TESTING.md",
  "DEPLOYMENT.md",
  "IMPLEMENTATION_PLAN.md",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-950">
      <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-teal-700">
          منصة رتل التشغيلية
        </p>

        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
          Rattel Operational Platform
        </h1>

        <p className="mb-8 max-w-2xl text-lg leading-8 text-slate-700">
          هذا هيكل أولي فقط لتطبيق Next.js الخاص بالمنصة التشغيلية. لا توجد
          مصادقة ولا قاعدة بيانات ولا صلاحيات ولا بيانات حقيقية في هذه
          المرحلة.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="mb-2 font-semibold">الحالة</h2>
            <p className="text-sm leading-6 text-slate-600">
              Phase 2: Next.js scaffold فقط.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="mb-2 font-semibold">النطاق</h2>
            <p className="text-sm leading-6 text-slate-600">
              لا يوجد Supabase ولا migrations ولا نشر إنتاجي.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="mb-2 font-semibold">الموقع العام</h2>
            <p className="text-sm leading-6 text-slate-600">
              ratel-quran.com يبقى دون تغيير.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-slate-100 p-5">
          <h2 className="mb-3 font-semibold">Planning documents</h2>
          <ul className="grid gap-2 text-sm text-slate-700 md:grid-cols-2">
            {planningDocuments.map((document) => (
              <li key={document}>
                <code>{document}</code>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
