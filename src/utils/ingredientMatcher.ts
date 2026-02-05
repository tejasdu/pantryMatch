import Fuse from "fuse.js";
import type { MatchResult, PantryItem } from "../types";

const UNIT_WORDS = [
  "tsp",
  "tbsp",
  "tablespoon",
  "tablespoons",
  "teaspoon",
  "teaspoons",
  "cup",
  "cups",
  "oz",
  "ounce",
  "ounces",
  "lb",
  "pound",
  "pounds",
  "g",
  "gram",
  "grams",
  "kg",
  "ml",
  "l"
];

const PREFIX_WORDS = ["fresh", "dried", "organic", "optional"];

const PREP_WORDS = ["chopped", "diced", "sifted", "minced", "crushed", "grated", "peeled", "sliced"];

const QUANTITY_REGEX = /^\d+[\d\/\s.-]*/;

export function normalizeIngredient(ingredient: string): string {
  let value = ingredient.toLowerCase().trim();

  value = value.replace(/\([^)]*\)/g, " ");
  value = value.replace(/,.+$/, " ");
  value = value.replace(QUANTITY_REGEX, " ");

  const words = value.split(/\s+/).filter(Boolean);

  const filtered = words.filter(
    (word) => !UNIT_WORDS.includes(word) && !PREFIX_WORDS.includes(word) && !PREP_WORDS.includes(word)
  );

  return filtered.join(" ").trim();
}

export function matchIngredient(
  recipeIngredient: string,
  pantryItems: PantryItem[],
  threshold = 0.65
): MatchResult {
  const normalized = normalizeIngredient(recipeIngredient);
  const fuse = new Fuse(pantryItems, {
    keys: ["name"],
    includeScore: true,
    threshold
  });

  const results = fuse.search(normalized);
  const best = results[0];

  if (best && typeof best.score === "number" && best.score <= threshold) {
    return {
      ingredient: recipeIngredient,
      normalized,
      matched: true,
      matchedItem: best.item,
      score: best.score
    };
  }

  return {
    ingredient: recipeIngredient,
    normalized,
    matched: false
  };
}
