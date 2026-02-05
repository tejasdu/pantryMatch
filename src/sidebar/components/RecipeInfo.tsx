import React from "react";
import type { MatchResult, Recipe } from "../../types";

interface RecipeInfoProps {
  recipe: Recipe | null;
  matches: MatchResult[];
}

const RecipeInfo: React.FC<RecipeInfoProps> = ({ recipe, matches }) => {
  if (!recipe) {
    return (
      <section style={{ marginBottom: 16 }}>
        <p style={{ margin: 0 }}>Recipe not detected yet.</p>
      </section>
    );
  }

  const matchedCount = matches.filter((match) => match.matched).length;

  return (
    <section style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 16, marginBottom: 4 }}>{recipe.title}</h2>
      {recipe.description ? <p style={{ marginTop: 0 }}>{recipe.description}</p> : null}
      <p style={{ margin: 0 }}>
        Matched {matchedCount} / {matches.length} ingredients
      </p>
    </section>
  );
};

export default RecipeInfo;
