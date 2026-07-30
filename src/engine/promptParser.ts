import { GameConfig, defaultConfig } from './gameTemplates';

const genreKeywords: Record<string, string[]> = {
  platformer: ['platform', 'platformer', 'jump', 'mario', 'side-scroll', 'sidescroll', 'run and jump', 'collect'],
  shooter: ['shoot', 'shooter', 'space', 'spaceship', 'bullet', 'alien', 'invader', 'galaga', 'laser', 'gun'],
  snake: ['snake', 'grow', 'eat', 'nokia', 'worm'],
  flappy: ['flappy', 'bird', 'fly', 'pipe', 'tap', 'wing'],
  breakout: ['breakout', 'pong', 'brick', 'paddle', 'ball', 'bounce', 'arkanoid', 'block'],
  racing: ['race', 'racing', 'car', 'drive', 'road', 'speed', 'traffic', 'dodge'],
  puzzle: ['puzzle', 'match', 'match3', 'candy', 'gem', 'swap', 'tile', 'jewel', 'grid'],
  rpg: ['rpg', 'adventure', 'quest', 'dungeon', 'sword', 'fight', 'combat', 'hero', 'explore', 'fantasy', 'zelda'],
};

const colorKeywords: Record<string, string> = {
  red: '#ff0000', blue: '#0066ff', green: '#00cc00', yellow: '#ffdd00',
  purple: '#9900cc', orange: '#ff6600', pink: '#ff66aa', white: '#ffffff',
  black: '#000000', cyan: '#00cccc', gold: '#ffd700', neon: '#00ff88',
  dark: '#1a1a2e', light: '#f0f0f0', space: '#0a0a2a', forest: '#1a3a1a',
  ocean: '#001a33', lava: '#330000', ice: '#e0f0ff', desert: '#3d2b1f',
};

const difficultyKeywords: Record<string, string[]> = {
  easy: ['easy', 'simple', 'beginner', 'casual', 'relaxed', 'chill'],
  medium: ['medium', 'normal', 'moderate', 'standard', 'regular'],
  hard: ['hard', 'difficult', 'challenging', 'extreme', 'intense', 'impossible', 'insane'],
};

const environmentKeywords: Record<string, string> = {
  space: 'space', ocean: 'ocean', forest: 'forest', desert: 'desert',
  city: 'city', dungeon: 'dungeon', sky: 'sky', underwater: 'underwater',
  cave: 'cave', mountain: 'mountain', castle: 'castle', jungle: 'jungle',
};

export function parsePrompt(prompt: string, category?: string): GameConfig {
  const lower = prompt.toLowerCase();
  const words = lower.split(/[\s,;.!?]+/).filter(w => w.length > 0);

  // Determine genre
  let genre = category || 'platformer';
  if (!category) {
    let bestScore = 0;
    for (const [g, keywords] of Object.entries(genreKeywords)) {
      let score = 0;
      for (const kw of keywords) {
        if (lower.includes(kw)) score += kw.length;
      }
      if (score > bestScore) { bestScore = score; genre = g; }
    }
  }

  // Extract colors
  let playerColor = defaultConfig.playerColor;
  let backgroundColor = defaultConfig.backgroundColor;
  let enemyColor = defaultConfig.enemyColor;
  let accentColor = defaultConfig.accentColor;

  for (const [name, hex] of Object.entries(colorKeywords)) {
    if (lower.includes(name)) {
      if (lower.includes(name + ' player') || lower.includes(name + ' character') || lower.includes(name + ' hero')) {
        playerColor = hex;
      } else if (lower.includes(name + ' background') || lower.includes(name + ' bg') || lower.includes(name + ' theme')) {
        backgroundColor = hex;
      } else if (lower.includes(name + ' enemy') || lower.includes(name + ' enemies') || lower.includes(name + ' obstacle')) {
        enemyColor = hex;
      } else {
        playerColor = hex;
      }
    }
  }

  // Determine difficulty
  let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  for (const [level, keywords] of Object.entries(difficultyKeywords)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) { difficulty = level as 'easy' | 'medium' | 'hard'; break; }
    }
  }

  // Speed and size
  let speed = defaultConfig.speed;
  let size = defaultConfig.size;
  if (lower.includes('fast') || lower.includes('quick') || lower.includes('speedy')) speed = 8;
  if (lower.includes('slow') || lower.includes('relaxed')) speed = 3;
  if (lower.includes('big') || lower.includes('large') || lower.includes('huge')) size = 45;
  if (lower.includes('small') || lower.includes('tiny') || lower.includes('mini')) size = 20;

  // Environment
  let environment = 'default';
  for (const [kw, env] of Object.entries(environmentKeywords)) {
    if (lower.includes(kw)) { environment = env; break; }
  }

  // Player and enemy types
  let playerType = 'hero';
  let enemyType = 'enemy';
  const playerWords = ['ninja', 'knight', 'wizard', 'pirate', 'robot', 'astronaut', 'warrior', 'cat', 'dog'];
  const enemyWords = ['zombie', 'alien', 'robot', 'ghost', 'dragon', 'monster', 'skeleton', 'demon'];
  for (const pw of playerWords) { if (lower.includes(pw)) { playerType = pw; break; } }
  for (const ew of enemyWords) { if (lower.includes(ew)) { enemyType = ew; break; } }

  // Title extraction
  let title = 'My Game';
  const titleMatch = prompt.match(/called ["']?([^"',.!?]+)["']?/i) || prompt.match(/named ["']?([^"',.!?]+)["']?/i);
  if (titleMatch) title = titleMatch[1].trim();

  return {
    genre,
    title,
    playerColor,
    backgroundColor,
    enemyColor,
    accentColor,
    difficulty,
    playerType,
    enemyType,
    environment,
    speed,
    size,
  };
}
