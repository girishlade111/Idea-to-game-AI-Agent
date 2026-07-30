
import { useState } from 'react';
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import Header from '@/components/Header';

const gameCategories = [
  { id: 'platformer', name: 'Platformer', icon: '🏃', hint: 'A side-scrolling platform game with jumping and collecting...' },
  { id: 'shooter', name: 'Space Shooter', icon: '🚀', hint: 'A space shooter with lasers, aliens, and power-ups...' },
  { id: 'racing', name: 'Racing', icon: '🏎️', hint: 'A fast-paced racing game dodging traffic...' },
  { id: 'puzzle', name: 'Puzzle', icon: '🧩', hint: 'A match-3 puzzle game with colorful gems...' },
  { id: 'snake', name: 'Snake', icon: '🐍', hint: 'A classic snake game where you grow by eating...' },
  { id: 'flappy', name: 'Flappy Bird', icon: '🐦', hint: 'A flappy bird style game with obstacles...' },
  { id: 'breakout', name: 'Breakout', icon: '🧱', hint: 'A brick-breaking game with a bouncing ball and paddle...' },
  { id: 'rpg', name: 'RPG', icon: '⚔️', hint: 'A top-down RPG adventure with enemies and exploration...' },
];

const CreateGame = () => {
  const [gameIdea, setGameIdea] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const gameStore = useGameStore();

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    gameStore.setCategory(categoryId);
    const category = gameCategories.find(c => c.id === categoryId);
    if (category && !gameIdea) {
      setGameIdea('');
    }
  };

  const getPlaceholder = () => {
    if (selectedCategory) {
      const category = gameCategories.find(c => c.id === selectedCategory);
      return category?.hint || 'Describe your game idea...';
    }
    return 'Describe your game idea... (e.g., "Make a neon space shooter with fast enemies")';
  };

  const handleCreate = () => {
    if (!gameIdea.trim() && !selectedCategory) {
      toast({
        title: "Please describe your game idea or select a category",
        variant: "destructive",
      });
      return;
    }

    const prompt = gameIdea.trim() || `Create a ${selectedCategory} game`;
    setIsCreating(true);

    // Brief delay for loading animation
    setTimeout(() => {
      gameStore.generateNewGame(prompt, selectedCategory || undefined);

      toast({
        title: "Game Created!",
        description: "Your game has been generated. Have fun!",
      });

      navigate('/workspace');
    }, 800);
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-arcade-dark">
      <Header />

      {/* Loading overlay */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 size={48} className="animate-spin text-arcade-purple" />
            <p className="text-white text-lg font-medium animate-pulse">Generating your game...</p>
          </div>
        </div>
      )}

      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Back button */}
        <button
          onClick={goBack}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to home</span>
        </button>

        {/* Icon at the top */}
        <div className="w-full flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-arcade-terminal flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-arcade-purple opacity-20 blur-xl"></div>
            <div className="text-3xl">🎮</div>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-16 tracking-tight">
          Idea to game in seconds.
        </h1>

        {/* Game creation area */}
        <div className="bg-arcade-terminal/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800 shadow-xl max-w-4xl mx-auto mb-8">
          <textarea
            value={gameIdea}
            onChange={(e) => setGameIdea(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full bg-arcade-terminal border border-gray-700 rounded-lg p-4 min-h-24 text-white focus:outline-none focus:ring-2 focus:ring-arcade-purple resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleCreate();
              }
            }}
          />

          <div className="flex flex-wrap items-center justify-end mt-4">
            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="bg-arcade-purple hover:bg-opacity-90 text-white rounded-lg px-6 py-2 flex items-center font-medium disabled:opacity-70 transition-all"
            >
              <Sparkles size={18} className="mr-2" />
              {isCreating ? 'Generating...' : 'Create Game'}
            </button>
          </div>
        </div>

        {/* Game categories */}
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {gameCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all ${
                selectedCategory === category.id
                  ? 'bg-arcade-purple/20 border-arcade-purple text-white scale-105'
                  : 'bg-arcade-terminal/40 border-gray-700 text-gray-300 hover:bg-arcade-terminal/60 hover:border-gray-500'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateGame;
