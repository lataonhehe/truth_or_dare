'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { GameState, Card } from '@/lib/game-data';
import {
  getCardsByMode,
  getRandomCard,
  getCardColor,
  getCardLabel,
} from '@/lib/game-data';

interface GameplayScreenProps {
  gameState: GameState;
  onBack: () => void;
  onGameEnd: (finalState: GameState) => void;
}

export function GameplayScreen({
  gameState: initialState,
  onBack,
  onGameEnd,
}: GameplayScreenProps) {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPunishment, setShowPunishment] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const availableCards = getCardsByMode(gameState.mode, gameState.spicyLevel);

  useEffect(() => {
    // Load first card
    if (!gameState.currentCard) {
      const card = getRandomCard(availableCards, gameState.usedCardIds);
      if (card) {
        setGameState((prev) => ({ ...prev, currentCard: card }));
      }
    }
  }, []);

  const handleFlipCard = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  const handleCompleted = () => {
    // Player completed the challenge
    const updatedPlayers = [...gameState.players];
    updatedPlayers[gameState.currentPlayerIndex].completed += 1;

    nextTurn(updatedPlayers);
  };

  const handleSkipped = () => {
    // Player skipped - show punishment
    setShowPunishment(true);
  };

  const handlePunishmentDone = () => {
    // Player accepted punishment
    const updatedPlayers = [...gameState.players];
    updatedPlayers[gameState.currentPlayerIndex].skipped += 1;

    setShowPunishment(false);
    nextTurn(updatedPlayers);
  };

  const nextTurn = (updatedPlayers: typeof gameState.players) => {
    const nextPlayerIndex =
      (gameState.currentPlayerIndex + 1) % gameState.players.length;
    const isNewRound = nextPlayerIndex === 0;
    const nextRound = isNewRound
      ? gameState.currentRound + 1
      : gameState.currentRound;

    // Check if game is over
    if (nextRound > gameState.maxRounds) {
      onGameEnd({ ...gameState, players: updatedPlayers });
      return;
    }

    // Get next card
    const usedIds = [...gameState.usedCardIds, gameState.currentCard?.id || ''];
    const nextCard = getRandomCard(availableCards, usedIds);

    setGameState({
      ...gameState,
      players: updatedPlayers,
      currentPlayerIndex: nextPlayerIndex,
      currentRound: nextRound,
      currentCard: nextCard,
      usedCardIds: usedIds,
    });

    setIsFlipped(false);
  };

  const handleExit = () => {
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    onBack();
  };

  if (!gameState.currentCard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const cardColor = getCardColor(gameState.currentCard.type);
  const cardLabel = getCardLabel(gameState.currentCard.type);

  const cardColorClasses = {
    blue: 'bg-accent text-accent-foreground glow-blue',
    pink: 'bg-secondary text-secondary-foreground glow-pink',
    red: 'bg-destructive text-destructive-foreground glow-red',
    green: 'bg-primary text-primary-foreground glow-green',
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <Button variant="ghost" size="icon" onClick={handleExit}>
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <div className="text-center">
          <p className="font-[var(--font-fredoka)] text-xl font-bold text-primary">
            {currentPlayer.name}
          </p>
          <p className="text-sm text-muted-foreground">Lượt của bạn</p>
        </div>

        <div className="flex flex-col items-end text-sm">
          <span className="font-bold text-foreground">
            Vòng {gameState.currentRound}/{gameState.maxRounds}
          </span>
        </div>
      </div>

      {/* Card Area */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="relative h-[500px] w-full max-w-md" style={{ perspective: '1000px' }}>
          {!isFlipped ? (
            // Card Back
            <motion.div
              key="card-back"
              initial={{ rotateY: 0 }}
              exit={{ rotateY: 180 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="glow-green absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-[32px] bg-card"
              onClick={handleFlipCard}
              animate={{
                scale: [1, 1.05, 1],
              }}
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            >
              <div className="text-center">
                <motion.div
                  className="mb-6 text-8xl"
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                  }}
                >
                  🎴
                </motion.div>
                <p className="font-[var(--font-fredoka)] text-2xl font-bold text-primary">
                  Chạm để lật
                </p>
                <p className="mt-2 text-muted-foreground">Tap to flip</p>
              </div>
            </motion.div>
          ) : (
            // Card Front
            <motion.div
              key="card-front"
              initial={{ rotateY: -180 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className={`absolute inset-0 flex flex-col rounded-[32px] p-8 ${cardColorClasses[cardColor as keyof typeof cardColorClasses]}`}
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            >
              {/* Card Type Badge */}
              <div className="mb-6">
                <span className="inline-block rounded-full bg-white/20 px-6 py-2 font-[var(--font-fredoka)] text-lg font-bold text-white backdrop-blur">
                  {cardLabel}
                </span>
              </div>

              {/* Card Content */}
              <div className="flex flex-1 items-center justify-center">
                <p className="text-balance text-center font-[var(--font-fredoka)] text-2xl font-bold leading-relaxed text-white">
                  {gameState.currentCard.content}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="relative z-10 mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleSkipped}
                  className="glow-red h-14 rounded-3xl border-2 border-white/40 bg-white/10 font-[var(--font-fredoka)] text-sm font-bold text-white backdrop-blur hover:bg-white/20 sm:h-16 sm:text-lg"
                >
                  <X className="mr-1 h-5 w-5 sm:mr-2 sm:h-6 sm:w-6" />
                  <span className="whitespace-nowrap">TỪ CHỐI</span>
                </Button>

                <Button
                  size="lg"
                  onClick={handleCompleted}
                  className="glow-green h-14 rounded-3xl border-2 border-white/40 bg-white/10 font-[var(--font-fredoka)] text-sm font-bold text-white backdrop-blur hover:bg-white/20 sm:h-16 sm:text-lg"
                >
                  <Check className="mr-1 h-5 w-5 sm:mr-2 sm:h-6 sm:w-6" />
                  <span className="whitespace-nowrap">ĐÃ LÀM</span>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Punishment Dialog */}
      <Dialog open={showPunishment} onOpenChange={setShowPunishment}>
        <DialogContent className="rounded-[32px]">
          <DialogHeader>
            <DialogTitle className="text-center font-[var(--font-fredoka)] text-3xl text-destructive text-glow-red">
              Hình phạt!
            </DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <div className="mb-6 text-7xl">🍺</div>
            <p className="text-balance font-[var(--font-fredoka)] text-2xl font-bold">
              {gameState.currentCard.punishment || 'Uống 1 ly!'}
            </p>
          </div>
          <Button
            size="lg"
            onClick={handlePunishmentDone}
            className="glow-red h-16 w-full rounded-3xl bg-destructive font-[var(--font-fredoka)] text-xl font-bold hover:bg-destructive/90"
          >
            Đã chịu phạt
          </Button>
        </DialogContent>
      </Dialog>

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="rounded-[32px]">
          <DialogHeader>
            <DialogTitle className="font-[var(--font-fredoka)] text-2xl">
              Thoát game?
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn thoát? Tiến trình sẽ không được lưu.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => setShowExitDialog(false)}
              className="rounded-3xl"
            >
              Ở lại
            </Button>
            <Button
              onClick={confirmExit}
              variant="destructive"
              className="rounded-3xl"
            >
              Thoát
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
