export interface Recipe {
  title: string;
  description?: string;
  prepTime?: string;
  cookTime?: string;
  ingredients: string[];
  sourceUrl: string;
}

export interface PantryItem {
  id: string;
  name: string;
  addedDate: number;
}

export interface PantryStorage {
  items: PantryItem[];
  lastUpdated: number;
}

export interface MatchResult {
  ingredient: string;
  normalized: string;
  matched: boolean;
  matchedItem?: PantryItem;
  score?: number;
}
