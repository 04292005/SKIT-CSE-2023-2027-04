import { NextRequest, NextResponse } from "next/server";
import { analyzeMedia } from "@/ai/agents/vision";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { mediaBase64, mimeType } = body;

    if (!mediaBase64 || !mimeType) {
      return NextResponse.json(
        { error: "Missing mediaBase64 or mimeType." },
        { status: 400 }
      );
    }

    const analysis = await analyzeMedia({
      mediaBase64,
      mimeType,
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "AI analysis failed.",
      },
      {
        status: 500,
      }
    );
  }
}