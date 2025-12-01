// app/actions/ai-tests.ts
'use server'

import OpenAI from "openai"

export interface TestQuestion {
  question: string
  options: string[]
  correctIndex: number
}

export async function generateTestFromLecture(text: string, count: number): Promise<TestQuestion[]> {
  const openai = new OpenAI()  

  const prompt = `
Ты — генератор тестов. Составь ${count} вопросов multiple-choice из лекции ниже.
Формат строго JSON массива:
[
  {
    "question": "строка",
    "options": ["A", "B", "C", "D"],
    "correctIndex": число от 0 до 3
  }
]

Важно: правильный ответ НЕ всегда должен быть первым. Делай random correctIndex.
Лекция:
${text}
`

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: prompt
  })

  const raw = response.output_text
  const json = JSON.parse(raw)

  const shuffle = (arr: any[]) => arr.sort(() => Math.random() - 0.5)

  return json.map((q: TestQuestion) => {
    const options = shuffle([...q.options])
    const correctOption = q.options[q.correctIndex]
    const newCorrectIndex = options.indexOf(correctOption)

    return {
      question: q.question,
      options,
      correctIndex: newCorrectIndex
    }
  })
}
