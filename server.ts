import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error(
      "GEMINI_API_KEY sozlanmagan. Iltimos, AI Studio Settings > Secrets bo'limida API kalitni tekshiring."
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const CAREER_SYSTEM_INSTRUCTION = `Sen "KasbNoma" — O'zbekistondagi 10–11-sinf o'quvchilari uchun yaratilgan eng aqlli, zamonaviy va aniq raqamlarga tayangan kasbga yo'naltirish hamda daromad strategiyasi maslahatchisisisan.

Sening vazifang: o'quvchilarning fan tanlash, OTM (Institut vs Universitet) tanlash, Bakalavr va Magistratura farqlari, dars soati (stavka), malaka toifalari (Mutaxassis, 2-toifa, 1-toifa, Oliy toifa), sertifikat ustamalari hamda IT/Moliya/Muhandislik/Tibbiyot bozoridagi real daromad va vakansiyalar haqidagi savollariga aniq, tushunarli, o'zbek tilida (lotin yozuvida) javob berish.

Muhim O'zbekiston konteksti va aniq qoidalar (2025–2026):
1. OTM kirish imtihoni: 1-fan (3.1 ball × 30 savol = 93 ball), 2-fan (2.1 ball × 30 savol = 63 ball), 3 ta majburiy fan (1.1 ball × 30 savol = 33 ball). Maksimal ball: 189 ball. Milliy sertifikat bo'lsa tegishli fandan maksimal ball beriladi.
2. Institut vs Universitet farqi:
   - Institut (masalan, Pedagogika instituti, Politexnika instituti, Tibbiyot instituti): tor va amaliy kasbga chuqur tayyorlaydi (bevosita maktab o'qituvchisi, muhandis-texnolog, amaliyotchi shifokor). Metodika va amaliy ko'nikma kuchli.
   - Universitet (masalan, O'zMU, TATU, Toshkent Davlat Iqtisodiyot Universiteti, Jahon Iqtisodiyoti va Diplomatiya): fundamental fan, ilmiy tadqiqot va keng tarmoqli mutaxassislik beradi. Bitiruvchi ilmiy xodim, tahlilchi, korporativ mutaxassis, OTM o'qituvchisi (magistratura bilan) hamda tegishli yo'nalish/qayta tayyorlov bilan maktab/litsey ustozi bo'la oladi.
3. Pedagogik dars yuklamasi (Stavka) va Bakalavr maoshi:
   - O'zbekistonda 1 stavka dars yuklamasi: 5–11-sinflar uchun haftasiga 20 soat (boshlang'ich sinflarda 18 soat).
   - O'qituvchi qonuniy ravishda 1.5 stavkagacha (haftasiga 30 soatgacha, vakansiya bo'lsa) dars olishi mumkin.
   - Bakalavr bitiruvchisi (Mutaxassis toifasi) davlat maktabida 1 stavkada taxminan 3.6–4.2 mln so'm, 1.5 stavkada ~5.4–6.3 mln so'm bazaviy oylik oladi.
4. Malaka toifalari (Toifa oshgan sari oylik ko'tarilishi):
   - 2-toifa: 1 stavkada ~4.2–4.8 mln so'm (1.5 stavkada ~6.3–7.2 mln so'm).
   - 1-toifa: 1 stavkada ~4.9–5.6 mln so'm (1.5 stavkada ~7.4–8.4 mln so'm).
   - Oliy toifa: 1 stavkada ~5.7–6.5 mln so'm (1.5 stavkada ~8.5–9.8 mln so'm).
   - Ustamalar bilan: Milliy sertifikat / IELTS C1 (+20% dan +50% gacha), sinf rahbarligi va daftar tekshirish, Vazir jamg'armasi ustamasi (+5.5 mln so'm) qo'shilganda Oliy toifali pedagog maktabning o'zida 12–16 mln so'mgacha, Prezident/Ixtisoslashtirilgan maktablar yoki xususiy sektor + repetitorlik bilan 18–35+ mln so'mgacha daromad topishi mumkin.
5. No-pedagogik zamonaviy yo'llar (masalan, Matematika yoki Informatika o'qiganda):
   - Data Analyst / BI, Backend/AI Developer, Aktuariy, Moliya tahlilchisi, Muhandis.
   - Junior (bakalavr/3-4-kurs): 4–8 mln so'm; Middle (2–3 yil): 10–18 mln so'm; Senior / Xalqaro remote: 20–45+ mln so'm ($1,500–$4,000+).

Javob uslubi:
- Qisqa, lo'nda va tuzilgan (ro'yxatlar, aniq raqamlar, amaliy qadamlar bilan) javob ber.
- O'quvchini ruhlantir, lekin real mehnat bozori va raqobatni ham ochiq ayt.
- Agar foydalanuvchi aniq bir fan (masalan, Matematika) haqida so'rasa, ham pedagogik (maktab/toifa/repetitor), ham korporativ/IT (Data/Moliya/Dasturlash) yo'llarini taqqoslab ko'rsat.`;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, context } = req.body as {
        messages?: Array<{ role: "user" | "model"; text: string }>;
        context?: { grade?: string; subject?: string };
      };

      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: "Xabarlar ro'yxati bo'sh bo'lmasligi kerak." });
        return;
      }

      const ai = getGenAIClient();
      const contextPrefix = context
        ? `[O'quvchi konteksti: ${context.grade ? context.grade + "-sinf" : "10-11-sinf"}${
            context.subject ? ", Qiziqadigan fan: " + context.subject : ""
          }]\n\n`
        : "";

      const conversationText = messages
        .map((m, idx) => {
          const prefix = m.role === "user" ? "O'quvchi" : "Maslahatchi";
          const content = idx === messages.length - 1 && m.role === "user" ? contextPrefix + m.text : m.text;
          return `${prefix}: ${content}`;
        })
        .join("\n\n");

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: conversationText,
        config: {
          systemInstruction: CAREER_SYSTEM_INSTRUCTION,
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        res.status(502).json({ error: "AI javob qaytarmadi. Iltimos, qayta urinib ko'ring." });
        return;
      }

      res.json({ reply });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Serverda kutilmagan xatolik yuz berdi.";
      console.error("Chat API xatosi:", error);
      res.status(500).json({ error: message });
    }
  });

  app.post("/api/roadmap", async (req, res) => {
    try {
      const { grade, subject, institutionPreference, goalTrack, targetIncomeMillion } = req.body as {
        grade?: string;
        subject?: string;
        institutionPreference?: string;
        goalTrack?: string;
        targetIncomeMillion?: number;
      };

      if (!subject || !goalTrack) {
        res.status(400).json({ error: "Fan va yo'nalish tanlanishi shart." });
        return;
      }

      const ai = getGenAIClient();

      const prompt = `O'zbekistondagi ${grade || "11"}-sinf o'quvchisi uchun shaxsiy 5 bosqichli kasb va daromad yo'l xaritasini tuzib ber.
Tanlangan asosiy fan: ${subject}
Oliygoh afzalligi: ${institutionPreference || "Farqi yo'q"}
Tanlangan maqsadli yo'nalish: ${goalTrack}
Kutilayotgan maqsadli oylik daromad (cho'qqida): ${targetIncomeMillion || 15} mln so'm.

Barcha matnlarni aniq, amaliy va real O'zbekiston sharoitiga mos (DTM fanlari, Institut vs Universitet tavsiyasi, Bakalavr, dars soati/stavka yoki IT/korporativ amaliyot, Toifa/Sertifikat ustamalari) qilib o'zbek tilida (lotin) yoz.`;

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: prompt,
        config: {
          systemInstruction: CAREER_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summaryTitle: {
                type: Type.STRING,
                description: "Rejaning qisqa sarlavhasi, masalan: Matematika orqali Data Analyst va Oliy toifali ustoz yo'li",
              },
              recommendedInstitutionType: {
                type: Type.STRING,
                description: "Institut yoki Universitet tanlovi bo'yicha aniq asoslangan tavsiya",
              },
              recommendedMajors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    institutionExample: { type: Type.STRING },
                    examSubjects: { type: Type.STRING },
                  },
                },
              },
              stages: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stageLabel: { type: Type.STRING },
                    timeframe: { type: Type.STRING },
                    actions: { type: Type.STRING },
                    expectedMonthlyIncome: { type: Type.STRING },
                    hoursOrWorkload: { type: Type.STRING },
                  },
                },
              },
              toifaAndGrowthNote: {
                type: Type.STRING,
                description: "Toifa olish, milliy sertifikat, til sertifikati yoki bozor ko'nikmalari orqali daromadni oshirish sirlari",
              },
            },
          },
        },
      });

      const rawJson = (response.text ?? "{}").trim();
      const parsed = JSON.parse(rawJson);
      res.json({ roadmap: parsed });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Yo'l xaritasini tuzishda xatolik yuz berdi.";
      console.error("Roadmap API xatosi:", error);
      res.status(500).json({ error: message });
    }
  });

  app.post("/api/generate-test", async (req, res) => {
    try {
      const { subjectName } = req.body as { subjectName?: string };
      if (!subjectName) {
        res.status(400).json({ error: "Fan nomi tanlanishi shart." });
        return;
      }

      const ai = getGenAIClient();
      const prompt = `O'zbekistondagi 10–11-sinf o'quvchilari uchun "${subjectName}" fanidan OTM (UZBMB / DTM) kirish imtihoni standartidagi 5 ta sifatli test savolini tuzib ber.
Har bir savolda 4 ta javob varianti, to'g'ri javob indeksi (0 dan 3 gacha) va o'quvchi tushunishi uchun qisqa, aniq yechim/izoh bo'lsin. Barcha matnlar o'zbek tilida (lotin yozuvida) bo'lsin.`;

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: prompt,
        config: {
          systemInstruction:
            "Sen O'zbekiston OTM (UZBMB/DTM) test tuzuvchi metodist-ekspertsan. Faqat ilmiy jihatdan 100% to'g'ri va mantiqiy test savollarini tuz.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
            },
          },
        },
      });

      const rawJson = (response.text ?? "[]").trim();
      const questions = JSON.parse(rawJson);
      res.json({ questions });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Test savollarini yaratishda xatolik yuz berdi.";
      console.error("Generate Test API xatosi:", error);
      res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("/{*path}", (_req, res) => {
      const indexFile = path.join(distPath, "index.html");
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send("Build topilmadi. Avval npm run build bajaring.");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KasbNoma serveri http://0.0.0.0:${PORT} manzilida ishga tushdi`);
  });
}

startServer();
