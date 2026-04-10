export {};

import type { Card, TagsData, ApiResponse } from "../../shared/types";

declare global {
  interface Window {
    api: {
      // READ
      readTags: () => Promise<TagsData>;
      readCards: () => Promise<Card[]>;

      // WRITE
      addTagCategory: (category: string) => Promise<ApiResponse>;
      addTagsToCategory: (
        category: string,
        tags: string[]
      ) => Promise<ApiResponse>;
    };
  }
}