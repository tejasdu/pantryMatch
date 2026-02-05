import React from "react";
import type { MatchResult } from "../../types";

interface IngredientMatcherProps {
  matches: MatchResult[];
}

const IngredientMatcher: React.FC<IngredientMatcherProps> = ({ matches }) => {
  if (matches.length === 0) {
    return (
      <section>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>Ingredients</h2>
        <p style={{ margin: 0 }}>No recipe detected.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 style={{ fontSize: 16, marginBottom: 8 }}>Ingredients</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {matches.map((match) => (
          <li key={match.ingredient} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
            <span>{match.matched ? "✅" : "❌"}</span>
            <span>{match.ingredient}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IngredientMatcher;
