import { isT } from "fp-utilities";
import { Dictionary } from "visual/types/utils";
import { getCustomersAndCollectionTypes } from "visual/utils/api/cms";
import { CreateApolloClientProps } from "visual/utils/api/cms/graphql/apollo";
import { GetCustomerAndCollection_customers_collection as CustomerAPI } from "visual/utils/api/cms/graphql/types/GetCustomerAndCollection";

export interface Base {
  value: string;
  title: string;
}

interface Collection extends Base {
  slug?: string | null;
}

export type Refs = Dictionary<
  {
    type: "single" | "multi";
    value: string;
    title: string;
    fieldId: string;
  }[]
>;

export interface GetCustomersAndCollectionTypes {
  collections: {
    types: Collection[];
    refsById: Refs;
  };
  customers: {
    types: Base[];
    groups: Base[];
  };
}

const formatCustomer = (c: CustomerAPI): Base => {
  const { id, email, firstName, lastName } = c;
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();

  return {
    value: id,
    title: fullName || email
  };
};

export async function getCustomerAndCollectionTypes(
  data: CreateApolloClientProps
): Promise<GetCustomersAndCollectionTypes> {
  const r = await getCustomersAndCollectionTypes(data);
  const { collectionTypes, customers, customerGroups } = r;

  const _collectionTypes = collectionTypes.filter(
    (item) => item.slug !== "product" && item.slug !== "category"
  );

  const types = _collectionTypes.map(({ id, title }) => ({ value: id, title }));
  const refsById = _collectionTypes.reduce((acc, { id, fields }) => {
    if (fields) {
      const refs = fields
        .map((field) => {
          if (field.__typename === "CollectionTypeFieldReference") {
            return {
              type: "single" as const,
              value: field.referenceSettings.collectionType.id,
              title: field.label,
              fieldId: field.id
            };
          } else if (field.__typename === "CollectionTypeFieldMultiReference") {
            return {
              type: "multi" as const,
              value: field.multiReferenceSettings.collectionType.id,
              title: field.label,
              fieldId: field.id
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
  }, {} as Refs);

  return {
    collections: {
      types,
      refsById
    },
    customers: {
      types: customers.map(formatCustomer),
      groups: customerGroups.map((g) => ({
        value: g.id,
        title: g.name ?? g.id
      }))
    }
  };
}
