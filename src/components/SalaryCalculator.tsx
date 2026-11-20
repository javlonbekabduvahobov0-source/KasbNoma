import { useState } from "react";
import { TOIFA_TIERS } from "../data/careerData";

interface CorporateTrack {
  id: string;
  name: string;
  levels: Array<{
    label: string;
    localMin: number;
    localMax: number;
    remoteMin: number;
    remoteMax: number;
    skills: string;
  }>;
}

const CORPORATE_TRACKS: CorporateTrack[] = [
  {
    id: "it",
    name: "Dasturlash va AI (IT)",
    levels: [
      { label: "Intern / 3–4-kurs", localMin: 2.5, localMax: 5.0, remoteMin: 4.0, remoteMax: 8.0, skills: "Python/JS, Git, Algoritmlar" },
      { label: "Junior (Bakalavr)", localMin: 5.5, localMax: 10.0, remoteMin: 8.0, remoteMax: 15.0, skills: "Backend/Frontend framework, SQL" },
      { label: "Middle (2–4 yil)", localMin: 12.0, localMax: 22.0, remoteMin: 18.0, remoteMax: 32.0, skills: "Arxitektura, Cloud, Ingliz tili" },
      { label: "Senior / Lead (4+ yil)", localMin: 24.0, localMax: 42.0, remoteMin: 35.0, remoteMax: 65.0, skills: "System Design, AI/ML, Jamoa boshqaruvi" },
    ],
  },
  {
    id: "finance",
    name: "Data va Moliya tahlili",
    levels: [
      { label: "Stajyor", localMin: 2.5, localMax: 4.5, remoteMin: 4.0, remoteMax: 7.0, skills: "Excel, Statistika asoslari" },
      { label: "Junior Tahlilchi", localMin: 6.0, localMax: 10.0, remoteMin: 9.0, remoteMax: 14.0, skills: "SQL, Power BI, Moliyaviy hisobot" },
      { label: "Middle Tahlilchi", localMin: 11.0, localMax: 20.0, remoteMin: 17.0, remoteMax: 28.0, skills: "Python, Risk modellari, ACCA" },
      { label: "Bosh tahlilchi / CFO", localMin: 22.0, localMax: 45.0, remoteMin: 30.0, remoteMax: 55.0, skills: "Strategik moliya, Xalqaro audit" },
    ],
  },
  {
    id: "engineering",
    name: "Muhandislik va Energetika",
    levels: [
      { label: "Amaliyotchi", localMin: 2.5, localMax: 4.5, remoteMin: 3.5, remoteMax: 6.0, skills: "Chizmachilik, AutoCAD asoslari" },
      { label: "Kichik muhandis", localMin: 5.5, localMax: 9.0, remoteMin: 8.0, remoteMax: 13.0, skills: "Loyihalash, Texnik hisoblar" },
      { label: "Yetakchi muhandis", localMin: 10.0, localMax: 18.0, remoteMin: 15.0, remoteMax: 26.0, skills: "Quyosh/Sanoat tizimlari, Loyiha nazorati" },
      { label: "Bosh muhandis", localMin: 18.0, localMax: 34.0, remoteMin: 25.0, remoteMax: 45.0, skills: "Yirik obyektlar boshqaruvi, Xalqaro standartlar" },
    ],
  },
];

export default function SalaryCalculator() {
  const [mode, setMode] = useState<"pedagogy" | "corporate">("pedagogy");

  const [selectedToifaId, setSelectedToifaId] = useState<string>("mutaxassis");
  const [weeklyHours, setWeeklyHours] = useState<number>(20);
  const [certBonusPct, setCertBonusPct] = useState<0 | 20 | 50>(0);
  const [hasVazirFund, setHasVazirFund] = useState<boolean>(false);
  const [hasClassLead, setHasClassLead] = useState<boolean>(true);
  const [tutoringExtraMln, setTutoringExtraMln] = useState<number>(0);

  const [corpTrackId, setCorpTrackId] = useState<string>("it");
  const [corpLevelIdx, setCorpLevelIdx] = useState<number>(1);
  const [isRemoteUsd, setIsRemoteUsd] = useState<boolean>(false);

  const activeTier = TOIFA_TIERS.find((t) => t.id === selectedToifaId) || TOIFA_TIERS[0];
  const stavkaMultiplier = weeklyHours / 20;
  const baseSalaryMln = Number((activeTier.baseRate1StavkaMln * stavkaMultiplier).toFixed(2));
  const certSalaryMln = Number(((baseSalaryMln * certBonusPct) / 100).toFixed(2));
  const classLeadMln = hasClassLead ? 0.65 : 0;
  const vazirFundMln = hasVazirFund ? 5.5 : 0;

  const schoolTotalMln = Number(
    (baseSalaryMln + certSalaryMln + classLeadMln + vazirFundMln).toFixed(2)
  );
  const grandTotalMln = Number((schoolTotalMln + tutoringExtraMln).toFixed(2));

  const pctBase = grandTotalMln > 0 ? Math.round((baseSalaryMln / grandTotalMln) * 100) : 0;
  const pctBonus =
    grandTotalMln > 0
      ? Math.round(((certSalaryMln + classLeadMln + vazirFundMln) / grandTotalMln) * 100)
      : 0;
  const pctTutoring = Math.max(0, 100 - pctBase - pctBonus);

  const activeCorpTrack =
    CORPORATE_TRACKS.find((t) => t.id === corpTrackId) || CORPORATE_TRACKS[0];
  const activeCorpLevel = activeCorpTrack.levels[corpLevelIdx] || activeCorpTrack.levels[1];
  const corpMin = isRemoteUsd ? activeCorpLevel.remoteMin : activeCorpLevel.localMin;
  const corpMax = isRemoteUsd ? activeCorpLevel.remoteMax : activeCorpLevel.localMax;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight text-wrap-balance">
              Bakalavr oyligi, dars soati (stavka) va Toifa kalkulyatori
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              1 stavka = haftasiga 20 soat dars (5–11-sinflar). Qonuniy maksimal 1.5 stavkagacha (30 soat)
              dars olish mumkin. Toifa va sertifikatlar oylikni qanday oshirishini sinab ko'ring.
            </p>
          </div>

          <div className="inline-flex p-1 bg-white border border-slate-200 rounded-lg self-start lg:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setMode("pedagogy")}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === "pedagogy"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Pedagogika va Ta'lim
            </button>
            <button
              type="button"
              onClick={() => setMode("corporate")}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === "corporate"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              IT, Moliya va Muhandislik
            </button>
          </div>
        </div>

        {mode === "pedagogy" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2.5">
                  1. Malaka darajangiz (Toifa)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TOIFA_TIERS.map((tier) => {
                    const isSelected = tier.id === selectedToifaId;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setSelectedToifaId(tier.id)}
                        className={`text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                          isSelected
                            ? "border-sky-700 bg-sky-50/70"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900">{tier.name}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                          <span>{tier.yearsRequired}</span>
                          <span className="font-mono font-semibold text-slate-700 tabular-nums">
                            ~{tier.baseRate1StavkaMln} mln (1 st.)
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100">
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <label htmlFor="weekly-hours" className="text-xs font-semibold text-slate-800">
                    2. Haftalik dars soati (yuklama)
                  </label>
                  <span className="font-mono text-sm font-bold text-sky-800 tabular-nums">
                    {weeklyHours} soat ({stavkaMultiplier.toFixed(2)} stavka)
                  </span>
                </div>
                <input
                  id="weekly-hours"
                  type="range"
                  min={10}
                  max={30}
                  step={2}
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="w-full accent-sky-700 cursor-pointer"
                />
                <div className="mt-1.5 flex justify-between text-[11px] font-mono text-slate-500 tabular-nums">
                  <span>10 soat (0.5 st.)</span>
                  <span>20 soat (1.0 st. me'yor)</span>
                  <span>30 soat (1.5 st. maksimal)</span>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-800 mb-2.5">
                  3. Milliy yoki Xalqaro sertifikat ustamasi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 0 as const, label: "Sertifikatsiz (0%)" },
                    { val: 20 as const, label: "Milliy sertifikat (+20%)" },
                    { val: 50 as const, label: "A+/C1 / IELTS 7+ (+50%)" },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setCertBonusPct(opt.val)}
                      className={`px-3 py-2.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        certBonusPct === opt.val
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={hasClassLead}
                    onChange={(e) => setHasClassLead(e.target.checked)}
                    className="mt-0.5 accent-sky-700 w-4 h-4"
                  />
                  <span className="text-xs text-slate-700">
                    <strong className="block font-semibold text-slate-900">
                      Sinf rahbarligi + daftar tekshirish
                    </strong>
                    Taxminan +0.65 mln so'm/oy
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={hasVazirFund}
                    onChange={(e) => setHasVazirFund(e.target.checked)}
                    className="mt-0.5 accent-sky-700 w-4 h-4"
                  />
                  <span className="text-xs text-slate-700">
                    <strong className="block font-semibold text-slate-900">
                      Vazir jamg'armasi ustamasi
                    </strong>
                    Tanlov g'oliblariga +5.5 mln so'm/oy
                  </span>
                </label>
              </div>

              <div className="pt-5 border-t border-slate-100">
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <label htmlFor="tutoring-extra" className="text-xs font-semibold text-slate-800">
                    4. Darsdan tashqari qo'shimcha repetitorlik / o'quv markaz
                  </label>
                  <span className="font-mono text-sm font-bold text-emerald-700 tabular-nums">
                    +{tutoringExtraMln} mln so'm
                  </span>
                </div>
                <input
                  id="tutoring-extra"
                  type="range"
                  min={0}
                  max={20}
                  step={1}
                  value={tutoringExtraMln}
                  onChange={(e) => setTutoringExtraMln(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="mt-1.5 flex justify-between text-[11px] font-mono text-slate-500 tabular-nums">
                  <span>0 mln (faqat maktab)</span>
                  <span>8 mln (2 ta guruh)</span>
                  <span>20 mln (faol repetitor)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <div>
                <p className="text-xs font-medium text-slate-500">Taxminiy jami oylik daromadingiz</p>
                <div className="mt-1 font-mono text-3xl sm:text-4xl font-bold text-slate-900 tabular-nums">
                  {grandTotalMln.toFixed(2)} <span className="text-lg font-medium text-slate-600">mln so'm</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Maktabning o'zidan:{" "}
                  <span className="font-mono font-semibold text-slate-800 tabular-nums">
                    {schoolTotalMln.toFixed(2)} mln so'm
                  </span>{" "}
                  · {activeTier.name}
                </p>
              </div>

              <div>
                <div className="h-3.5 w-full rounded-full bg-slate-100 overflow-hidden flex">
                  <div
                    className="bg-sky-700 h-full transition-all"
                    style={{ width: `${pctBase}%` }}
                    title="Bazaviy stavka maoshi"
                  />
                  <div
                    className="bg-sky-400 h-full transition-all"
                    style={{ width: `${pctBonus}%` }}
                    title="Toifa/Sertifikat/Ustamalar"
                  />
                  <div
                    className="bg-emerald-600 h-full transition-all"
                    style={{ width: `${pctTutoring}%` }}
                    title="Qo'shimcha repetitorlik"
                  />
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-4 text-[11px] text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-sky-700" /> Bazaviy ({pctBase}%)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" /> Ustamalar ({pctBonus}%)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" /> Repetitorlik ({pctTutoring}%)
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="text-xs font-semibold text-slate-900 mb-3">Tarkibiy hisob-kitob</h3>
                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-600">
                      Bazaviy tarifikatsiya ({weeklyHours} soat · {activeTier.name.split(" ")[0]})
                    </dt>
                    <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                      {baseSalaryMln.toFixed(2)} mln
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-600">Milliy / Til sertifikati (+{certBonusPct}%)</dt>
                    <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                      +{certSalaryMln.toFixed(2)} mln
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-600">Sinf rahbarligi va daftar tekshirish</dt>
                    <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                      +{classLeadMln.toFixed(2)} mln
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-600">Vazir jamg'armasi ustamasi</dt>
                    <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                      +{vazirFundMln.toFixed(2)} mln
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-600">Repetitorlik / o'quv markaz</dt>
                    <dd className="font-mono font-semibold text-emerald-700 tabular-nums">
                      +{tutoringExtraMln.toFixed(2)} mln
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 leading-relaxed">
                <strong className="font-semibold text-slate-900">Eslatma:</strong> Prezident va
                ixtisoslashtirilgan maktablarda toifa va natijadorlik ustamalari yanada yuqori bo'lib,
                oylik 14–22 mln so'mgacha yetadi.
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2.5">
                  1. Soha yo'nalishini tanlang
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {CORPORATE_TRACKS.map((tr) => (
                    <button
                      key={tr.id}
                      type="button"
                      onClick={() => setCorpTrackId(tr.id)}
                      className={`px-3.5 py-2.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        corpTrackId === tr.id
                          ? "border-sky-700 bg-sky-50 text-sky-900"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {tr.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-800 mb-2.5">
                  2. Tajriba va malaka darajasi
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {activeCorpTrack.levels.map((lvl, idx) => (
                    <button
                      key={lvl.label}
                      type="button"
                      onClick={() => setCorpLevelIdx(idx)}
                      className={`px-3 py-2.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        corpLevelIdx === idx
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-800 mb-2.5">
                  3. Ish bozori formati
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsRemoteUsd(false)}
                    className={`p-3 text-left rounded-lg border transition-colors cursor-pointer ${
                      !isRemoteUsd
                        ? "border-sky-700 bg-sky-50/70"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">Mahalliy bozor (O'zbekiston)</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Toshkent va viloyat kompaniyalari
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRemoteUsd(true)}
                    className={`p-3 text-left rounded-lg border transition-colors cursor-pointer ${
                      isRemoteUsd
                        ? "border-sky-700 bg-sky-50/70"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">Xalqaro / Masofaviy (Eksport)</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Ingliz tili bilan USD kontraktlar
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {activeCorpTrack.name} · {activeCorpLevel.label}
                </p>
                <div className="mt-1 font-mono text-3xl sm:text-4xl font-bold text-slate-900 tabular-nums">
                  {corpMin} – {corpMax}{" "}
                  <span className="text-lg font-medium text-slate-600">mln so'm</span>
                </div>
                <p className="mt-1 font-mono text-xs text-emerald-700 tabular-nums">
                  Taxminan ${Math.round((corpMin * 1000000) / 12800)} – $
                  {Math.round((corpMax * 1000000) / 12800)} / oy
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-xs font-semibold text-slate-900 mb-1.5">
                  Bu daraja uchun kerakli ko'nikmalar:
                </h3>
                <p className="text-sm text-slate-700">{activeCorpLevel.skills}</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 leading-relaxed">
                <strong className="font-semibold text-slate-900">10–11-sinf uchun maslahat:</strong>{" "}
                Universitetga kirishda Matematika va Ingliz tilini kuchaytiring. 2-kursdanoq amaliyot
                boshlasangiz, bakalavrni bitirganda Junior emas, Middle darajada ishga kirasiz.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
