import { PopupCloudCMS, Rule } from "visual/types";
import { t } from "visual/utils/i18n";
import { getConnection } from "./graphql/apollo";
import * as Gql from "./graphql/gql";
import { errOnEmpty, onCatch } from "./utils";

export function getRulesList(collectionItemId: string): Promise<Rule[]> {
  return Gql.collectionItemFieldBySlug(getConnection(), {
    collectionItemId: collectionItemId,
    collectionItemFieldSlug: "rules"
  })
    .then(r => {
      const value = r?.data?.collectionItemFieldBySlug?.values?.value ?? null;
      if (value) {
        const rules = JSON.parse(value) as Rule[];

        return rules;
      }

      return value;
    })
    .catch(onCatch(t("Failed to fetch api data")));
}

export function updatePopupRules(popup: PopupCloudCMS): Promise<Rule[]> {
  // To think maybe we should contain in store rule's field id
  // and doesn't make an extra request
  return Gql.collectionTypeFieldBySlug(getConnection(), {
    collectionId: popup.collectionType.id,
    collectionFieldSlug: "rules"
  })
    .then(r => r?.data?.collectionTypeFieldBySlug?.id)
    .then(errOnEmpty(t("Invalid api data")))
    .then(collectionTypeFieldId => {
      return Gql.updateCollectionItem(getConnection(), {
        input: {
          id: popup.id,
          fields: [
            {
              type: collectionTypeFieldId,
              values: { value: JSON.stringify(popup.rules) }
            }
          ]
        }
      });
    })
    .then(() => popup.rules)
    .catch(onCatch(t("Failed to update page")));
}
