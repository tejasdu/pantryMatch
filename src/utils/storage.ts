import type { PantryItem, PantryStorage } from "../types";

const STORAGE_KEY = "pantry";

function getDefaultStorage(): PantryStorage {
  return {
    items: [],
    lastUpdated: Date.now()
  };
}

export async function getPantry(): Promise<PantryItem[]> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const stored = result[STORAGE_KEY] as PantryStorage | undefined;
  return stored?.items ?? [];
}

export async function savePantry(items: PantryItem[]): Promise<void> {
  const payload: PantryStorage = {
    items,
    lastUpdated: Date.now()
  };
  await chrome.storage.local.set({ [STORAGE_KEY]: payload });
}

export async function addPantryItem(name: string): Promise<void> {
  const items = await getPantry();
  const trimmed = name.trim();
  if (!trimmed) return;

  const exists = items.some((item) => item.name === trimmed.toLowerCase());
  if (exists) return;

  const newItem: PantryItem = {
    id: crypto.randomUUID(),
    name: trimmed.toLowerCase(),
    addedDate: Date.now()
  };

  await savePantry([...items, newItem]);
}

export async function removePantryItem(id: string): Promise<void> {
  const items = await getPantry();
  await savePantry(items.filter((item) => item.id !== id));
}

export async function ensurePantryInitialized(): Promise<void> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  if (!result[STORAGE_KEY]) {
    await chrome.storage.local.set({ [STORAGE_KEY]: getDefaultStorage() });
  }
}
