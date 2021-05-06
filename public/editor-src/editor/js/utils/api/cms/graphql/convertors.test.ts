import { times } from "underscore";
import {
  collectionItemAddPrefix,
  collectionItemFieldAddPrefix,
  collectionItemFieldTrimPrefix,
  collectionItemTrimPrefix,
  collectionTypeAddPrefix,
  collectionTypeFieldAddPrefix,
  collectionTypeFieldTrimPrefix,
  collectionTypeTrimPrefix,
  projectAddPrefix,
  projectTrimPrefix,
  templateAddPrefix,
  templateTrimPrefix
} from "visual/utils/api/cms/graphql/convertors";

const testAddPrefix = (fn: (n: number) => string, prefix: string): void => {
  const seed = times(10, i => i + 1);

  seed.forEach(id => {
    test(`${id} should be "${prefix}${id}"`, () => {
      expect(fn(id)).toBe(`${prefix}${id}`);
    });
  });
};

const testTrimPrefix = (fn: (n: string) => number, prefix: string): void => {
  const seed: [string, number][] = times(10, i => [`${prefix}${i + 1}`, i + 1]);

  test.each(seed)("%s should be %d", (str, n) => expect(fn(str)).toBe(n));
};

describe("Testing 'projectAddPrefix' function", () =>
  testAddPrefix(projectAddPrefix, "/data/"));

describe("Testing 'projectTrimPrefix' function", () =>
  testTrimPrefix(projectTrimPrefix, "/data/"));

describe("Testing 'collectionTypeAddPrefix' function", () =>
  testAddPrefix(collectionTypeAddPrefix, "/collection_types/"));

describe("Testing 'collectionTypeTrimPrefix' function", () =>
  testTrimPrefix(collectionTypeTrimPrefix, "/collection_types/"));

describe("Testing 'collectionTypeFieldAddPrefix' function", () =>
  testAddPrefix(collectionTypeFieldAddPrefix, "/collection_type_fields/"));

describe("Testing 'collectionTypeFieldTrimPrefix' function", () =>
  testTrimPrefix(collectionTypeFieldTrimPrefix, "/collection_type_fields/"));

describe("Testing 'collectionItemAddPrefix' function", () =>
  testAddPrefix(collectionItemAddPrefix, "/collection_items/"));

describe("Testing 'collectionItemTrimPrefix' function", () =>
  testTrimPrefix(collectionItemTrimPrefix, "/collection_items/"));

describe("Testing 'collectionItemFieldAddPrefix' function", () =>
  testAddPrefix(collectionItemFieldAddPrefix, "/collection_item_fields/"));

describe("Testing 'collectionItemFieldTrimPrefix' function", () =>
  testTrimPrefix(collectionItemFieldTrimPrefix, "/collection_item_fields/"));

describe("Testing 'templateAddPrefix' function", () =>
  testAddPrefix(templateAddPrefix, "/templates/"));

describe("Testing 'templateTrimPrefix' function", () =>
  testTrimPrefix(templateTrimPrefix, "/templates/"));
