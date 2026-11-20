import { useState } from "react";
import { SUBJECT_PATHWAYS, SubjectPathway } from "../data/careerData";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, FileCheck2, GraduationCap, Lightbulb, Sparkles } from "lucide-react";

interface SubjectsWorkspaceProps {
  favoriteSubjectId: string;
  onSetFavoriteSubject: (subjectId: string) => void;
  onStartDemoTest: (subjectId: string) => void;
  onAskAiAboutSubject: (subjectName: string) => void;
}

export default function SubjectsWorkspace({
  favoriteSubjectId,
  onSetFavoriteSubject,
  onStartDemoTest,
  onAskAiAboutSubject,
}: SubjectsWorkspaceProps) {
  const [openedSubjectId, setOpenedSubjectId] = useState<string | null>(null);
  const [sectorFilter, setSectorFilter] = useState<string>("Hammasi");

  const openedSubject: SubjectPathway | null = openedSubjectId
    ? SUBJECT_PATHWAYS.find((s) => s.id === openedSubjectId) || null
    : null;

  if (openedSubject) {
    const sectors = ["Hammasi", ...Array.from(new Set(openedSubject.roles.map((r) => r.sector)))];
    const filteredRoles =
      sectorFilter === "Hammasi"
        ? openedSubject.roles
        : openedSubject.roles.filter((r) => r.sector === sectorFilter);
    const maxMln = Math.max(...openedSubject.incomeStages.map((s) => s.maxMln), 30);
    const isFav = favoriteSubjectId === openedSubject.id;

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setOpenedSubjectId(null);
              setSectorFilter("Hammasi");
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Barcha fanlarga qaytish
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onSetFavoriteSubject(openedSubject.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                isFav
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {isFav ? "Asosiy fan sifatida tanlangan" : "Asosiy fanim qilib belgilash"}
            </button>

            <button
              type="button"
              onClick={() => onStartDemoTest(openedSubject.id)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              Shu fan OTM testini ishlab ko'rish
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-5 border-b border-slate-200">
            <div className="max-w-3xl">
              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mb-1.5">
                <span className="font-semibold text-sky-700">Fan profili</span>
                <span aria-hidden="true">·</span>
                <span>{openedSubject.dtmBlock}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                {openedSubject.name}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{openedSubject.tagline}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 shrink-0">
              <div className="text-[11px] text-slate-500">O'rtacha grant balli</div>
              <div className="font-mono text-base font-bold text-slate-900 tabular-nums">
                {openedSubject.avgGrantScore}
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-lg">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-900 mb-1.5">
                  <Lightbulb className="w-4 h-4 text-sky-700" />
                  Nega bu fanni o'qish qiziq va kelajakda juda foydali?
                </div>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {openedSubject.interestHook}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-900 mb-2.5">
                  Qiziqishni oshiruvchi 3 ta real fakt:
                </h3>
                <ul className="space-y-2">
                  {openedSubject.realWorldFacts.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 mb-2">
                  Yetakchi OTMlar (O'zbekiston)
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {openedSubject.keyUniversities.join(" · ")}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900">
                  Bilimingizni hoziroq tekshirib ko'ring
                </h4>
                <p className="text-xs text-slate-600">
                  {openedSubject.name} fanidan UZBMB (OTM) demo testini ishlab, grantga tayyorlik
                  darajangizni bilib oling.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onStartDemoTest(openedSubject.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    Testni ishlash
                  </button>
                  <button
                    type="button"
                    onClick={() => onAskAiAboutSubject(openedSubject.name)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-700" />
                    AI dan so'rash
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200">
              <h3 className="font-display text-base font-bold text-slate-900">
                {openedSubject.name} o'qisangiz kim bo'lasiz?
              </h3>
              <div className="flex flex-wrap gap-1">
                {sectors.map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSectorFilter(sec)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer ${
                      sectorFilter === sec
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredRoles.map((role) => (
                <div key={role.title} className="py-4 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h4 className="text-sm font-bold text-slate-900">{role.title}</h4>
                    <span className="font-mono text-xs font-bold text-emerald-700 tabular-nums shrink-0">
                      {role.entryIncomeMln} → {role.seniorIncomeMln} so'm
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {role.sector} · {role.degreePath}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{role.workloadNote}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-display text-base font-bold text-slate-900 mb-4">
                Bosqichma-bosqich daromad o'sishi
              </h3>
              <div className="space-y-3.5">
                {openedSubject.incomeStages.map((st) => {
                  const maxW = Math.min(100, Math.round((st.maxMln / maxMln) * 100));
                  const minW = Math.min(maxW, Math.round((st.minMln / maxMln) * 100));
                  return (
                    <div key={st.stage}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-800">{st.stage}</span>
                        <span className="font-mono font-semibold text-slate-900 tabular-nums">
                          {st.minMln}–{st.maxMln} mln
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden relative">
                        <div className="h-full bg-sky-200 rounded-full" style={{ width: `${maxW}%` }} />
                        <div
                          className="h-full bg-sky-700 rounded-full absolute top-0 left-0"
                          style={{ width: `${minW}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500">{st.note}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <BookOpen className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Institut:</strong> {openedSubject.instituteOptions}
                  <div className="mt-1">
                    <strong className="text-slate-900">Universitet:</strong>{" "}
                    {openedSubject.universityOptions}
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-start gap-2.5">
                <GraduationCap className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Bakalavr:</strong> {openedSubject.bachelorOutcome}
                  <div className="mt-1">
                    <strong className="text-slate-900">Magistratura:</strong>{" "}
                    {openedSubject.masterOutcome}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Fanlar katalogi
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Istalgan fanni tanlang: uning to'liq ma'lumoti, qiziqarli faktlari, daromadi va OTM demo
            testini oching.
          </p>
        </div>
        <span className="font-mono text-xs text-slate-500 tabular-nums shrink-0">
          {SUBJECT_PATHWAYS.length} ta asosiy yo'nalish
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {SUBJECT_PATHWAYS.map((subj) => {
          const topStage = subj.incomeStages[subj.incomeStages.length - 1];
          const isFav = subj.id === favoriteSubjectId;
          return (
            <article
              key={subj.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-mono tabular-nums">Grant: {subj.avgGrantScore}</span>
                  {isFav && (
                    <span className="font-semibold text-emerald-700">Asosiy faningiz</span>
                  )}
                </div>

                <h3 className="font-display text-lg font-bold text-slate-900">{subj.name}</h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{subj.interestHook}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between text-xs">
                  <span className="text-slate-500">Daromad salohiyati:</span>
                  <span className="font-mono font-bold text-emerald-700 tabular-nums">
                    {topStage.minMln}–{topStage.maxMln} mln/oy
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOpenedSubjectId(subj.id)}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Ma'lumot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onStartDemoTest(subj.id)}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Testni ishlash</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
