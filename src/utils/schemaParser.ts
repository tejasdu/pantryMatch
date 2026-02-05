import type { Recipe } from "../types";

const RECIPE_TYPE = "Recipe";

function isRecipeType(value: unknown): boolean {
  if (typeof value === "string") {
    return value.toLowerCase() === RECIPE_TYPE.toLowerCase();
  }
  if (Array.isArray(value)) {
    return value.some((entry) => isRecipeType(entry));
  }
  return false;
}

function extractRecipeFromNode(node: unknown, sourceUrl: string): Recipe | null {
  if (!node || typeof node !== "object") return null;
  const record = node as Record<string, unknown>;
  if (!isRecipeType(record["@type"])) return null;

  const rawIngredients = record["recipeIngredient"];
  if (!Array.isArray(rawIngredients)) return null;

  const ingredients = rawIngredients
    .map((item) => (typeof item === "string" ? item : ""))
    .filter((item) => item.trim().length > 0);

  if (ingredients.length === 0) return null;

  const title = typeof record["name"] === "string" ? record["name"] : "Untitled Recipe";
  const description = typeof record["description"] === "string" ? record["description"] : undefined;
  const prepTime = typeof record["prepTime"] === "string" ? record["prepTime"] : undefined;
  const cookTime = typeof record["cookTime"] === "string" ? record["cookTime"] : undefined;

  return {
    title,
    description,
    prepTime,
    cookTime,
    ingredients,
    sourceUrl
  };
}

export function extractRecipeData(url: string, root: Document = document): Recipe | null {
  const scripts = Array.from(root.querySelectorAll("script[type='application/ld+json']"));
  for (const script of scripts) {
    const text = script.textContent?.trim();
    if (!text) continue;

    try {
      const data = JSON.parse(text);
      if (Array.isArray(data)) {
        for (const node of data) {
          const recipe = extractRecipeFromNode(node, url);
          if (recipe) return recipe;
        }
      } else if (data && typeof data === "object") {
        const graph = (data as Record<string, unknown>)["@graph"];
        if (Array.isArray(graph)) {
          for (const node of graph) {
            const recipe = extractRecipeFromNode(node, url);
            if (recipe) return recipe;
          }
        }

        const direct = extractRecipeFromNode(data, url);
        if (direct) return direct;
      }
    } catch {
      // Ignore JSON parse errors for non-JSON scripts.
    }
  }

  return null;
}
