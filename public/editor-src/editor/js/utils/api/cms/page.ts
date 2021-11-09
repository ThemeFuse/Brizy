/* eslint-disable @typescript-eslint/camelcase */
import { PageCloud } from "visual/types";
import { isT } from "visual/utils/value";
import { t } from "visual/utils/i18n";
import { paginationData } from "visual/utils/api/const";
import { itemToPage, pageStatusToItemStatus } from "./convertors";
import { getConnection } from "./graphql/apollo";
import * as Gql from "./graphql/gql";
import { errOnEmpty, onCatch } from "./utils";
import { UpdateCollectionItem_updateCollectionItem_collectionItem } from "./graphql/types/UpdateCollectionItem";

export function getPages(collectionTypeId: string): Promise<PageCloud[]> {
  const page = paginationData.page;
  const itemsPerPage = paginationData.count;

  return Gql.getCollectionItems(getConnection(), {
    collectionTypeId,
    page,
    itemsPerPage
  })
    .then(r => r?.data?.collectionItems?.collection)
    .then(errOnEmpty(t("Invalid api data")))
    .then(pages => pages.filter(isT).map(itemToPage))
    .catch(onCatch(t("Failed to fetch api data")));
}

export function getPage(id: string): Promise<PageCloud> {
  return Gql.getCollectionItem(getConnection(), { id })
    .then(r => r?.data?.collectionItem)
    .then(errOnEmpty(t("Invalid api data")))
    .then(itemToPage)
    .catch(onCatch(t("Failed to fetch api data")));
}

export function updatePage(
  page: PageCloud,
  meta: { is_autosave?: 1 | 0 } = {}
): Promise<UpdateCollectionItem_updateCollectionItem_collectionItem | void> {
  /*
   * WARNING: temporary solution to let only request with publish intent pass.
   * This behavior should be done at a higher level, but is left here
   * until we have a better architecture around the requests and the draft / revision system
   */
  if (meta.is_autosave !== 0) {
    return Promise.resolve();
  }

  const data = JSON.stringify(page.data);

  return Gql.updateCollectionItem(getConnection(), {
    input: {
      id: page.id,
      slug: page.slug,
      pageData: data,
      status: pageStatusToItemStatus(page.status)
    }
  })
    .then(r => r.data?.updateCollectionItem?.collectionItem)
    .then(errOnEmpty(t("Invalid api data")))
    .catch(onCatch(t("Failed to update page")));
}

// export function createPage(
//   data: Pick<PageCloudCMS, "title" | "slug" | "data">,
//   collectionId: number
// ): Promise<PageCloudCMS> {
//   const collectionTypeId = collectionTypeAddPrefix(collectionId);

//   return Gql.createTemplate(getConnection(), {
//     input: {
//       title: data.title,
//       data: JSON.stringify(data.data),
//       type: collectionTypeId
//     }
//   })
//     .then(r => r.data?.createTemplate?.template)
//     .then(errOnEmpty)
//     .then(template => {
//       return Gql.createCollectionItem(getConnection(), {
//         input: {
//           title: data.title,
//           slug: data.slug,
//           type: collectionTypeId,
//           template: template.id
//         }
//       });
//     })
//     .then(r => r.data?.createCollectionItem?.collectionItem)
//     .then(errOnEmpty)
//     .then(apiToPage)
//     .catch(onCatch("Failed to create page"));
// }

// export function deletePage(id: number): Promise<void> {
//   return Gql.deleteCollectionItem(getConnection(), id)
//     .then(() => undefined)
//     .catch(onCatch("Failed to remove page"));
// }
