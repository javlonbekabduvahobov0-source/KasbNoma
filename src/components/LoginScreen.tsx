import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { ArrowRight, BookOpen, Calculator, CheckCircle2, FileCheck2, Loader2 } from "lucide-react";

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleLogin() {
    if (isLoading) return;
    setError(null);
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Tizimga kirishda xatolik yuz berdi.";
      if (msg.includes("popup-closed-by-user")) {
        setError("Kirish oynasi yopildi. Davom etish uchun Google hisobingizni tanlang.");
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="font-display text-lg font-bold tracking-tight text-slate-900">
            KasbNoma
          </span>
          <span className="text-xs text-slate-500">10–11-sinf o'quvchilari platformasi</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-sky-700 mb-2">
                O'zbekiston ta'lim va kasb platformasi
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-wrap-balance">
                Kelajak kasbingiz, daromadingiz va OTM test natijalaringiz bir dasturda
              </h1>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Tizimga kirganingizdan so'ng barcha 8 ta asosiy fan bo'yicha to'liq ma'lumotlar, OTM
                (UZBMB) demo testlari, stavka va toifa oylik kalkulyatori hamda shaxsiy AI maslahatchi
                kabinetingiz ochiladi.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <BookOpen className="w-4 h-4 text-sky-700 mb-2" />
                  <h2 className="text-xs font-bold text-slate-900">Har bir fan ma'lumoti</h2>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Fanning kelajagi, qiziqarli faktlar, Institut vs Universitet va daromad jadvali.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <FileCheck2 className="w-4 h-4 text-emerald-700 mb-2" />
                  <h2 className="text-xs font-bold text-slate-900">OTM Demo Testlari</h2>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Har bir fanni tanlab darhol UZBMB testini ishlash va natijalarni saqlab borish.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <Calculator className="w-4 h-4 text-sky-700 mb-2" />
                  <h2 className="text-xs font-bold text-slate-900">Stavka va Toifa hisobi</h2>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Bakalavrdan Oliy toifagacha dars soatlari (20–30 soat) va real oylik simulyatori.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 mb-2" />
                  <h2 className="text-xs font-bold text-slate-900">Shaxsiy kabinet va AI</h2>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Test natijalaringiz saqlanadi, AI sizga mos 5 yillik kasb rejasini tuzadi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900">
                Dasturga kirish
              </h2>
              <p className="mt-1.5 text-sm text-slate-600">
                O'quvchi kabinetiga kirish va test natijalarini saqlash uchun hisobingiz bilan kiring.
              </p>

              <div className="mt-6 space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-sky-700 hover:bg-sky-800 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer min-h-[46px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Kirilmoqda...</span>
                    </>
                  ) : (
                    <>
                      <span>Google hisobi bilan kirish</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 leading-relaxed">
                    {error}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Kirgandan keyin nimalar ochiladi?</p>
                <ul className="space-y-1.5">
                  <li>· 10 yoki 11-sinf shaxsiy o'quvchi profili</li>
                  <li>· 8 ta fan bo'yicha interaktiv OTM demo testlari</li>
                  <li>· AI yordamida cheksiz yangi test savollari yaratish</li>
                  <li>· Saqlanadigan ballar tarixi va 5 yillik kasb rejasi</li>
                </ul>
              </div>
            </div>

            <p className="mt-6 text-[11px] text-slate-400">
              Ma'lumotlaringiz faqat shaxsiy kabinetingizda xavfsiz saqlanadi.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
