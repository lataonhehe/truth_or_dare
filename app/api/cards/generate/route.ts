import { NextResponse } from 'next/server';
import type { Card, CardType, SpicyLevel, GameMode } from '@/lib/game-data';
import { supabase } from '@/lib/supabase';

const VALID_TYPES: CardType[] = ['truth', 'dare', 'do'];
const VALID_LEVELS: SpicyLevel[] = ['chill', 'spicy', 'wild'];

function buildSystemPrompt(mode: GameMode, spicyLevel: SpicyLevel): string {
  const allowedTypes = mode === 'classic' ? ['truth', 'dare'] : ['dare', 'do'];
  const allowedTypesText = allowedTypes.map((t) => `"${t}"`).join(', ');

  const levelDesc: Record<SpicyLevel, string> = {
    chill: 'vui vẻ, nhẹ nhàng, phù hợp mọi người',
    spicy: 'hơi táo bạo, gây cười, có thể hơi embarrassing',
    wild: 'táo bạo hơn nhưng vẫn an toàn và có thể thực hiện ngay',
  };

  return `Bạn là trình tạo dữ liệu JSON cho game Truth or Dare.

Mục tiêu: tạo thẻ chơi bằng tiếng Việt theo đúng schema và ràng buộc.

Ràng buộc bắt buộc:
1. Chỉ trả về DUY NHẤT một JSON array hợp lệ, không markdown, không giải thích.
2. Mỗi phần tử là object với ĐÚNG 4 key theo thứ tự:
   "type", "content", "spicyLevel", "punishment"
3. "type" chỉ được là một trong: ${allowedTypesText}
4. "spicyLevel" luôn phải là "${spicyLevel}".
5. "content" phải tự nhiên, rõ ràng, không rỗng, không trùng lặp ý giữa các thẻ.
6. "punishment" phải là hình phạt NGẮN, VUI, DỄ CHẤP NHẬN, LÀM ĐƯỢC NGAY (khoảng 5-30 giây).
7. Ưu tiên hình phạt xã giao vui như: nói giọng hài 10 giây, làm mặt xấu 5 giây, vỗ tay theo nhịp, kể 1 fun fact, hát 1 câu ngắn, tạo dáng ngẫu nhiên, quay 1 vòng.
8. Tránh hình phạt gây đau, quá sức, nguy hiểm, xúc phạm, vi phạm riêng tư, hoặc ép tương tác nhạy cảm.
9. Không dùng ký tự markdown như \`\`\`, không thêm text trước/sau JSON.

Ngữ nghĩa type:
- "truth": câu hỏi buộc người chơi nói thật
- "dare": thử thách buộc người chơi thực hiện hành động
- "do": dạng "uống nếu..." hoặc "ai từng... thì uống"

Tone theo mức độ "${spicyLevel}": ${levelDesc[spicyLevel]}.`;
}

function buildUserPrompt(context: string, spicyLevel: SpicyLevel, count: number): string {
  const safeCount = Math.min(Math.max(count, 1), 30);
  const cleanContext = context.trim().replace(/\s+/g, ' ');

  return `Tạo chính xác ${safeCount} thẻ.

Thông tin nhóm chơi:
"""
${cleanContext}
"""

Yêu cầu chất lượng:
- Cá nhân hóa theo context, không viết chung chung.
- Phân bổ đa dạng tình huống, tránh lặp cấu trúc câu.
- Ưu tiên câu ngắn gọn, dễ chơi ngay trong buổi tụ tập.
- Tất cả thẻ phải có "spicyLevel": "${spicyLevel}".
- Hình phạt phải vui, nhẹ, dễ đồng ý và làm ngay; hạn chế lặp "uống shot/hít đất".
- Đa dạng kiểu phạt: mini biểu cảm, mini diễn xuất, mini vận động nhẹ, mini hát/múa/vẽ.

Nhắc lại: chỉ xuất JSON array hợp lệ, không kèm bất kỳ chữ nào khác.`;
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
        id: `ai-${Date.now()}-${i}-${crypto.randomUUID()}`,
        type: c.type as CardType,
        content: c.content,
        spicyLevel: c.spicyLevel as SpicyLevel,
        punishment: c.punishment || undefined,
      }));

    if (cards.length === 0) {
      console.error('[cards/generate] No valid cards after filtering parsed output', {
        mode,
        spicyLevel,
        count,
      });
      return NextResponse.json({ error: 'No valid cards generated' }, { status: 502 });
    }

    const { error: insertError } = await supabase.from('cards').insert(
      cards.map((card) => ({
        id: card.id,
        type: card.type,
        content: card.content,
        spicy_level: card.spicyLevel,
        punishment: card.punishment ?? null,
      }))
    );

    if (insertError) {
      console.error('[cards/generate] Failed to persist generated cards', {
        mode,
        spicyLevel,
        count,
        cardCount: cards.length,
        error: insertError.message,
      });
      return NextResponse.json({ error: 'Failed to save generated cards' }, { status: 500 });
    }

    return NextResponse.json({ cards });
  } catch (error) {
    console.error('[cards/generate] Unexpected server error', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
