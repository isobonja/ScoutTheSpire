export {};

import type { Card, TagsData, CardTagData, ApiResponse } from "../../shared/types";

declare global {
  interface Window {
    api: {
      // READ
      readTags: () => Promise<TagsData>;
      readCards: () => Promise<Card[]>;
      readCardTags: () => Promise<CardTagData>;

      // WRITE
      addTagCategory: (category: string) => Promise<ApiResponse>;
      addTagsToCategory: (
        category: string,
        tags: string[]
      ) => Promise<ApiResponse>;
      addTagsToCard: (
        cardId: string,
        tags: string[]
      ) => Promise<ApiResponse>;
    };
  }
}