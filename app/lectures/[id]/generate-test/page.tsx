'use client'

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getLecture } from "@/app/actions/lectures"
import { generateTestFromLecture, type TestQuestion } from "@/app/actions/ai-tests"

export default function GenerateTestPage() {
  const params = useParams()
  const id = params.id as string

  const [lecture, setLecture] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(5)
  const [questions, setQuestions] = useState<TestQuestion[] | null>(null)

  useEffect(() => {
    async function load() {
      const data = await getLecture(id)
      setLecture(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div>Загрузка...</div>

  if (!lecture) return <div>Лекция не найдена</div>

  // 👉 ВАЖНО: выбираем правильное поле где хранится текст лекции
  const lectureText =
    lecture.text ||
    lecture.content ||
    lecture.body ||
    lecture.description ||
    lecture.material ||
    lecture.lecture_text ||
    ""

  if (!lectureText) {
    return <div>В лекции нет текста для генерации теста.</div>
  }

  async function generate() {
    const result = await generateTestFromLecture(lectureText, count)
    setQuestions(result)
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Генерация теста</h1>

      <label>Количество вопросов:</label>
      <input
        type="number"
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        className="border p-2"
      />

      <button
        onClick={generate}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Сгенерировать
      </button>

      {questions && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Результат</h2>
          <pre>{JSON.stringify(questions, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
