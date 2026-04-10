export type TagCategory = {
  weight: number;
  tags: string[];
};

export type TagsData = {
  [key: string]: TagCategory;
};

export type CardsData = Card[];

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