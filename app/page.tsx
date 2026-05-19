'use client';

import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import { HomeScreen } from '@/components/home-screen';
import { GameSetup } from '@/components/game-setup';
import { GameplayScreen } from '@/components/gameplay-screen';
import { GameOverScreen } from '@/components/game-over-screen';
import type { GameMode, SpicyLevel, GameState, Player, Card } from '@/lib/game-data';
import { fetchCards, CARD_DECK } from '@/lib/game-data';

type Screen = 'splash' | 'home' | 'setup' | 'gameplay' | 'gameover';

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [cardDeck, setCardDeck] = useState<Card[]>(CARD_DECK);

  useEffect(() => {
    fetchCards().then(setCardDeck);
  }, []);

  const handleSplashComplete = () => {
    setCurrentScreen('home');
  };

  const handleStartGame = () => {
    setCurrentScreen('setup');
  };

  const handleSetupComplete = (config: {
    mode: GameMode;
    spicyLevel: SpicyLevel;
    players: string[];
    generatedCards: Card[];
  }) => {
    // Merge AI-generated cards at the front so they appear first
    if (config.generatedCards.length > 0) {
      setCardDeck([...config.generatedCards, ...cardDeck]);
    }

    const players: Player[] = config.players.map((name, index) => ({
      id: `player-${index}`,
      name,
      completed: 0,
      skipped: 0,
    }));

    const newGameState: GameState = {
      mode: config.mode,
      spicyLevel: config.spicyLevel,
      players,
      currentPlayerIndex: 0,
      currentRound: 1,
      maxRounds: 10,
      currentCard: null,
      usedCardIds: [],
    };

    setGameState(newGameState);
    setCurrentScreen('gameplay');
  };

  const handleGameEnd = (finalState: GameState) => {
    setGameState(finalState);
    setCurrentScreen('gameover');

    fetch('/api/game-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: finalState.mode,
        spicyLevel: finalState.spicyLevel,
        players: finalState.players.map(({ name, completed, skipped }) => ({ name, completed, skipped })),
        totalRounds: finalState.maxRounds,
      }),
    }).catch((error) => {
      console.error('[Page] Failed to save game history', {
        mode: finalState.mode,
        spicyLevel: finalState.spicyLevel,
        playerCount: finalState.players.length,
        error,
      });
    });
  };

  const handlePlayAgain = () => {
    if (gameState) {
      // Reset player stats but keep same config
      const resetPlayers = gameState.players.map((p) => ({
        ...p,
        completed: 0,
        skipped: 0,
      }));

      const newGameState: GameState = {
        ...gameState,
        players: resetPlayers,
        currentPlayerIndex: 0,
        currentRound: 1,
        currentCard: null,
        usedCardIds: [],
      };

      setGameState(newGameState);
      setCurrentScreen('gameplay');
    }
  };

  const handleNewSetup = () => {
    setGameState(null);
    setCurrentScreen('setup');
  };

  const handleGoHome = () => {
    setGameState(null);
    setCurrentScreen('home');
  };

  const handleBackToHome = () => {
    setGameState(null);
    setCurrentScreen('home');
  };

  return (
    <>
      {currentScreen === 'splash' && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {currentScreen === 'home' && (
        <HomeScreen onStartGame={handleStartGame} />
      )}

      {currentScreen === 'setup' && (
        <GameSetup onBack={handleBackToHome} onStartGame={handleSetupComplete} />
      )}

      {currentScreen === 'gameplay' && gameState && (
        <GameplayScreen
          gameState={gameState}
          cardDeck={cardDeck}
          onBack={handleBackToHome}
          onGameEnd={handleGameEnd}
        />
      )}

      {currentScreen === 'gameover' && gameState && (
        <GameOverScreen
          gameState={gameState}
          onPlayAgain={handlePlayAgain}
          onNewSetup={handleNewSetup}
          onGoHome={handleGoHome}
        />
      )}
    </>
  );
}
