import React, { useEffect, useMemo, useState } from "react";
import type { MatchResult, PantryItem, Recipe } from "../types";
import { ensurePantryInitialized, getPantry } from "../utils/storage";
import { matchIngredient } from "../utils/ingredientMatcher";
import PantryList from "./components/PantryList";
import IngredientMatcher from "./components/IngredientMatcher";
import ShoppingList from "./components/ShoppingList";
import RecipeInfo from "./components/RecipeInfo";

const App: React.FC = () => {
  const [pantry, setPantry] = useState<PantryItem[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const init = async () => {
      await ensurePantryInitialized();
      const items = await getPantry();
      setPantry(items);
      const response = await chrome.runtime.sendMessage({ type: "PANTRY_MATCH_GET_RECIPE" });
      if (response?.recipe) {
        setRecipe(response.recipe as Recipe);
      }
    };

    init();
  }, []);

  const matches: MatchResult[] = useMemo(() => {
    if (!recipe) return [];
    return recipe.ingredients.map((ingredient) => matchIngredient(ingredient, pantry));
  }, [recipe, pantry]);

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 20, marginBottom: 12 }}>PantryMatch</h1>
      <RecipeInfo recipe={recipe} matches={matches} />
      <IngredientMatcher matches={matches} />
      <ShoppingList matches={matches} />
      <PantryList pantry={pantry} onUpdate={setPantry} />
    </div>
  );
};

export default App;
