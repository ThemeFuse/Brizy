import { times } from "underscore";
import {
  itemToPage,
  itemStatusToPageStatus,
  pageStatusToItemStatus
} from "./convertors";
import {
  collectionItemAddPrefix,
  collectionTypeAddPrefix,
  templateAddPrefix
} from "./graphql/convertors";
import { CollectionItemStatus } from "./graphql/types/entities";
import { GetCollectionItem_collectionItem as CollectionItem } from "visual/utils/api/cms/graphql/types/GetCollectionItem";

describe("Testing 'itemStatusToPageStatus' function", () => {
  test("On CollectionItemStatus.draft, return 'draft'", () => {
    expect(itemStatusToPageStatus(CollectionItemStatus.draft)).toBe("draft");
  });

  test("On CollectionItemStatus.published, return 'publish'", () => {
    expect(itemStatusToPageStatus(CollectionItemStatus.published)).toBe(
      "publish"
    );
  });
});

describe("Testing 'pageStatusToItemStatus' function", function() {
  test("On 'draft', return CollectionItemStatus.draft", () => {
    expect(pageStatusToItemStatus("draft")).toBe(CollectionItemStatus.draft);
  });

  test("On 'publish', return CollectionItemStatus.published", () => {
    expect(pageStatusToItemStatus("publish")).toBe(
      CollectionItemStatus.published
    );
  });
});

describe("Testing 'apiToPage' function", function() {
  const seed: CollectionItem[] = times(5, i => ({
    __typename: "CollectionItem",
    id: collectionItemAddPrefix(i + 10),
    title: `Test ${i + 10}`,
    slug: `test-${i + 10}`,
    status: [CollectionItemStatus.draft, CollectionItemStatus.published][i % 2],
    type: {
      __typename: "CollectionType",
      id: collectionTypeAddPrefix(i + 1),
      title: `Test ${i + 1}`
    },
    template: {
      __typename: "Template",
      id: templateAddPrefix(i + 100),
      data: JSON.stringify({ items: times(i, i => i) })
    },
    fields: null,
    createdAt: "1234"
  }));

  seed.forEach(item => {
    const result = itemToPage(item);

    test("Test item", () => {
      expect(result.id).toBe(item.id);
      expect(result.title).toBe(item.title);
      expect(result.slug).toBe(item.slug);
      expect(["draft", "publish"].includes(result.status)).toBe(true);
      expect(result.data).toEqual(JSON.parse(item.template?.data ?? "{}"));
      expect(result.collectionType.id).toBe(item.type.id);
      expect(result.collectionType.title).toBe(item.type.title);
    });
  });
});
