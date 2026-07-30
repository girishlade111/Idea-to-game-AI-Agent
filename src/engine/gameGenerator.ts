import { GameConfig, getTemplateByGenre, getTemplateByKeywords, gameTemplates } from './gameTemplates';

export function generateGame(config: GameConfig): string {
  // Try to find a matching template by genre first
  let template = getTemplateByGenre(config.genre);

  // If no genre match, try keyword matching
  if (!template) {
    const keywords = config.genre.toLowerCase().split(/[\s-]+/);
    template = getTemplateByKeywords(keywords);
  }

  // Fallback to the first (platformer) template
  if (!template) {
    template = gameTemplates[0];
  }

  return template.generateCode(config);
}
