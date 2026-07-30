/**
 * Generate contextual AI-like responses based on the modification made.
 * Includes suggestions for what the user can try next.
 */

const genreSuggestions: Record<string, string[]> = {
  platformer: [
    'Try "add double jump" for more movement options',
    'Ask me to "add enemies that move" for more challenge',
    'Say "make platforms disappear" for a harder level',
    'Try "change player color to blue"',
    'Ask "add a timer" for a speed challenge',
  ],
  shooter: [
    'Try "add more enemies" to increase difficulty',
    'Ask me to "change bullet speed" for faster action',
    'Say "add shield power-up" for defense',
    'Try "make enemies shoot faster"',
    'Ask "add boss enemy" for an epic fight',
  ],
  snake: [
    'Try "make the snake faster" for more challenge',
    'Ask me to "add walls" for obstacles',
    'Say "make food give more points"',
    'Try "change snake color to blue"',
    'Ask "add multiple food items"',
  ],
  flappy: [
    'Try "make pipes closer together" for more challenge',
    'Ask me to "change pipe color"',
    'Say "make gravity stronger" for harder gameplay',
    'Try "add scoring bonus items"',
    'Ask "make the gap bigger" for easier play',
  ],
  breakout: [
    'Try "add more rows of bricks" for a longer game',
    'Ask me to "make the ball faster"',
    'Say "make the paddle smaller" for more difficulty',
    'Try "change brick colors"',
    'Ask "add power-ups" that drop from bricks',
  ],
  racing: [
    'Try "make cars come faster" for more challenge',
    'Ask me to "add more lanes"',
    'Say "make player car bigger"',
    'Try "change road color"',
    'Ask "add speed boost" for power-ups',
  ],
  puzzle: [
    'Try "add more gem colors" for complexity',
    'Ask me to "make the grid bigger"',
    'Say "add a timer" for time pressure',
    'Try "change gem colors to neon"',
    'Ask "add combo bonuses"',
  ],
  rpg: [
    'Try "add more enemies" for harder combat',
    'Ask me to "make the player faster"',
    'Say "add more health potions"',
    'Try "make enemies stronger"',
    'Ask "change the background color"',
  ],
};

const defaultSuggestions = [
  'Try "make it faster" to increase game speed',
  'Ask me to "change colors" for a new look',
  'Say "make it harder" for more challenge',
  'Try "change background to dark blue"',
  'Ask "make player bigger" to change size',
];

const successPhrases = [
  "Done! I've applied your changes.",
  "Got it! The game has been updated.",
  "Changes applied successfully!",
  "All set! Check the preview to see the update.",
  "Updated! Your modification is live in the preview.",
];

const failurePhrases = [
  "I processed your request, but the game may already match what you asked for.",
  "I tried to apply that change. The game might already be configured that way.",
  "The modification was processed. If it looks the same, try being more specific.",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getSuggestionsForGenre(genre: string | undefined): string[] {
  const suggestions = genre && genreSuggestions[genre]
    ? genreSuggestions[genre]
    : defaultSuggestions;

  // Pick 2-3 random suggestions
  const shuffled = [...suggestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2 + Math.floor(Math.random() * 2));
}

export function generateResponse(
  modification: string,
  success: boolean,
  genre?: string
): string {
  const opener = success ? pickRandom(successPhrases) : pickRandom(failurePhrases);
  const suggestions = getSuggestionsForGenre(genre);

  const suggestionText = suggestions
    .map((s) => `  - ${s}`)
    .join('\n');

  if (success) {
    return `${opener} I applied: "${modification}".\n\nHere are some things you can try next:\n${suggestionText}`;
  }

  return `${opener} Try being more specific about what you want to change.\n\nHere are some suggestions:\n${suggestionText}`;
}
