import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { searchEcwidProducts } from "visual/utils/api";
import { Product } from "./types/Product";

/**
 * https://api-docs.ecwid.com/reference/search-products#searchresult
 */
export interface ProductsList {
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
  items: Product[];
}

export class Products {
  /**
   * Search or filter products in a store catalog. The response provides full details of found products.
   *
   * https://api-docs.ecwid.com/reference/search-products
   */
  search(config: ConfigCommon): Promise<ProductsList> {
    return searchEcwidProducts(config);
  }
}
