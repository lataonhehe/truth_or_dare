import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CARD_DECK } from '@/lib/game-data';

export async function GET() {
  const { data, error } = await supabase
    .from('cards')
    .select('id, type, content, spicy_level, punishment');

  if (error || !data || data.length === 0) {
    console.error('[cards] Falling back to local deck', {
      supabaseError: error?.message ?? null,
      hasData: Boolean(data),
      rowCount: data?.length ?? 0,
    });
    return NextResponse.json({ cards: CARD_DECK, source: 'local' });
  }

  const cards = data.map((row) => ({
    id: row.id,
    type: row.type,
    content: row.content,
    spicyLevel: row.spicy_level,
    punishment: row.punishment ?? undefined,
  }));

  return NextResponse.json({ cards, source: 'supabase' });
}
