import { NextResponse } from 'next/server';
import type { Card, CardType, SpicyLevel, GameMode } from '@/lib/game-data';

const VALID_TYPES: CardType[] = ['truth', 'dare', 'do'];
const VALID_LEVELS: SpicyLevel[] = ['chill', 'spicy', 'wild'];

function buildSystemPrompt(mode: GameMode, spicyLevel: SpicyLevel): string {
  const typeRules =
    mode === 'classic'
      ? 'Chỉ dùng type "truth" và "dare". KHÔNG dùng type "do".'
      : 'Chỉ dùng type "dare" và "do". KHÔNG dùng type "truth".';

  const levelDesc: Record<SpicyLevel, string> = {
    chill: 'vui vẻ, nhẹ nhàng, phù hợp mọi người',
    spicy: 'hơi táo bạo, gây cười, có thể hơi embarrassing',
    wild: 'rất táo bạo, 18+, không ngại ngùng',
  };

  return `Bạn là game master tạo câu hỏi và thách thức cho game Truth or Dare bằng tiếng Việt.

Quy tắc type: ${typeRules}
Mức độ: ${spicyLevel} — ${levelDesc[spicyLevel]}.

Định nghĩa:
- "truth": câu hỏi buộc người chơi phải thú nhận sự thật
- "dare": thách thức người chơi phải làm một việc gì đó
- "do": câu kiểu "uống nếu bạn từng..." hoặc "ai từng... thì uống"

Mỗi thẻ phải có "punishment" — hình phạt nếu từ chối (ví dụ: "Uống 2 shot", "Hít đất 15 cái").

Tất cả nội dung bằng tiếng Việt, sáng tạo, phù hợp với nhóm người chơi được mô tả.

Trả về JSON array thuần túy, KHÔNG có markdown hay text thêm. Format:
[{"type":"...","content":"...","spicyLevel":"...","punishment":"..."}]`;
}

function buildUserPrompt(context: string, spicyLevel: SpicyLevel, count: number): string {
  return `Mô tả nhóm chơi: ${context}

Tạo ${count} thẻ phù hợp với nhóm này. SpicyLevel của tất cả thẻ phải là "${spicyLevel}".
Tận dụng context về nhóm để tạo câu hỏi/thách thức cá nhân hóa, thú vị và liên quan đến họ.`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { context, mode, spicyLevel, count = 15 } = body as {
      context: string;
      mode: GameMode;
      spicyLevel: SpicyLevel;
      count?: number;
    };

    if (!context?.trim()) {
      console.error('[cards/generate] Missing required context in request body');
      return NextResponse.json({ error: 'context is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('[cards/generate] OPENROUTER_API_KEY is not configured');
      return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://spill-it.vercel.app',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: buildSystemPrompt(mode, spicyLevel) },
          { role: 'user', content: buildUserPrompt(context, spicyLevel, count) },
        ],
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[cards/generate] OpenRouter request failed', {
        status: response.status,
        statusText: response.statusText,
        mode,
        spicyLevel,
        count,
        responseBody: err,
      });
      return NextResponse.json({ error: err }, { status: 502 });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? '[]';

    let parsed: unknown[];
    try {
      // Extract the first JSON array found in the response (handles markdown, thinking tags, wrapped objects)
      const match = raw.match(/\[[\s\S]*\]/);
      if (!match) throw new Error('No JSON array found');
      parsed = JSON.parse(match[0]);
      if (!Array.isArray(parsed)) throw new Error('Not an array');
    } catch (error) {
      console.error('[cards/generate] Failed to parse LLM response', {
        mode,
        spicyLevel,
        count,
        rawPreview: raw.slice(0, 1000),
        error,
      });
      return NextResponse.json({ error: 'Failed to parse LLM response' }, { status: 502 });
    }

    const validTypes = new Set<string>(VALID_TYPES);
    const validLevels = new Set<string>(VALID_LEVELS);

    const cards: Card[] = (parsed as Record<string, string>[])
      .filter((c) => validTypes.has(c.type) && validLevels.has(c.spicyLevel) && c.content)
      .map((c, i) => ({
        id: `ai-${Date.now()}-${i}`,
        type: c.type as CardType,
        content: c.content,
        spicyLevel: c.spicyLevel as SpicyLevel,
        punishment: c.punishment || undefined,
      }));

    return NextResponse.json({ cards });
  } catch (error) {
    console.error('[cards/generate] Unexpected server error', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
