import { Rule } from "visual/types/Rule";
import { ApiRule } from "visual/utils/api/adapter";
import { t } from "visual/utils/i18n";
import { apiRuleToEditorRule } from "visual/utils/reader/globalBlocks";
import { CreateApolloClientProps, getConnection } from "./graphql/apollo";
import * as Gql from "./graphql/gql";
import { onCatch } from "./utils";

export function getRulesList(
  collectionItemId: string,
  connection: CreateApolloClientProps
): Promise<Rule[]> {
  return Gql.collectionItemFieldBySlug(getConnection(connection), {
    collectionItemId: collectionItemId,
    collectionItemFieldSlug: "rules"
  })
    .then((r) => {
      const value = r?.data?.collectionItemFieldBySlug?.values?.value ?? null;
      if (value) {
        const rules = JSON.parse(value) as ApiRule[];

        return rules.map(apiRuleToEditorRule);
      }

      return value;
    })
    .catch(onCatch(t("Failed to fetch api data")));
}
