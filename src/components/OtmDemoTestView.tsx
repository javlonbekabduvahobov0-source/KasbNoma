import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "../firebase";
import { SUBJECT_PATHWAYS } from "../data/careerData";
import { DEMO_TESTS_BY_SUBJECT, DemoQuestion } from "../data/demoTestsData";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";

export interface SavedTestResult {
  id: string;
  userId: string;
  subjectId: string;
  subjectName: string;
  score: number;
  totalQuestions: number;
  percent: number;
  dtmEquivalent: number;
  mode: "demo" | "ai";
  createdAt?: { seconds: number };
}

interface OtmDemoTestViewProps {
  initialSubjectId: string;
}

const OPTION_LETTERS = ["A", "B", "C", "D"];

export default function OtmDemoTestView({ initialSubjectId }: OtmDemoTestViewProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectId);
  const [testMode, setTestMode] = useState<"demo" | "ai">("demo");
  const [questions, setQuestions] = useState<DemoQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [status, setStatus] = useState<"setup" | "running" | "finished">("setup");
  const [secondsLeft, setSecondsLeft] = useState<number>(15 * 60);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [history, setHistory] = useState<SavedTestResult[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);

  useEffect(() => {
    setSelectedSubjectId(initialSubjectId);
    setStatus("setup");
  }, [initialSubjectId]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const path = `users/${uid}/testResults`;
    const q = query(collection(db, path), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: SavedTestResult[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<SavedTestResult, "id">),
        }));
        setHistory(list);
        setHistoryLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    if (status !== "running") return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status === "running" && secondsLeft === 0) {
      finishTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, status]);

  const activeSubject =
    SUBJECT_PATHWAYS.find((s) => s.id === selectedSubjectId) || SUBJECT_PATHWAYS[0];

  async function startStandardDemo() {
    setAiError(null);
    setSaveMessage(null);
    const bank = DEMO_TESTS_BY_SUBJECT[selectedSubjectId] || DEMO_TESTS_BY_SUBJECT.matematika;
    setTestMode("demo");
    setQuestions(bank);
    setAnswers({});
    setCurrentIdx(0);
    setSecondsLeft(15 * 60);
    setStatus("running");
  }

  async function startAiTest() {
    setAiError(null);
    setSaveMessage(null);
    setIsGeneratingAi(true);
    try {
      const resp = await fetch("/api/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectName: activeSubject.name }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "AI test yaratishda xatolik yuz berdi.");
      }
      const generated: DemoQuestion[] = (data.questions || []).map(
        (
          item: {
            question: string;
            options: [string, string, string, string];
            correctIndex: number;
            explanation: string;
          },
          i: number
        ) => ({
          id: `ai-${Date.now()}-${i}`,
          question: item.question,
          options: item.options,
          correctIndex: Math.min(3, Math.max(0, Number(item.correctIndex) || 0)),
          explanation: item.explanation,
        })
      );
      if (generated.length === 0) {
        throw new Error("Savollar ro'yxati bo'sh qaytdi.");
      }
      setTestMode("ai");
      setQuestions(generated);
      setAnswers({});
      setCurrentIdx(0);
      setSecondsLeft(10 * 60);
      setStatus("running");
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Test yaratishda xatolik.");
    } finally {
      setIsGeneratingAi(false);
    }
  }

  async function finishTest() {
    setStatus("finished");
    const total = questions.length;
    const correctCount = questions.reduce(
      (acc, q, idx) => (answers[idx] === q.correctIndex ? acc + 1 : acc),
      0
    );
    const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const dtmEquivalent = Number(((percent / 100) * 93).toFixed(1));

    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const path = `users/${uid}/testResults`;
    try {
      await addDoc(collection(db, path), {
        userId: uid,
        subjectId: activeSubject.id,
        subjectName: activeSubject.name,
        score: correctCount,
        totalQuestions: total,
        percent,
        dtmEquivalent,
        mode: testMode,
        createdAt: serverTimestamp(),
      });
      setSaveMessage("Natijangiz kabinetingizga saqlandi.");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  }

  async function handleDeleteHistory(resultId: string) {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const path = `users/${uid}/testResults/${resultId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const correctCount = questions.reduce(
    (acc, q, idx) => (answers[idx] === q.correctIndex ? acc + 1 : acc),
    0
  );
  const percent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const dtm1Fan = Number(((percent / 100) * 93).toFixed(1));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Oliy ta'lim (UZBMB / DTM) Demo Testlari
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Fanni tanlang va OTM kirish testining demo versiyasini ishlab ko'ring. Har bir savolning
            yechimi va 93 ballik 1-fan shkalasi bo'yicha natijangiz hisoblanadi.
          </p>
        </div>
      </div>

      {status === "setup" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-2.5">
                1. Test ishlamoqchi bo'lgan fanni tanlang:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SUBJECT_PATHWAYS.map((subj) => (
                  <button
                    key={subj.id}
                    type="button"
                    onClick={() => setSelectedSubjectId(subj.id)}
                    className={`px-3 py-2.5 text-xs font-semibold rounded-lg border text-left transition-colors cursor-pointer ${
                      selectedSubjectId === subj.id
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {subj.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">{activeSubject.name} · OTM Testi</h3>
              <p className="mt-1 text-xs text-slate-600">{activeSubject.dtmBlock}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={startStandardDemo}
                className="p-4 text-left bg-sky-700 hover:bg-sky-800 text-white rounded-xl transition-colors cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Standart OTM Demo Test</span>
                  <Play className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-sky-100 leading-relaxed">
                  8 ta saralangan UZBMB darajasidagi savol · 15 daqiqa · Darhol boshlash
                </p>
              </button>

              <button
                type="button"
                onClick={startAiTest}
                disabled={isGeneratingAi}
                className="p-4 text-left bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 rounded-xl transition-colors cursor-pointer space-y-1.5 disabled:opacity-60"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">
                    {isGeneratingAi ? "Savollar tuzilmoqda..." : "AI Yangi Test Tuzish"}
                  </span>
                  {isGeneratingAi ? (
                    <Loader2 className="w-4 h-4 animate-spin text-sky-700" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-sky-700" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Gemini yordamida {activeSubject.name} fanidan 5 ta yangi OTM test savoli
                </p>
              </button>
            </div>

            {aiError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                {aiError}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-slate-900">
              Baholash mezoni (UZBMB standarti)
            </h3>
            <dl className="space-y-3 text-xs">
              <div className="flex justify-between gap-4 pb-2.5 border-b border-slate-100">
                <dt className="text-slate-600">1-asosiy fan koeffitsiyenti</dt>
                <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                  3.1 ball / savol
                </dd>
              </div>
              <div className="flex justify-between gap-4 pb-2.5 border-b border-slate-100">
                <dt className="text-slate-600">1-fan maksimal ko'rsatkichi</dt>
                <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                  93.0 ball (30 savol)
                </dd>
              </div>
              <div className="flex justify-between gap-4 pb-2.5 border-b border-slate-100">
                <dt className="text-slate-600">Grant uchun tavsiya etilgan daraja</dt>
                <dd className="font-mono font-semibold text-emerald-700 tabular-nums">
                  80%+ to'g'ri javob
                </dd>
              </div>
            </dl>
            <p className="text-xs text-slate-500 leading-relaxed">
              Testni tugatganingizdan so'ng har bir savolning batafsil yechimi chiqadi va balingiz
              avtomatik profilingizga saqlanadi.
            </p>
          </div>
        </div>
      )}

      {status === "running" && questions.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="text-xs text-slate-500">
                {activeSubject.name} · {testMode === "ai" ? "AI Test" : "OTM Demo Test"}
              </div>
              <div className="font-display text-base font-bold text-slate-900">
                Savol {currentIdx + 1} / {questions.length}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="inline-flex items-center gap-1.5 font-mono text-sm font-bold text-slate-800 tabular-nums">
                <Clock className="w-4 h-4 text-sky-700" />
                {formatTime(secondsLeft)}
              </div>
              <button
                type="button"
                onClick={finishTest}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
              >
                Testni yakunlash
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {questions.map((_, idx) => {
              const isAnswered = answers[idx] !== undefined;
              const isCurrent = idx === currentIdx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-9 h-9 rounded-lg font-mono text-xs font-semibold border transition-colors cursor-pointer tabular-nums ${
                    isCurrent
                      ? "bg-sky-700 text-white border-sky-700"
                      : isAnswered
                      ? "bg-sky-50 text-sky-900 border-sky-300"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="py-2">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
              {questions[currentIdx].question}
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-2.5">
              {questions[currentIdx].options.map((opt, optIdx) => {
                const isSelected = answers[currentIdx] === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [currentIdx]: optIdx,
                      }))
                    }
                    className={`w-full text-left p-4 rounded-xl border transition-colors flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? "border-sky-700 bg-sky-50 text-slate-900"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-sky-700 text-white" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {OPTION_LETTERS[optIdx]}
                    </span>
                    <span className="text-sm">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-40 cursor-pointer"
            >
              Oldingi savol
            </button>
            {currentIdx < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Keyingi savol
              </button>
            ) : (
              <button
                type="button"
                onClick={finishTest}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
              >
                Natijani ko'rish
              </button>
            )}
          </div>
        </div>
      )}

      {status === "finished" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <p className="text-xs font-medium text-sky-700">
                  {activeSubject.name} · Test yakunlandi
                </p>
                <h3 className="font-display text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">
                  Natija: {correctCount} / {questions.length} ({percent}%)
                </h3>
                {saveMessage && (
                  <p className="mt-1 text-xs text-emerald-700 font-medium">{saveMessage}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => setStatus("setup")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Boshqa fan / test tanlash
                </button>
                <button
                  type="button"
                  onClick={startAiTest}
                  disabled={isGeneratingAi}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Yana AI test ishlash
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs text-slate-500">1-fan UZBMB ekvivalenti</div>
                <div className="mt-1 font-mono text-xl font-bold text-slate-900 tabular-nums">
                  {dtm1Fan} / 93.0 ball
                </div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs text-slate-500">To'g'ri javoblar ulushi</div>
                <div className="mt-1 font-mono text-xl font-bold text-emerald-700 tabular-nums">
                  {percent}%
                </div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-xs text-slate-500">Tayyorgarlik bahosi</div>
                <div className="mt-1 text-sm font-bold text-slate-900">
                  {percent >= 80
                    ? "Grant darajasiga juda yaqin"
                    : percent >= 55
                    ? "Yaxshi baza, yanada mashq kerak"
                    : "Asosiy mavzularni qayta ko'ring"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h4 className="font-display text-base font-bold text-slate-900">
              Savollar va yechimlar tahlili
            </h4>
            <div className="divide-y divide-slate-200">
              {questions.map((q, idx) => {
                const userPick = answers[idx];
                const isRight = userPick === q.correctIndex;
                return (
                  <div key={q.id} className="py-4 first:pt-2 last:pb-0 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">
                        {idx + 1}. {q.question}
                      </p>
                      {isRight ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 shrink-0">
                          <CheckCircle2 className="w-4 h-4" /> To'g'ri
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 shrink-0">
                          <XCircle className="w-4 h-4" /> Xato
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                      <span>
                        Sizning javobingiz:{" "}
                        <strong className="text-slate-900">
                          {userPick !== undefined ? q.options[userPick] : "Belgilanmagan"}
                        </strong>
                      </span>
                      <span>
                        To'g'ri javob:{" "}
                        <strong className="text-emerald-700">{q.options[q.correctIndex]}</strong>
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3 leading-relaxed">
                      <strong>Izoh:</strong> {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="font-display text-base font-bold text-slate-900">
            Saqlangan test natijalaringiz tarixi
          </h3>
          <span className="font-mono text-xs text-slate-500 tabular-nums">
            Jami: {history.length} ta urinish
          </span>
        </div>

        {historyLoading ? (
          <p className="text-xs text-slate-500">Natijalar yuklanmoqda...</p>
        ) : history.length === 0 ? (
          <p className="text-xs text-slate-500">
            Hali birorta test ishlanmagan. Yuqoridan fan tanlab ilk OTM demo testini boshlang!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="py-2.5 pr-4">Fan</th>
                  <th className="py-2.5 pr-4">Tur</th>
                  <th className="py-2.5 pr-4">Natija</th>
                  <th className="py-2.5 pr-4">1-fan ekvivalenti</th>
                  <th className="py-2.5 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 pr-4 font-semibold text-slate-900">{item.subjectName}</td>
                    <td className="py-3 pr-4 text-slate-600">
                      {item.mode === "ai" ? "AI Test" : "Demo Test"}
                    </td>
                    <td className="py-3 pr-4 font-mono font-semibold text-slate-900 tabular-nums">
                      {item.score}/{item.totalQuestions} ({item.percent}%)
                    </td>
                    <td className="py-3 pr-4 font-mono font-semibold text-emerald-700 tabular-nums">
                      {item.dtmEquivalent} / 93
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteHistory(item.id)}
                        aria-label="Natijani o'chirish"
                        className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
