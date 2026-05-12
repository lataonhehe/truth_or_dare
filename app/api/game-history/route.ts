import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json();
  const { mode, spicyLevel, players, totalRounds } = body;

  const { error } = await supabase.from('game_history').insert({
    mode,
    spicy_level: spicyLevel,
    players,
    total_rounds: totalRounds,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
