// app/api/tests/save/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { lectureId, questions } = await req.json();

    if (!lectureId || !questions) {
      return NextResponse.json({ error: "lectureId and questions required" }, { status: 400 });
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SERVICE_KEY) {
      console.error("Missing supabase env keys");
      return NextResponse.json({ error: "server configuration error" }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase
      .from("tests")
      .insert({
        lecture_id: lectureId,
        questions,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, test: data });
  } catch (err) {
    console.error("Save test error", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
