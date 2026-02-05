import React, { useState } from "react";
import type { PantryItem } from "../../types";
import { addPantryItem, getPantry, removePantryItem } from "../../utils/storage";

interface PantryListProps {
  pantry: PantryItem[];
  onUpdate: (items: PantryItem[]) => void;
}

const PantryList: React.FC<PantryListProps> = ({ pantry, onUpdate }) => {
  const [value, setValue] = useState("");

  const handleAdd = async () => {
    await addPantryItem(value);
    const items = await getPantry();
    onUpdate(items);
    setValue("");
  };

  const handleRemove = async (id: string) => {
    await removePantryItem(id);
    const items = await getPantry();
    onUpdate(items);
  };

  return (
    <section style={{ marginTop: 16 }}>
      <h2 style={{ fontSize: 16, marginBottom: 8 }}>Pantry</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          style={{ flex: 1, padding: 6 }}
          placeholder="Add pantry item"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      {pantry.length === 0 ? (
        <p style={{ margin: 0 }}>No pantry items yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {pantry.map((item) => (
            <li key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span>{item.name}</span>
              <button onClick={() => handleRemove(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default PantryList;
