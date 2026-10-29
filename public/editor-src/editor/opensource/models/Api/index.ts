import type { CollectionItems } from "./CollectionItems";
import type { CollectionTypes } from "./CollectionTypes";
import type { CustomFile } from "./CustomFile";
import type { DefaultKits } from "./DefaultKits";
import type { DefaultLayouts } from "./DefaultLayouts";
import type { DefaultPopups } from "./DefaultPopups";
import type { DefaultStories } from "./DefaultStories";
import type { Media } from "./Media";
import type { Screenshots } from "./Screenshots";

export interface Api {
  // Media
  media?: Media;

  // CustomFile
  customFile?: CustomFile;

  // Default Kits
  defaultKits?: DefaultKits;

  // Default Popups
  defaultPopups?: DefaultPopups;

  // Default Layouts
  defaultLayouts?: DefaultLayouts;

  // Default Stories
  defaultStories?: DefaultStories;

  // Screenshots
  screenshots?: Screenshots;

  // CollectionTypes
  collectionTypes?: CollectionTypes;

  // CollectionItems
  collectionItems?: CollectionItems;
}
