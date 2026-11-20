import { useEffect, useRef, useState } from "react";
import { SUBJECT_PATHWAYS } from "../data/careerData";
import { Send, Loader2, RotateCcw } from "lucide-react";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface RoadmapData {
  summaryTitle: string;
  recommendedInstitutionType: string;
  recommendedMajors: Array<{
    name: string;
    institutionExample: string;
    examSubjects: string;
  }>;
  stages: Array<{
    stageLabel: string;
    timeframe: string;
    actions: string;
    expectedMonthlyIncome: string;
    hoursOrWorkload: string;
  }>;
  toifaAndGrowthNote: string;
}

interface SmartAdvisorSectionProps {
  externalPrompt: string | null;
  onClearExternalPrompt: () => void;
  activeTab: "chat" | "roadmap";
  onChangeTab: (tab: "chat" | "roadmap") => void;
}

const STARTER_QUESTIONS = [
  "Matematikani o'qisam kim bo'laman?",
  "Bakalavrni tugatsam qancha oylik olaman va necha soat dars olsam bo'ladi?",
  "Institutda o'qisam kim bo'laman, Universitetda o'qisam kim bo'laman?",
  "Toifa olgandan keyin oylik qanchagacha ko'tariladi?",
];

export default function SmartAdvisorSection({
  externalPrompt,
  onClearExternalPrompt,
  activeTab,
  onChangeTab,
}: SmartAdvisorSectionProps) {
  const [grade, setGrade] = useState<"10" | "11">("11");
  const [subject, setSubject] = useState<string>("Matematika");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Assalomu alaykum! Men KasbNoma aqlli maslahatchisiman. 10–11-sinfdan qaysi fanni tanlash, Institut yoki Universitet farqi, bakalavrdan keyingi dars soati (stavka), toifa oshirish va real oylik daromadlar bo'yicha istalgan savolingizni bering.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const [institutionPref, setInstitutionPref] = useState<"farqi-yoq" | "institut" | "universitet">("farqi-yoq");
  const [goalTrack, setGoalTrack] = useState("Ta'lim (Maktab, Toifa va Repetitorlik)");
  const [targetIncome, setTargetIncome] = useState(15);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  async function sendMessage(textToSend: string) {
    const trimmed = textToSend.trim();
    if (!trimmed || isSending) return;

    setChatError(null);
    const updatedMessages: ChatMessage[] = [...messages, { role: "user", text: trimmed }];
    setMessages(updatedMessages);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          context: { grade, subject },
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Javob olishda xatolik yuz berdi.");
      }
      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
    } catch (err) {
      setChatError(err instanceof Error ? err.message : "Tarmoq xatosi yuz berdi.");
    } finally {
      setIsSending(false);
    }
  }

  useEffect(() => {
    if (externalPrompt) {
      onChangeTab("chat");
      sendMessage(externalPrompt);
      onClearExternalPrompt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, isSending]);

  async function handleGenerateRoadmap(e: React.FormEvent) {
    e.preventDefault();
    if (isGeneratingRoadmap) return;

    setRoadmapError(null);
    setIsGeneratingRoadmap(true);

    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade,
          subject,
          institutionPreference: institutionPref,
          goalTrack,
          targetIncomeMillion: targetIncome,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Yo'l xaritasini yaratishda xatolik yuz berdi.");
      }
      setRoadmap(data.roadmap);
    } catch (err) {
      setRoadmapError(err instanceof Error ? err.message : "Server bilan bog'lanishda xato.");
    } finally {
      setIsGeneratingRoadmap(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight text-wrap-balance">
              Aqlli AI maslahatchi bilan savollarga javob oling va shaxsiy reja tuzing
            </h2>
          </div>

          <div className="inline-flex p-1 bg-white border border-slate-200 rounded-lg self-start lg:self-auto shrink-0">
            <button
              type="button"
              onClick={() => onChangeTab("chat")}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === "chat"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Savol-javob (AI Chat)
            </button>
            <button
              type="button"
              onClick={() => onChangeTab("roadmap")}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === "roadmap"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              5 yillik shaxsiy reja
            </button>
          </div>
        </div>

        {activeTab === "chat" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-5">
              <div>
                <h3 className="text-xs font-semibold text-slate-900 mb-2.5">
                  Sizning profilingiz (AI aniqroq javob berishi uchun)
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Sinf</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["10", "11"] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGrade(g)}
                          className={`py-2 text-xs font-semibold rounded-lg border cursor-pointer ${
                            grade === g
                              ? "bg-sky-700 text-white border-sky-700"
                              : "bg-white text-slate-700 border-slate-200"
                          }`}
                        >
                          {g}-sinf
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="chat-subject" className="block text-[11px] font-medium text-slate-500 mb-1">
                      Asosiy qiziqadigan fan
                    </label>
                    <select
                      id="chat-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-700"
                    >
                      {SUBJECT_PATHWAYS.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-900 mb-2">Tezkor savollar:</p>
                <div className="space-y-2">
                  {STARTER_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      disabled={isSending}
                      onClick={() => sendMessage(q)}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 bg-slate-50 hover:bg-sky-50 hover:text-sky-900 border border-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl flex flex-col h-[540px]">
              <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-4">
                <div className="text-xs font-semibold text-slate-900">
                  Aqlli maslahatchi · {grade}-sinf · {subject}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setMessages([
                      {
                        role: "model",
                        text: "Suhbat yangilandi. Qaysi fan, oliygoh, stavka yoki toifa bo'yicha yordam kerak?",
                      },
                    ])
                  }
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Tozalash
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-sky-700 text-white"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 text-slate-600 rounded-xl px-4 py-3 text-xs inline-flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Javob tayyorlanmoqda...
                    </div>
                  </div>
                )}

                {chatError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                    Xatolik: {chatError}
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="p-3.5 border-t border-slate-200 flex items-center gap-2.5"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Savolingizni yozing (masalan: Bakalavr bilan necha soat dars olsam bo'ladi?)..."
                  className="flex-1 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-700"
                />
                <button
                  type="submit"
                  disabled={isSending || !input.trim()}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                >
                  <span>Yuborish</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleGenerateRoadmap}
              className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 space-y-5"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  1. Hozirgi sinfingiz
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["10", "11"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrade(g)}
                      className={`py-2 text-xs font-semibold rounded-lg border cursor-pointer ${
                        grade === g
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      {g}-sinf
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="roadmap-subject" className="block text-xs font-semibold text-slate-800 mb-1.5">
                  2. Asosiy faningiz
                </label>
                <select
                  id="roadmap-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-700"
                >
                  {SUBJECT_PATHWAYS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  3. Oliygoh tanlovi
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "farqi-yoq" as const, label: "AI tanlasin" },
                    { id: "institut" as const, label: "Institut" },
                    { id: "universitet" as const, label: "Universitet" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setInstitutionPref(opt.id)}
                      className={`py-2 px-2 text-xs font-medium rounded-lg border cursor-pointer ${
                        institutionPref === opt.id
                          ? "bg-sky-700 text-white border-sky-700"
                          : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="goal-track" className="block text-xs font-semibold text-slate-800 mb-1.5">
                  4. Qaysi yo'lda ishlashni xohlaysiz?
                </label>
                <select
                  id="goal-track"
                  value={goalTrack}
                  onChange={(e) => setGoalTrack(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-700"
                >
                  <option value="Ta'lim (Maktab, Toifa va Repetitorlik)">
                    Ta'lim (Maktab, Toifa va Repetitorlik)
                  </option>
                  <option value="IT, Data va Dasturlash">IT, Data va Dasturlash</option>
                  <option value="Moliya, Bank va Biznes">Moliya, Bank va Biznes</option>
                  <option value="Muhandislik yoki Tibbiyot">Muhandislik yoki Tibbiyot</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="target-income" className="font-semibold text-slate-800">
                    5. Maqsadli oylik daromad
                  </label>
                  <span className="font-mono font-bold text-emerald-700 tabular-nums">
                    {targetIncome} mln so'm
                  </span>
                </div>
                <input
                  id="target-income"
                  type="range"
                  min={6}
                  max={40}
                  step={1}
                  value={targetIncome}
                  onChange={(e) => setTargetIncome(Number(e.target.value))}
                  className="w-full accent-sky-700 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={isGeneratingRoadmap}
                className="w-full py-3 px-4 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGeneratingRoadmap ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Reja tuzilmoqda...
                  </>
                ) : (
                  "Shaxsiy 5 yillik rejani yaratish"
                )}
              </button>

              {roadmapError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {roadmapError}
                </div>
              )}
            </form>

            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6">
              {!roadmap && !isGeneratingRoadmap && (
                <div className="py-14 text-center max-w-md mx-auto">
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Shaxsiy yo'l xaritangiz shu yerda chiqadi
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    Chap tomondagi sinf, fan va maqsadni tanlab "Shaxsiy 5 yillik rejani yaratish"
                    tugmasini bosing. AI sizga aniq OTM, dars soati va toifa daromad rejasini tuzadi.
                  </p>
                </div>
              )}

              {isGeneratingRoadmap && (
                <div className="py-16 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-sky-700 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-700">
                    {subject} fani bo'yicha 5 bosqichli daromad va ta'lim xaritasi tuzilmoqda...
                  </p>
                </div>
              )}

              {roadmap && !isGeneratingRoadmap && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-slate-200">
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      {roadmap.summaryTitle}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {roadmap.recommendedInstitutionType}
                    </p>
                  </div>

                  {roadmap.recommendedMajors?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 mb-2.5">
                        Tavsiya etiladigan OTM yo'nalishlari
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {roadmap.recommendedMajors.map((maj, i) => (
                          <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                            <div className="text-xs font-bold text-slate-900">{maj.name}</div>
                            <div className="mt-1 text-[11px] text-sky-800">{maj.institutionExample}</div>
                            <div className="mt-1.5 text-[11px] text-slate-500">{maj.examSubjects}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 mb-3">
                      5 bosqichli rivojlanish va daromad jadvali
                    </h4>
                    <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
                      {roadmap.stages?.map((st, idx) => (
                        <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-mono font-bold text-sky-700 tabular-nums">
                                0{idx + 1}.
                              </span>
                              <span className="font-bold text-slate-900">{st.stageLabel}</span>
                              <span className="text-slate-400">·</span>
                              <span className="text-slate-500">{st.timeframe}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{st.actions}</p>
                            <p className="text-[11px] text-slate-500">Yuklama: {st.hoursOrWorkload}</p>
                          </div>
                          <div className="font-mono text-xs font-bold text-emerald-700 tabular-nums shrink-0 sm:text-right">
                            {st.expectedMonthlyIncome}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-lg text-xs text-slate-700 leading-relaxed">
                    <strong className="font-semibold text-slate-900">
                      Toifa va daromadni oshirish strategiyasi:
                    </strong>{" "}
                    {roadmap.toifaAndGrowthNote}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
