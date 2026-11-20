import { useState } from "react";
import { FIELD_SCENARIOS, INSTITUTION_COMPARISON } from "../data/careerData";

export default function InstVsUniSection() {
  const [selectedFieldId, setSelectedFieldId] = useState<string>(FIELD_SCENARIOS[0].id);

  const activeScenario =
    FIELD_SCENARIOS.find((f) => f.id === selectedFieldId) || FIELD_SCENARIOS[0];

  return (
    <div className="space-y-8">
      <div>
        <div className="max-w-3xl mb-6">
          <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight text-wrap-balance">
            Institutda o'qisam kim bo'laman, Universitetda o'qisam kim bo'laman?
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Ko'pchilik 10–11-sinf o'quvchilari ikkisini bir xil deb o'ylaydi. Aslida diplom maqomi teng
            bo'lsa-da, tayyorlaydigan mutaxassislik ko'lami va ilk ish yo'nalishi farq qiladi.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <h3 className="font-display text-base font-bold text-slate-900">
              Aniq misol orqali solishtiring:
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-lg">
              {FIELD_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setSelectedFieldId(sc.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedFieldId === sc.id
                      ? "bg-sky-700 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <div className="text-xs font-semibold text-sky-700 mb-2">
                Institutni tanlasangiz
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {activeScenario.instituteResult}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <div className="text-xs font-semibold text-emerald-700 mb-2">
                Universitetni tanlasangiz
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {activeScenario.universityResult}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-600 leading-relaxed">
            <strong className="font-semibold text-slate-800">Daromad bo'yicha xulosa:</strong>{" "}
            {activeScenario.salaryDifferenceNote}
          </p>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3.5 px-5 text-xs font-semibold text-slate-700 w-1/4">Mezon</th>
                <th className="py-3.5 px-5 text-xs font-semibold text-sky-800 w-[37.5%]">
                  Institut (Pedagogika, Texnika, Tibbiyot)
                </th>
                <th className="py-3.5 px-5 text-xs font-semibold text-emerald-800 w-[37.5%]">
                  Universitet (Milliy, IT, Iqtisodiyot)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {INSTITUTION_COMPARISON.map((row) => (
                <tr key={row.criterion} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 text-xs sm:text-sm font-semibold text-slate-900 align-top">
                    {row.criterion}
                  </td>
                  <td className="py-3.5 px-5 text-xs sm:text-sm text-slate-600 leading-relaxed align-top">
                    {row.institute}
                  </td>
                  <td className="py-3.5 px-5 text-xs sm:text-sm text-slate-600 leading-relaxed align-top">
                    {row.university}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
