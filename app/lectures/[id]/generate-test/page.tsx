'use client'

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getLecture } from "@/app/actions/lectures"; // у тебя есть
// NOTE: ранее были server actions — теперь мы используем API routes
// поэтому импортировать generateTestFromLecture нельзя в client

type Question = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export default function GenerateTestPage() {
  const params = useParams();
  const id = params?.id as string;

  const [lecture, setLecture] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState<Question[] | null>(null);

  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getLecture(id);
      setLecture(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div style={{ padding: 16 }}>Загрузка...</div>;
  if (!lecture) return <div style={{ padding: 16 }}>Лекция не найдена</div>;

  const lectureText =
    lecture.content ||
    lecture.text ||
    lecture.body ||
    lecture.description ||
    "";

  async function generate() {
    setChecked(false);
    setQuestions(null);
    setSelectedAnswers([]);
    try {
      const res = await fetch("/api/tests/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lectureText, count }),
      });
      const data = await res.json();
      if (data?.questions) {
        setQuestions(data.questions);
        setSelectedAnswers(Array(data.questions.length).fill(-1));
      } else {
        alert("Ошибка генерации: " + JSON.stringify(data));
      }
    } catch (e) {
      console.error(e);
      alert("Ошибка генерации (проверь сервер).");
    }
  }

  function chooseAnswer(qi: number, oi: number) {
    if (checked) return; // после проверки нельзя менять
    const copy = [...selectedAnswers];
    copy[qi] = oi;
    setSelectedAnswers(copy);
  }

  function checkAnswers() {
    setChecked(true);
  }

  async function saveTest() {
    if (!questions) return;
    setSaving(true);
    try {
      const res = await fetch("/api/tests/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lectureId: id, questions }),
      });
      const data = await res.json();
      if (data?.success) {
        alert("Тест сохранён (id: " + (data.test?.id ?? "unknown") + ")");
      } else {
        alert("Ошибка при сохранении: " + JSON.stringify(data));
      }
    } catch (e) {
      console.error(e);
      alert("Ошибка при сохранении (сервер).");
    } finally {
      setSaving(false);
    }
  }

  // ---------- inline styles ----------
  const containerStyle: React.CSSProperties = { padding: 20, maxWidth: 900, margin: "0 auto", fontFamily: "Arial, sans-serif" };
  const headerStyle: React.CSSProperties = { fontSize: 26, fontWeight: 700, marginBottom: 12 };
  const panelStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, marginBottom: 18 };
  const inputStyle: React.CSSProperties = { padding: "6px 8px", border: "1px solid #bbb", borderRadius: 6, width: 68 };
  const btnStyle: React.CSSProperties = { padding: "8px 12px", borderRadius: 6, border: "none", cursor: "pointer" };
  const genBtnStyle: React.CSSProperties = { ...btnStyle, background: "#2b6cb0", color: "white" };
  const cardStyle: React.CSSProperties = { background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.06)", border: "1px solid #e6e6e6" };
  const optionBase: React.CSSProperties = { display: "block", width: "100%", padding: 10, textAlign: "left", borderRadius: 6, border: "1px solid #d0d0d0", background: "#fafafa", cursor: "pointer" };
  const checkBtnStyle: React.CSSProperties = { ...btnStyle, background: "#169e16", color: "white", width: "100%", marginTop: 12 };
  const saveBtnStyle: React.CSSProperties = { ...btnStyle, background: "#ff8c00", color: "white", width: "100%", marginTop: 12 };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>Генерация теста</div>

      <div style={panelStyle}>
        <label style={{ fontWeight: 600 }}>Количество вопросов:</label>
        <input
          type="number"
          value={count}
          min={1}
          max={20}
          onChange={(e) => setCount(Number(e.target.value))}
          style={inputStyle}
        />
        <button style={genBtnStyle} onClick={generate}>Генерировать</button>
      </div>

      {questions && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {questions.map((q, qi) => {
            const selected = selectedAnswers[qi];
            return (
              <div key={qi} style={cardStyle}>
                <div style={{ fontWeight: 700, marginBottom: 10 }}>{qi + 1}. {q.question}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {q.options.map((opt, oi) => {
                    // classless color logic
                    let bg = "#fafafa";
                    let border = "#d0d0d0";
                    if (!checked) {
                      if (selected === oi) { bg = "#e6f0ff"; border = "#2b6cb0"; }
                    } else {
                      if (oi === q.correctIndex) {
                        bg = "#e6ffed"; border = "#22a55a";
                      } else if (selected === oi && selected !== q.correctIndex) {
                        bg = "#ffecec"; border = "#d64545";
                      } else {
                        bg = "#fafafa";
                      }
                    }

                    return (
                      <button
                        key={oi}
                        onClick={() => chooseAnswer(qi, oi)}
                        style={{ ...optionBase, background: bg, border: `1px solid ${border}` }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {checked && q.explanation && (
                  <div style={{ marginTop: 10, padding: 10, background: "#f7f7f7", borderRadius: 6, fontSize: 13 }}>
                    <strong>Объяснение:</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}

          {!checked ? (
            <button style={checkBtnStyle} onClick={checkAnswers}>Проверить ответы</button>
          ) : (
            <button style={saveBtnStyle} onClick={saveTest} disabled={saving}>
              {saving ? "Сохранение..." : "Сохранить тест"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
