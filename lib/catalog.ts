const GAME_CATEGORIES = new Set([
  "game",
  "games",
  "action",
  "adventure",
  "arcade",
  "board",
  "card",
  "casino",
  "casual",
  "educational games",
  "music games",
  "puzzle",
  "racing",
  "role playing",
  "role-playing",
  "simulation",
  "sports",
  "strategy",
  "trivia",
  "word",
]);

export function isGameCategory(category: string): boolean {
  const value = category.trim().toLowerCase();

  return (
    GAME_CATEGORIES.has(value) ||
    value.startsWith("games ") ||
    value.endsWith(" games")
  );
}