export type TagCategory = {
  limit: number;
  required: boolean;
  weight: number;
  tags: string[];
};

export type TagsData = {
  [key: string]: TagCategory;
};

export type SelectedTags = {
  [key: string]: string[];
};

export type CardsData = Card[];

export type CardTagData = {
  [cardId: string]: string[]; // Array of tags for each card ID
};

// Optional: API response shape
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };


export type Card = {
  id: string;
  name: string;
  description: string;
  cost: number | -1;
  type: string;
  rarity: string;
  color: string;
  image_url: string;
  keywords: string[];
};