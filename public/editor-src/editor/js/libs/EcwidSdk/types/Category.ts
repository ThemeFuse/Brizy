import { EcwidCategoryId } from "visual/global/Ecwid/types";

export interface Category {
  /**
   * Internal unique category ID
   */
  id: EcwidCategoryId;

  /**
   * Category name
   */
  name: string;

  /**
   * `true` if the category is enabled, `false` otherwise. Use `hidden_categories` in request to get disabled categories
   */
  enabled: boolean;
}
