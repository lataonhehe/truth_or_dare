'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, X, Play, Zap, Sparkles, Loader2 } from 'lucide-react';
import type { GameMode, SpicyLevel, Card } from '@/lib/game-data';
import { MOCK_PLAYERS } from '@/lib/mock-data';
import { Textarea } from '@/components/ui/textarea';

interface GameSetupProps {
  onBack: () => void;
  onStartGame: (config: {
    mode: GameMode;
    spicyLevel: SpicyLevel;
    players: string[];
    generatedCards: Card[];
  }) => void;
}

export function GameSetup({ onBack, onStartGame }: GameSetupProps) {
  const [mode, setMode] = useState<GameMode>('classic');
  const [spicyLevel, setSpicyLevel] = useState<SpicyLevel>('spicy');
  const [players, setPlayers] = useState<string[]>(['']);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [aiContext, setAiContext] = useState('');
  const [generatedCards, setGeneratedCards] = useState<Card[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 10) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const quickAddPlayers = () => {
    const count = players.filter((p) => p).length + 1;
    setPlayers([...players, `Player ${count}`]);
  };

  const loadMockPlayers = () => {
    setPlayers(MOCK_PLAYERS.map(p => p.name));
  };

  const handleGenerateCards = async () => {
    if (!aiContext.trim() || isGenerating) return;
    setIsGenerating(true);
    setGenerateError('');
    try {
      const res = await fetch('/api/cards/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: aiContext, mode, spicyLevel, count: 15 }),
      });
      if (!res.ok) throw new Error('Lỗi khi tạo thẻ');
      const { cards } = await res.json();
      setGeneratedCards(cards);
    } catch {
      setGenerateError('Không thể tạo thẻ. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStart = () => {
    const validPlayers = players.filter((p) => p.trim());
    if (validPlayers.length >= 2) {
      onStartGame({ mode, spicyLevel, players: validPlayers, generatedCards });
    }
  };

  const validPlayers = players.filter((p) => p.trim());
  const canStart = validPlayers.length >= 2;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border p-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="font-[var(--font-fredoka)] text-3xl font-bold text-primary">
          Thiết lập game
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-8 overflow-y-auto p-6 pb-32">
        {/* Game Mode Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="mb-4 font-[var(--font-fredoka)] text-xl font-bold">
            Chế độ chơi
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode('classic')}
              className={`relative overflow-hidden rounded-3xl p-6 text-left transition-all ${
                mode === 'classic'
                  ? 'glow-blue bg-accent text-accent-foreground'
                  : 'bg-card text-card-foreground'
              }`}
            >
              <div className="relative z-10">
                <h3 className="font-[var(--font-fredoka)] text-2xl font-bold">
                  Classic
                </h3>
                <p className="mt-2 text-sm opacity-90">Truth or Dare</p>
              </div>
              {mode === 'classic' && (
                <div className="absolute inset-0 bg-accent opacity-20" />
              )}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode('chaos')}
              className={`relative overflow-hidden rounded-3xl p-6 text-left transition-all ${
                mode === 'chaos'
                  ? 'glow-red bg-destructive text-destructive-foreground'
                  : 'bg-card text-card-foreground'
              }`}
            >
              <div className="relative z-10">
                <h3 className="font-[var(--font-fredoka)] text-2xl font-bold">
                  Chaos
                </h3>
                <p className="mt-2 text-sm opacity-90">Do or Drink</p>
              </div>
              {mode === 'chaos' && (
                <div className="absolute inset-0 bg-destructive opacity-20" />
              )}
            </motion.button>
          </div>
        </motion.section>

        {/* Spiciness Level */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mb-4 font-[var(--font-fredoka)] text-xl font-bold">
            Độ cay
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSpicyLevel('chill')}
              className={`rounded-3xl p-4 text-center transition-all ${
                spicyLevel === 'chill'
                  ? 'glow-green bg-primary text-primary-foreground'
                  : 'bg-card text-card-foreground'
              }`}
            >
              <div className="text-3xl">🟢</div>
              <div className="mt-2 font-[var(--font-fredoka)] font-bold">
                Chill
              </div>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSpicyLevel('spicy')}
              className={`rounded-3xl p-4 text-center transition-all ${
                spicyLevel === 'spicy'
                  ? 'glow-pink bg-secondary text-secondary-foreground'
                  : 'bg-card text-card-foreground'
              }`}
            >
              <div className="text-3xl">🟡</div>
              <div className="mt-2 font-[var(--font-fredoka)] font-bold">
                Spicy
              </div>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSpicyLevel('wild')}
              className={`rounded-3xl p-4 text-center transition-all ${
                spicyLevel === 'wild'
                  ? 'glow-red bg-destructive text-destructive-foreground'
                  : 'bg-card text-card-foreground'
              }`}
            >
              <div className="text-3xl">🔴</div>
              <div className="mt-2 font-[var(--font-fredoka)] font-bold">
                Wild
              </div>
              <div className="text-xs opacity-70">18+</div>
            </motion.button>
          </div>
        </motion.section>

        {/* Players */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-[var(--font-fredoka)] text-xl font-bold">
              Người chơi ({validPlayers.length})
            </h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={loadMockPlayers}
                className="text-accent"
              >
                <Zap className="mr-1 h-4 w-4" />
                Test Mode
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={quickAddPlayers}
                className="text-primary"
              >
                Quick Add
              </Button>
            </div>
          </div>

          {/* Player List */}
          <div className="mb-4 flex flex-wrap gap-3">
            {players.map((player, index) =>
              player ? (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-2 rounded-full px-4 py-2 text-base"
                  >
                    <span>{player}</span>
                    <button
                      type="button"
                      onClick={() => removePlayer(index)}
                      className="hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Badge>
                </motion.div>
              ) : null
            )}
          </div>

          {/* Add Player Input */}
          {players.length < 10 && (
            <div className="flex gap-3">
              <Input
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                placeholder="Nhập tên người chơi..."
                className="flex-1 rounded-3xl border-2 border-border bg-input px-6 py-6 text-lg"
              />
              <Button
                onClick={addPlayer}
                size="icon"
                className="glow-green h-14 w-14 rounded-full bg-primary hover:bg-primary/90"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>
          )}

          {validPlayers.length < 2 && (
            <p className="mt-3 text-sm text-muted-foreground">
              Cần ít nhất 2 người chơi để bắt đầu
            </p>
          )}
        </motion.section>

        {/* AI Card Generator */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="mb-1 font-[var(--font-fredoka)] text-xl font-bold">
            Tạo thẻ bằng AI ✨
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Mô tả nhóm bạn để AI tạo thẻ cá nhân hóa
          </p>

          <Textarea
            value={aiContext}
            onChange={(e) => setAiContext(e.target.value)}
            placeholder="Ví dụ: Bạn bè đại học hay đi hát karaoke, có 2 cặp đôi đang yêu nhau, thích phim Marvel..."
            className="mb-3 min-h-[100px] rounded-3xl border-2 border-border bg-input px-5 py-4 text-base"
          />

          {generatedCards.length > 0 ? (
            <div className="mb-3 flex items-center gap-3">
              <Badge variant="secondary" className="rounded-full px-4 py-2 text-base">
                <Sparkles className="mr-2 h-4 w-4 text-yellow-400" />
                Đã tạo {generatedCards.length} thẻ AI
              </Badge>
              <button
                type="button"
                onClick={() => setGeneratedCards([])}
                className="text-sm text-muted-foreground hover:text-destructive"
              >
                Xóa
              </button>
            </div>
          ) : null}

          {generateError && (
            <p className="mb-3 text-sm text-destructive">{generateError}</p>
          )}

          <Button
            onClick={handleGenerateCards}
            disabled={!aiContext.trim() || isGenerating}
            className="glow-pink h-12 w-full rounded-3xl bg-secondary font-[var(--font-fredoka)] text-lg font-bold text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Đang tạo thẻ...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Tạo thẻ AI
              </>
            )}
          </Button>
        </motion.section>
      </div>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 p-4 backdrop-blur sm:p-6">
        <Button
          size="lg"
          onClick={handleStart}
          disabled={!canStart}
          className={`glow-green h-14 w-full rounded-3xl font-[var(--font-fredoka)] text-lg font-bold sm:h-16 sm:text-2xl ${
            canStart
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          <Play className="mr-1.5 h-5 w-5 sm:mr-2 sm:h-6 sm:w-6" />
          <span className="whitespace-nowrap">BẮT ĐẦU CHƠI</span>
        </Button>
      </div>
    </div>
  );
}
