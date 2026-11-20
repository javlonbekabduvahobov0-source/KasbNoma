import { useMemo, useState } from "react";
import { VACANCIES, VacancyItem } from "../data/careerData";
import { ArrowRight, MapPin, Search, X } from "lucide-react";

interface VacanciesSectionProps {
  onPrepareForVacancy: (vacancy: VacancyItem) => void;
}

export default function VacanciesSection({ onPrepareForVacancy }: VacanciesSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("Hammasi");
  const [subjectFilter, setSubjectFilter] = useState("Hammasi");
  const [eduFilter, setEduFilter] = useState("Hammasi");
  const [selectedVacancy, setSelectedVacancy] = useState<VacancyItem | null>(null);

  const cities = useMemo(
    () => ["Hammasi", ...Array.from(new Set(VACANCIES.map((v) => v.city)))],
    []
  );
  const subjects = useMemo(
    () => ["Hammasi", ...Array.from(new Set(VACANCIES.map((v) => v.subjectTag)))],
    []
  );
  const eduLevels = useMemo(
    () => ["Hammasi", ...Array.from(new Set(VACANCIES.map((v) => v.minEducation)))],
    []
  );

  const filteredVacancies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return VACANCIES.filter((v) => {
      if (cityFilter !== "Hammasi" && v.city !== cityFilter) return false;
      if (subjectFilter !== "Hammasi" && v.subjectTag !== subjectFilter) return false;
      if (eduFilter !== "Hammasi" && v.minEducation !== eduFilter) return false;
      if (!q) return true;
      return (
        v.title.toLowerCase().includes(q) ||
        v.employer.toLowerCase().includes(q) ||
        v.subjectTag.toLowerCase().includes(q) ||
        v.skills.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, cityFilter, subjectFilter, eduFilter]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight text-wrap-balance">
              Dolzarb vakansiyalar: bugun bozorda kimlar va qancha maoshga kerak?
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              O'qiyotgan faningizga qarab hozirgi ish o'rinlari, talab qilinadigan diplom (Institut yoki
              Universitet) va o'sish imkoniyatlarini ko'ring.
            </p>
          </div>
          <div className="font-mono text-xs text-slate-500 tabular-nums shrink-0">
            Topildi: {filteredVacancies.length} ta vakansiya
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kasb, fan yoki ko'nikma qidirish..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-700"
            />
          </div>

          <select
            aria-label="Fan bo'yicha saralash"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-700"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                Fan: {s}
              </option>
            ))}
          </select>

          <select
            aria-label="Shahar bo'yicha saralash"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-700"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                Hudud: {c}
              </option>
            ))}
          </select>

          <select
            aria-label="Daraja bo'yicha saralash"
            value={eduFilter}
            onChange={(e) => setEduFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-700"
          >
            {eduLevels.map((eLevel) => (
              <option key={eLevel} value={eLevel}>
                Daraja: {eLevel}
              </option>
            ))}
          </select>
        </div>

        {filteredVacancies.length === 0 ? (
          <div className="border border-slate-200 rounded-xl p-10 text-center">
            <p className="text-sm font-semibold text-slate-900">
              Bu filtrlar bo'yicha vakansiya topilmadi
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Qidiruv so'zini o'zgartiring yoki barcha filtrlarni tozalang.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setCityFilter("Hammasi");
                setSubjectFilter("Hammasi");
                setEduFilter("Hammasi");
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg cursor-pointer"
            >
              Filtrlarni tozalash
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVacancies.map((vac) => (
              <article
                key={vac.id}
                className="flex flex-col justify-between bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 transition-colors"
              >
                <div>
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mb-2">
                    <span className="font-medium text-sky-700">{vac.subjectTag}</span>
                    <span aria-hidden="true">·</span>
                    <span>{vac.city}</span>
                    <span aria-hidden="true">·</span>
                    <span>{vac.minEducation}</span>
                  </div>

                  <h3 className="font-display text-base font-bold text-slate-900 leading-snug">
                    {vac.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">{vac.employer}</p>

                  <div className="mt-3 font-mono text-base font-bold text-emerald-700 tabular-nums">
                    {vac.salaryMin} – {vac.salaryMax} mln so'm/oy
                  </div>

                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {vac.description}
                  </p>
                </div>

                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 truncate">{vac.workload}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedVacancy(vac)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-800 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Batafsil
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {selectedVacancy && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="vacancy-modal-title"
        >
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sky-700">{selectedVacancy.subjectTag}</span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {selectedVacancy.city}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedVacancy.format}</span>
                </div>
                <h3 id="vacancy-modal-title" className="font-display text-xl font-bold text-slate-900">
                  {selectedVacancy.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedVacancy.employer}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVacancy(null)}
                aria-label="Yopish"
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2 bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div>
                  <div className="text-xs text-slate-500">Taklif etilayotgan oylik</div>
                  <div className="font-mono text-xl font-bold text-emerald-700 tabular-nums">
                    {selectedVacancy.salaryMin} – {selectedVacancy.salaryMax} mln so'm
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Yuklama / Grafik</div>
                  <div className="text-xs font-semibold text-slate-800">{selectedVacancy.workload}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-900 mb-1">Mos oliygoh va daraja</h4>
                <p className="text-xs text-slate-600">
                  {selectedVacancy.institutionFit} · Minimal daraja: {selectedVacancy.minEducation}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-900 mb-1">Talab qilinadigan ko'nikmalar</h4>
                <p className="text-xs text-slate-700">{selectedVacancy.skills.join(" · ")}</p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-900 mb-1">O'sish va toifa istiqboli</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedVacancy.growthPath}</p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-900 mb-1">Ish tavsifi</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedVacancy.description}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedVacancy(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Yopish
              </button>
              <button
                type="button"
                onClick={() => {
                  const vac = selectedVacancy;
                  setSelectedVacancy(null);
                  onPrepareForVacancy(vac);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg cursor-pointer"
              >
                AI bilan ushbu ishga tayyorlanish rejasini tuzish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
