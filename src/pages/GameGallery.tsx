import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import Header from '@/components/Header';

interface GamePreset {
  id: string;
  icon: string;
  title: string;
  description: string;
  genre: string;
  prompt: string;
}

const gamePresets: GamePreset[] = [
  {
    id: 'platformer-adventure',
    icon: '🏃',
    title: 'Platformer Adventure',
    description: 'Jump across platforms, collect coins, and avoid falling into the void.',
    genre: 'Platformer',
    prompt: 'Create a platformer adventure game with green player, lots of platforms and golden coins to collect',
  },
  {
    id: 'space-defender',
    icon: '🚀',
    title: 'Space Defender',
    description: 'Defend the galaxy from waves of alien invaders with your spaceship.',
    genre: 'Shooter',
    prompt: 'Create a space shooter game with a blue spaceship defending against red alien invaders',
  },
  {
    id: 'classic-snake',
    icon: '🐍',
    title: 'Classic Snake',
    description: 'Grow your snake by eating food. Do not hit the walls or yourself!',
    genre: 'Snake',
    prompt: 'Create a classic snake game with neon green snake and golden food on a dark grid',
  },
  {
    id: 'flappy-clone',
    icon: '🐦',
    title: 'Flappy Bird Clone',
    description: 'Tap to fly through narrow gaps between pipes. How far can you go?',
    genre: 'Flappy',
    prompt: 'Create a flappy bird game with a yellow bird flying through green pipes',
  },
  {
    id: 'brick-breaker',
    icon: '🧱',
    title: 'Brick Breaker',
    description: 'Bounce the ball off your paddle to destroy all the bricks above.',
    genre: 'Breakout',
    prompt: 'Create a breakout brick breaker game with colorful bricks and a white ball',
  },
  {
    id: 'street-racer',
    icon: '🏎️',
    title: 'Street Racer',
    description: 'Dodge oncoming traffic at high speed on a multi-lane highway.',
    genre: 'Racing',
    prompt: 'Create a fast racing game with a blue car dodging red traffic on a highway',
  },
  {
    id: 'gem-match',
    icon: '💎',
    title: 'Gem Match',
    description: 'Swap colorful gems to create matches of three or more in a row.',
    genre: 'Puzzle',
    prompt: 'Create a match-3 puzzle game with colorful gems that you can swap to make matches',
  },
  {
    id: 'dungeon-explorer',
    icon: '⚔️',
    title: 'Dungeon Explorer',
    description: 'Battle monsters, find potions, and survive the dungeon.',
    genre: 'RPG',
    prompt: 'Create an RPG dungeon exploration game with a hero fighting monsters and collecting health potions',
  },
  {
    id: 'neon-platformer',
    icon: '🌟',
    title: 'Neon Runner',
    description: 'A neon-themed platformer with glowing platforms and fast-paced action.',
    genre: 'Platformer',
    prompt: 'Create a neon platformer game with cyan player, purple platforms, and a dark background with fast speed',
  },
  {
    id: 'asteroid-blaster',
    icon: '☄️',
    title: 'Asteroid Blaster',
    description: 'Blast asteroids in deep space before they reach your ship.',
    genre: 'Shooter',
    prompt: 'Create a hard space shooter game with orange enemies representing asteroids coming at the player quickly',
  },
];

const GameGallery = () => {
  const navigate = useNavigate();
  const gameStore = useGameStore();

  const handleSelectGame = (preset: GamePreset) => {
    const category = preset.genre.toLowerCase();
    gameStore.generateNewGame(preset.prompt, category);
    navigate('/workspace');
  };

  return (
    <div className="min-h-screen flex flex-col bg-arcade-dark">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Game Gallery
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Browse ready-to-play game presets. Click any card to instantly generate and play the game.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gamePresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectGame(preset)}
              className="bg-arcade-terminal/40 border border-gray-800 rounded-xl p-6 text-left hover:border-arcade-purple/60 hover:bg-arcade-terminal/60 transition-all duration-200 group"
            >
              <div className="flex items-start space-x-4">
                <div className="text-4xl flex-shrink-0">{preset.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-lg group-hover:text-arcade-purple transition-colors">
                    {preset.title}
                  </h3>
                  <span className="inline-block text-xs text-arcade-purple bg-arcade-purple/10 px-2 py-0.5 rounded-full mt-1 mb-2">
                    {preset.genre}
                  </span>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {preset.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <footer className="py-6 border-t border-gray-800 text-center text-sm text-gray-500">
        <p>&copy; 2025 Engine Arcade. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default GameGallery;
