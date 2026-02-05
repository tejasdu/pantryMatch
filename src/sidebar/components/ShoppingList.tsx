import React from "react";
import type { MatchResult } from "../../types";

interface ShoppingListProps {
  matches: MatchResult[];
}

const ShoppingList: React.FC<ShoppingListProps> = ({ matches }) => {
  const missing = matches.filter((match) => !match.matched);

  if (missing.length === 0) {
    return null;
  }

  return (
    <section style={{ marginTop: 16 }}>
      <h2 style={{ fontSize: 16, marginBottom: 8 }}>Shopping List</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {missing.map((match) => (
          <li key={match.ingredient}>{match.ingredient}</li>
        ))}
      </ul>
    </section>
  );
};

export default ShoppingList;
