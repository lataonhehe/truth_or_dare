'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, Skull, Home, RotateCcw, Shuffle } from 'lucide-react';
import type { GameState } from '@/lib/game-data';

interface GameOverScreenProps {
  gameState: GameState;
  onPlayAgain: () => void;
  onNewSetup: () => void;
  onGoHome: () => void;
}

export function GameOverScreen({
  gameState,
  onPlayAgain,
  onNewSetup,
  onGoHome,
}: GameOverScreenProps) {
  // Calculate stats
  const bravest = [...gameState.players].sort(
    (a, b) => b.completed - a.completed
  )[0];
  const chicken = [...gameState.players].sort(
    (a, b) => b.skipped - a.skipped
  )[0];

  const totalChallenges = gameState.players.reduce(
    (sum, p) => sum + p.completed + p.skipped,
    0
  );
  const totalCompleted = gameState.players.reduce(
    (sum, p) => sum + p.completed,
    0
  );
  const completionRate =
    totalChallenges > 0
      ? Math.round((totalCompleted / totalChallenges) * 100)
      : 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border p-6 text-center"
      >
        <motion.h1
          className="font-[var(--font-fredoka)] text-5xl font-bold text-primary text-glow-green"
          animate={{
            textShadow: [
              '0 0 20px rgba(57, 255, 20, 0.5)',
              '0 0 40px rgba(57, 255, 20, 0.8)',
              '0 0 20px rgba(57, 255, 20, 0.5)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        >
          Game Over!
        </motion.h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Đã chơi {gameState.currentRound - 1} vòng
        </p>
      </motion.div>

      {/* Content */}
      <div className="flex-1 space-y-6 overflow-y-auto p-6 pb-32">
        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          {/* Bravest Player */}
          <Card className="glow-green overflow-hidden rounded-3xl border-2 border-primary/30 bg-card p-6">
            <div className="mb-3 text-center text-5xl">
              <Trophy className="mx-auto h-12 w-12 text-primary" />
            </div>
            <h3 className="text-center font-[var(--font-fredoka)] text-lg font-bold text-primary">
              Dũng cảm nhất
            </h3>
            <p className="mt-2 text-center text-2xl font-bold">
              {bravest.name}
            </p>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              {bravest.completed} thử thách hoàn thành
            </p>
          </Card>

          {/* Chicken Player */}
          <Card className="glow-red overflow-hidden rounded-3xl border-2 border-destructive/30 bg-card p-6">
            <div className="mb-3 text-center text-5xl">
              <Skull className="mx-auto h-12 w-12 text-destructive" />
            </div>
            <h3 className="text-center font-[var(--font-fredoka)] text-lg font-bold text-destructive">
              Lươn nhất
            </h3>
            <p className="mt-2 text-center text-2xl font-bold">
              {chicken.name}
            </p>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              {chicken.skipped} lần bỏ cuộc
            </p>
          </Card>
        </motion.div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rounded-3xl bg-card p-6">
            <h3 className="mb-4 font-[var(--font-fredoka)] text-xl font-bold">
              Thống kê chung
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng thử thách</span>
                <span className="font-bold">{totalChallenges}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hoàn thành</span>
                <span className="font-bold text-primary">{totalCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tỷ lệ hoàn thành</span>
                <span className="font-bold text-accent">{completionRate}%</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Player Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="mb-4 font-[var(--font-fredoka)] text-xl font-bold">
            Chi tiết người chơi
          </h3>
          <div className="space-y-3">
            {gameState.players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="rounded-3xl bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-[var(--font-fredoka)] text-lg font-bold">
                        {player.name}
                      </p>
                      <div className="mt-1 flex gap-4 text-sm">
                        <span className="text-primary">
                          ✓ {player.completed}
                        </span>
                        <span className="text-destructive">
                          ✗ {player.skipped}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {player.completed + player.skipped}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        challenges
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Confetti Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, delay: 0.5 }}
          className="pointer-events-none fixed inset-0 flex items-center justify-center text-8xl"
        >
          🎉
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 space-y-3 border-t border-border bg-background/95 p-6 backdrop-blur">
        <Button
          size="lg"
          onClick={onPlayAgain}
          className="glow-green h-16 w-full rounded-3xl bg-primary font-[var(--font-fredoka)] text-xl font-bold hover:bg-primary/90"
        >
          <RotateCcw className="mr-2 h-6 w-6" />
          Chơi lại
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            size="lg"
            variant="outline"
            onClick={onNewSetup}
            className="h-14 rounded-3xl font-[var(--font-fredoka)] text-lg bg-transparent"
          >
            <Shuffle className="mr-2 h-5 w-5" />
            Đổi chế độ
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={onGoHome}
            className="h-14 rounded-3xl font-[var(--font-fredoka)] text-lg bg-transparent"
          >
            <Home className="mr-2 h-5 w-5" />
            Về nhà
          </Button>
        </div>
      </div>
    </div>
  );
}
