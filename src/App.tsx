import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "./firebase";
import LoginScreen from "./components/LoginScreen";
import SubjectsWorkspace from "./components/SubjectsWorkspace";
import OtmDemoTestView from "./components/OtmDemoTestView";
import SalaryCalculator from "./components/SalaryCalculator";
import InstVsUniSection from "./components/InstVsUniSection";
import VacanciesSection from "./components/VacanciesSection";
import SmartAdvisorSection from "./components/SmartAdvisorSection";
import { SUBJECT_PATHWAYS, VacancyItem } from "./data/careerData";
import {
  BookOpen,
  Briefcase,
  Building2,
  Calculator,
  FileCheck2,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  X,
} from "lucide-react";

type WorkspaceTab =
  | "subjects"
  | "tests"
  | "salary"
  | "institutions"
  | "vacancies"
  | "advisor";

interface UserProfileDoc {
  uid: string;
  displayName: string;
  email: string;
  grade: "10" | "11";
  favoriteSubjectId: string;
}

const MENU_ITEMS: Array<{ id: WorkspaceTab; label: string; icon: typeof BookOpen }> = [
  { id: "subjects", label: "Fanlar katalogi", icon: BookOpen },
  { id: "tests", label: "OTM Demo Testlar", icon: FileCheck2 },
  { id: "salary", label: "Oylik va Toifa", icon: Calculator },
  { id: "institutions", label: "Institut vs Universitet", icon: Building2 },
  { id: "vacancies", label: "Vakansiyalar", icon: Briefcase },
  { id: "advisor", label: "AI Maslahatchi", icon: MessageSquare },
];

export default function App() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfileDoc | null>(null);

  const [activeModule, setActiveModule] = useState<WorkspaceTab>("subjects");
  const [testSubjectId, setTestSubjectId] = useState<string>("matematika");
  const [advisorPrompt, setAdvisorPrompt] = useState<string | null>(null);
  const [advisorTab, setAdvisorTab] = useState<"chat" | "roadmap">("chat");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!authUser) {
      setProfile(null);
      return;
    }

    const userPath = `users/${authUser.uid}`;
    const userRef = doc(db, "users", authUser.uid);

    const unsub = onSnapshot(
      userRef,
      async (snap) => {
        if (snap.exists()) {
          const data = snap.data() as UserProfileDoc;
          setProfile(data);
          setTestSubjectId(data.favoriteSubjectId || "matematika");
        } else {
          const cleanName = (authUser.displayName || "O'quvchi").slice(0, 120);
          const cleanEmail = (authUser.email || "user@kasbnoma.uz").slice(0, 200);
          try {
            await setDoc(userRef, {
              uid: authUser.uid,
              displayName: cleanName,
              email: cleanEmail,
              grade: "11",
              favoriteSubjectId: "matematika",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, userPath);
          }
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, userPath);
      }
    );

    return () => unsub();
  }, [authUser]);

  async function handleUpdateGrade(newGrade: "10" | "11") {
    if (!authUser || !profile) return;
    const path = `users/${authUser.uid}`;
    try {
      await updateDoc(doc(db, "users", authUser.uid), {
        displayName: profile.displayName,
        grade: newGrade,
        favoriteSubjectId: profile.favoriteSubjectId,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  async function handleSetFavoriteSubject(subjectId: string) {
    if (!authUser || !profile) return;
    const path = `users/${authUser.uid}`;
    try {
      await updateDoc(doc(db, "users", authUser.uid), {
        displayName: profile.displayName,
        grade: profile.grade,
        favoriteSubjectId: subjectId.slice(0, 64),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  function handleStartDemoTest(subjectId: string) {
    setTestSubjectId(subjectId);
    setActiveModule("tests");
    setSidebarOpen(false);
  }

  function handleAskQuestion(question: string) {
    setAdvisorTab("chat");
    setAdvisorPrompt(question);
    setActiveModule("advisor");
    setSidebarOpen(false);
  }

  function handlePrepareForVacancy(vac: VacancyItem) {
    const prompt = `Men ${profile?.grade || "11"}-sinf o'quvchisiman. "${vac.title}" (${vac.employer}, oyligi ${vac.salaryMin}–${vac.salaryMax} mln so'm) vakansiyasiga mos mutaxassis bo'lish uchun qaysi OTM (Institut yoki Universitet) ga kirishim kerak va bakalavr hamda toifa/ko'nikma bosqichlarim qanday bo'lishi lozim?`;
    handleAskQuestion(prompt);
  }

  if (!authReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="inline-flex items-center gap-2.5 text-sm font-medium text-slate-600">
          <Loader2 className="w-5 h-5 animate-spin text-sky-700" />
          <span>KasbNoma yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return <LoginScreen />;
  }

  const activeMenuItem = MENU_ITEMS.find((m) => m.id === activeModule) || MENU_ITEMS[0];
  const favSubjectName =
    SUBJECT_PATHWAYS.find((s) => s.id === (profile?.favoriteSubjectId || "matematika"))?.name ||
    "Matematika";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between px-2 pt-1">
            <span className="font-display text-lg font-bold tracking-tight text-slate-900">
              KasbNoma
            </span>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Menyuni yopish"
              className="lg:hidden p-1.5 text-slate-500 hover:text-slate-900 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-1">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveModule(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? "bg-sky-700 text-white"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-slate-200 px-1 space-y-2.5">
            <div className="text-[11px] font-semibold text-slate-500">Sinfingiz</div>
            <div className="grid grid-cols-2 gap-1.5">
              {(["10", "11"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleUpdateGrade(g)}
                  className={`py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                    (profile?.grade || "11") === g
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {g}-sinf
                </button>
              ))}
            </div>
            <div className="text-[11px] text-slate-500 pt-1">
              Asosiy fan: <strong className="text-slate-800">{favSubjectName}</strong>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 space-y-3">
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">
              {profile?.displayName || authUser.displayName || "O'quvchi"}
            </div>
            <div className="text-[11px] text-slate-500 truncate">{authUser.email}</div>
          </div>
          <button
            type="button"
            onClick={() => signOut(auth)}
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Dasturdan chiqish</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Menyuni ochish"
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs sm:text-sm font-medium text-slate-500 truncate">
              <span>KasbNoma</span>
              <span className="mx-2 text-slate-300">/</span>
              <span className="font-semibold text-slate-900">{activeMenuItem.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleStartDemoTest(profile?.favoriteSubjectId || "matematika")}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              OTM Demo Test
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeModule === "subjects" && (
            <SubjectsWorkspace
              favoriteSubjectId={profile?.favoriteSubjectId || "matematika"}
              onSetFavoriteSubject={handleSetFavoriteSubject}
              onStartDemoTest={handleStartDemoTest}
              onAskAiAboutSubject={(subjName) =>
                handleAskQuestion(
                  `${subjName} fanini chuqur o'qisam kim bo'lishim mumkin? Bakalavr va magistratura farqi, dars soati (stavka), toifa oyliklari va bozor imkoniyatlarini tushuntirib ber.`
                )
              }
            />
          )}

          {activeModule === "tests" && (
            <OtmDemoTestView initialSubjectId={testSubjectId} />
          )}

          {activeModule === "salary" && <SalaryCalculator />}

          {activeModule === "institutions" && <InstVsUniSection />}

          {activeModule === "vacancies" && (
            <VacanciesSection onPrepareForVacancy={handlePrepareForVacancy} />
          )}

          {activeModule === "advisor" && (
            <SmartAdvisorSection
              externalPrompt={advisorPrompt}
              onClearExternalPrompt={() => setAdvisorPrompt(null)}
              activeTab={advisorTab}
              onChangeTab={setAdvisorTab}
            />
          )}
        </main>
      </div>
    </div>
  );
}
