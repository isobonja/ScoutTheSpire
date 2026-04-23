export type CategoryData = {
  limit: number;
  required: boolean;
  weight: number;
  tags: string[];
};

export type CategoryInfo = {
  name: string;
  limit: number;
  required: boolean;
}

export type TagsData = {
  [key: string]: CategoryData;
};

/*export type SelectedTags = {
  [key: string]: string[];
};*/

export type Tag = {
  value: string;
  isTemporary?: boolean;
};

export type SelectedTags = {
  [key: string]: Tag[];
};

export type CardsData = Card[];

export type CardTagData = {
  [cardId: string]: string[]; // Array of tags for each card ID
};

// Optional: API response shape
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };


export type CardShort = {
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

export type Card = {
  id: string;
  name: string;
  description: string;
  cost: number | -1;
  is_x_cost: boolean;
  is_x_star_cost: boolean | null;
  star_cost: number | null;
  type: string;
  rarity: string;
  target: string;
  color: string;
  damage: number | null;
  block: number | null;
  hit_count: number | null;
  powers_applied: string[] | null;
  cards_draw: number | null;
  energy_gain: number | null;
  hp_loss: number | null;
  keywords: string[] | null;
  tags: string[] | null;
  spawns_cards: string[] | null;
  image_url: string;
  beta_image_url: string | null;
}