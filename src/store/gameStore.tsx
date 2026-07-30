import React, { createContext, useContext, useState, useCallback } from 'react';
import { parsePrompt, generateGame, modifyGame } from '@/engine';
import type { GameConfig } from '@/engine';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface GameState {
  currentGameCode: string;
  gamePrompt: string;
  chatHistory: ChatMessage[];
  gameConfig: GameConfig | null;
  isGenerating: boolean;
  selectedCategory: string | null;
}

interface GameActions {
  generateNewGame: (prompt: string, category?: string) => void;
  modifyCurrentGame: (chatMessage: string) => void;
  resetGame: () => void;
  setCategory: (category: string) => void;
}

type GameStore = GameState & GameActions;

const GameContext = createContext<GameStore | null>(null);

const initialState: GameState = {
  currentGameCode: '',
  gamePrompt: '',
  chatHistory: [],
  gameConfig: null,
  isGenerating: false,
  selectedCategory: null,
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  const generateNewGame = useCallback((prompt: string, category?: string) => {
    setState(prev => ({ ...prev, isGenerating: true }));

    const config = parsePrompt(prompt, category);
    const code = generateGame(config);

    setState({
      currentGameCode: code,
      gamePrompt: prompt,
      chatHistory: [
        {
          role: 'assistant',
          content: `I've created a ${config.genre} game based on your description: "${prompt}". You can play it in the preview panel! Try asking me to modify it - for example, "make it faster", "change the color to blue", or "add more enemies".`,
        },
      ],
      gameConfig: config,
      isGenerating: false,
      selectedCategory: category || null,
    });
  }, []);

  const modifyCurrentGame = useCallback((chatMessage: string) => {
    setState(prev => {
      if (!prev.currentGameCode) return prev;

      const newChatHistory: ChatMessage[] = [
        ...prev.chatHistory,
        { role: 'user' as const, content: chatMessage },
      ];

      const modifiedCode = modifyGame(prev.currentGameCode, chatMessage);
      const codeChanged = modifiedCode !== prev.currentGameCode;

      const assistantResponse: ChatMessage = {
        role: 'assistant',
        content: codeChanged
          ? `Done! I've applied the changes based on your request: "${chatMessage}". Check the preview to see the updated game.`
          : `I processed your request: "${chatMessage}". The game may already match what you asked for, or try being more specific (e.g., "make it faster", "change color to red", "make player bigger").`,
      };

      return {
        ...prev,
        currentGameCode: modifiedCode,
        chatHistory: [...newChatHistory, assistantResponse],
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  const setCategory = useCallback((category: string) => {
    setState(prev => ({ ...prev, selectedCategory: category }));
  }, []);

  const store: GameStore = {
    ...state,
    generateNewGame,
    modifyCurrentGame,
    resetGame,
    setCategory,
  };

  return <GameContext.Provider value={store}>{children}</GameContext.Provider>;
}

export function useGameStore(): GameStore {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameStore must be used within a GameProvider');
  }
  return context;
}
