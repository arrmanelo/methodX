'use server'

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Интерфейс вопроса
export interface TestQuestion {
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

export async function generateTestFromLecture(
  lectureText: string,
  count: number = 5
): Promise<TestQuestion[]> {
  const prompt = `
Проанализируй лекцию и создай ${count} тестовых вопросов.
Формат строго JSON массива:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correct": "A",
    "explanation": "..."
  }
]

ЛЕКЦИЯ:
${lectureText}
  `;

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });

  // получаем чистый текст
  const text = response.output_text;

  // парсим JSON
  return JSON.parse(text);
}
