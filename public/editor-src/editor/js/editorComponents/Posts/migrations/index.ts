import { getCollectionTypesWithFields } from "visual/utils/api";
import { CreateApolloClientProps } from "visual/utils/api/cms/graphql/apollo";
import { t } from "visual/utils/i18n";
import { Migration } from "visual/utils/migration";
import { isT } from "visual/utils/value";
import { Context } from "../types";
import { m2 } from "./2";
import { m3 } from "./3";

type GetCollectionTypesInfoResult = Context["collectionTypesInfo"];

export const migrations: Migration<GetCollectionTypesInfoResult>[] = [m2, m3];

export async function getCollectionTypesInfo(
  data: CreateApolloClientProps
): Promise<GetCollectionTypesInfoResult> {
  const r = await getCollectionTypesWithFields(data);
  const sources = r.map(({ id, title }) => ({
    id,
    title,
    orderBy: [
      { title: t("ID"), id: "id" },
      { title: t("Title"), id: "title" }
    ]
  }));
  const refsById = r.reduce(
    (acc, { id, fields }) => {
      if (fields) {
        const refs = fields
          .map((field) => {
            if (field.__typename === "CollectionTypeFieldReference") {
              return {
                type: "single" as const,
                id: field.referenceSettings.collectionType.id,
                fieldId: field.id,
                title: field.label
              };
            } else if (
              field.__typename === "CollectionTypeFieldMultiReference"
            ) {
              return {
                type: "multi" as const,
                id: field.multiReferenceSettings.collectionType.id,
                fieldId: field.id,
                title: field.label
              };
            } else {
              return undefined;
            }
          })
          .filter(isT);

        if (refs.length > 0) {
          acc[id] = refs;
        }
      }

      return acc;
    },
    {} as GetCollectionTypesInfoResult["refsById"]
  );

  return {
    sources,
    refsById
  };
}
