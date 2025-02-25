import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { EcwidCategoryId } from "visual/global/Ecwid/types";
import { request } from "../../utils/api";
import { Category } from "./types/Category";

/**
 * https://api-docs.ecwid.com/reference/get-categories
 */
export interface CategoriesList {
  /**
   * The total number of found items (might be more than the number of returned items)
   */
  total: number;

  /**
   * The total number of the items returned in this batch
   */
  count: number;

  /**
   * Offset from the beginning of the returned items list (for paging)
   */
  offset: number;

  /**
   * Maximum possible number of returned items in this request.
   */
  limit: number;

  /**
   * The items list
   */
  items: Category[];
}

export class Categories {
  constructor(private baseUrl: string) {}

  /**
   * Search or filter products in a store catalog. The response provides full details of found products.
   *
   * https://api-docs.ecwid.com/reference/search-products
   */
  search(config: ConfigCommon): Promise<CategoriesList> {
    return request(`${this.baseUrl}/categories`, {}, config).then((r) =>
      r.json()
    );
  }

  /**
   * Get all details of a specific category in an Ecwid store by its ID.
   */
  getById(id: EcwidCategoryId, config: ConfigCommon): Promise<Category> {
    return request(`${this.baseUrl}/categories/${id}`, {}, config).then((r) =>
      r.json()
    );
  }
}
