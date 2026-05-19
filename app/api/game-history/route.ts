import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mode, spicyLevel, players, totalRounds } = body;

    const { error } = await supabase.from('game_history').insert({
      mode,
      spicy_level: spicyLevel,
      players,
      total_rounds: totalRounds,
    });

    if (error) {
      console.error('[game-history] Failed to insert game history', {
        mode,
        spicyLevel,
        playerCount: Array.isArray(players) ? players.length : null,
        totalRounds,
        error: error.message,
      });
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[game-history] Unexpected server error', { error });
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
