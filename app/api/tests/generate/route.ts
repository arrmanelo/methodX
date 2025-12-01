// app/api/tests/generate/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffle<T>(array: T[]): T[] {
  return array
    .map((value: T) => ({ value, sort: Math.random() }))
    .sort((a: { value: T; sort: number }, b: { value: T; sort: number }) => a.sort - b.sort)
    .map((item: { value: T; sort: number }) => item.value);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { lectureText?: string; count?: number };
    const lectureText = body.lectureText;
    const count = body.count ?? 5;

    if (!lectureText || typeof lectureText !== "string") {
      return NextResponse.json({ error: "lectureText required" }, { status: 400 });
    }

    const prompt = `
Составь ${count} вопросов multiple-choice (4 варианта) по следующему тексту лекции.
Верни ТОЛЬКО строго корректный JSON — массив объектов. Пример:
[
 {"question": "Вопрос ...", "options": ["A","B","C","D"], "correct_answer": "текст правильного варианта", "explanation": "кратко почему"}
]
Каждый объект: question (строка), options (массив 4 строк), correct_answer (строка — совпадает с одним из options), explanation (строка).
Текст лекции:
${lectureText}
`;

    const resp = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    // От API может прийти текст с обёртками — аккуратно извлечём текст
    const raw = (resp as any).output_text ?? JSON.stringify((resp as any).output) ?? "";

    // Попробуем вырезать JSON-массив между [ ... ]
    let jsonText = raw;
    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]");
    if (start !== -1 && end !== -1 && end > start) {
      jsonText = raw.slice(start, end + 1);
    }

    let items: any[] = [];
    try {
      items = JSON.parse(jsonText);
      if (!Array.isArray(items)) throw new Error("parsed not array");
    } catch (err) {
      console.error("Failed to parse model output:", err, "raw:", raw);
      return NextResponse.json({ error: "failed to parse model output", raw }, { status: 500 });
    }

    // Преобразуем: убедимся, что у каждого 4 опции; найдем индекс правильного; перемешаем
    const questions = items.map((it: any, idx: number) => {
      const qText: string = String(it.question ?? `Вопрос ${idx + 1}`);
      const optsRaw = it.options && Array.isArray(it.options) ? it.options : [];
      const opts: string[] = optsRaw.map((x: unknown) => String(x)).slice(0, 4);

      // если меньше 4 — заполним пустыми уникальными заглушками
      const optsCopy: string[] = [...opts];
      while (optsCopy.length < 4) optsCopy.push(`Вариант ${optsCopy.length + 1}`);

      const correctText = String(it.correct_answer ?? it.correct ?? "").trim();
      let correctIndex = optsCopy.findIndex((o: string) => o.trim() === correctText);

      if (correctIndex === -1) {
        // может модель вернула букву
        const letter = correctText.trim().toUpperCase();
        if (letter === "A") correctIndex = 0;
        if (letter === "B") correctIndex = 1;
        if (letter === "C") correctIndex = 2;
        if (letter === "D") correctIndex = 3;
      }
      if (correctIndex === -1) correctIndex = 0;

      // перемешиваем и пересчитываем индекс (исправлено под TypeScript)
      const indexed: { v: string; origIndex: number }[] = optsCopy.map(
        (v: string, i: number) => ({ v, origIndex: i })
      );

      const shuffled = shuffleArray<{ v: string; origIndex: number }>(indexed);

      const newOptions = shuffled.map((s: { v: string }) => s.v);

      const newIndex = shuffled.findIndex(
        (s: { origIndex: number }) => s.origIndex === correctIndex
      );

      return {
        question: qText,
        options: newOptions,
        correctIndex: newIndex >= 0 ? newIndex : 0,
        explanation: String(it.explanation ?? ""),
      };
    });

    return NextResponse.json({ questions });
  } catch (err) {
    console.error("Generate error", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
