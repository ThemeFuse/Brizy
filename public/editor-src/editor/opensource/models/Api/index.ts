import { CollectionItems } from "./CollectionItems";
import { CollectionTypes } from "./CollectionTypes";
import { CustomFile } from "./CustomFile";
import { DefaultKits } from "./DefaultKits";
import { DefaultLayouts } from "./DefaultLayouts";
import { DefaultPopups } from "./DefaultPopups";
import { DefaultStories } from "./DefaultStories";
import { Media } from "./Media";
import { Screenshots } from "./Screenshots";

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
