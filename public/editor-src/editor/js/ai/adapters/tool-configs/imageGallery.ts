import {
  addImageGalleryPhotosPropsSchema,
  addImageGalleryPropsSchema,
  containerIdSchema,
  imageGalleryPropsSchema,
  insertIndexSchema
} from "@brizy/ai-tools";
import { z } from "zod";
import { flattenDefaultValue } from "visual/editorComponents/EditorComponent/utils";
import galleryDefaultValue from "visual/editorComponents/ImageGallery/defaultValue.json";
import {
  getPatchExtraData,
  mergeLinkType
} from "visual/editorComponents/ImageGallery/utils";
import { SizeType } from "visual/global/Config/types/configs/common";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { ImageType } from "visual/utils/image/types";
import { uuid } from "visual/utils/uuid";
import { log } from "../../utils/logger";
import { withAllFontFamilyNormalize } from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

// imageSrcs is never offered to the model: the chat backend resolves the
// model's imageDescription into stock photo URLs and sends them here instead.
const addImageGallerySchema = addImageGalleryPropsSchema.extend({
  imageSrcs: z.array(z.string().url()).max(30).optional()
});

const galleryImagesSchema = addImageGallerySchema.pick({
  imageCount: true,
  imageSrcs: true
});

// A slot shaped like the two the gallery's shortcode starts with, showing
// the photo when there is one and left empty when there is not.
const createGalleryImage = (imageSrc: string | undefined) => ({
  type: ElementTypes.Image,
  value:
    imageSrc === undefined
      ? { _id: uuid(), _styles: ["image"] }
      : {
          _id: uuid(),
          _styles: ["image"],
          imageSrc,
          imageType: ImageType.External
        }
});

export const withImageGalleryDefaults = withAllFontFamilyNormalize;
export const addImageGalleryConfig: AddToolConfig = {
  kind: "add",
  alias: "addImageGallery",
  elementType: ElementTypes.ImageGallery,
  schema: addImageGallerySchema,
  defaults: withImageGalleryDefaults,
  // None of these is a gallery prop: the count and the photos replace the
  // shortcode's two empty slots, and a description the backend did not
  // resolve leaves them empty.
  transformProps: ({
    imageCount,
    imageSrcs,
    imageDescription: _unresolvedDescription,
    ...props
  }) => {
    const images = galleryImagesSchema.parse({ imageCount, imageSrcs });

    return {
      ...props,
      items: Array.from({ length: images.imageCount }, (_, index) =>
        createGalleryImage(images.imageSrcs?.[index])
      )
    };
  }
};
const addImageGalleryPhotosSchema = addImageGalleryPhotosPropsSchema.extend({
  imageSrcs: z.array(z.string().url()).max(30).optional()
});

// A stored height of null means "not set"; the gallery reads it as absent.
const bigImageHeightSchema = z
  .number()
  .nullish()
  .transform((height) => height ?? undefined);

// What a photo joining a gallery copies from it, the way the gallery's own
// upload does, plus the items it joins. A gallery the AI created stores none
// of the settings, so they are read over the gallery's defaults.
const joinedGallerySchema = z.object({
  layout: z.enum(["masonry", "grid", "justified", "bigImage"]),
  lightBox: z.enum(["on", "off"]),
  bigImageImagesHeight: bigImageHeightSchema,
  tabletBigImageImagesHeight: bigImageHeightSchema,
  mobileBigImageImagesHeight: bigImageHeightSchema,
  items: z.array(z.unknown())
});

const galleryDefaults = flattenDefaultValue(galleryDefaultValue);

const joiningFields = (gallery: z.infer<typeof joinedGallerySchema>) => ({
  ...getPatchExtraData({
    layout: gallery.layout,
    bigImageImagesHeight: gallery.bigImageImagesHeight,
    tabletBigImageImagesHeight: gallery.tabletBigImageImagesHeight,
    mobileBigImageImagesHeight: gallery.mobileBigImageImagesHeight
  }),
  ...mergeLinkType(gallery.lightBox),
  sizeType: gallery.layout === "justified" ? SizeType.original : SizeType.custom
});

export const addImageGalleryPhotosConfig: AddToolConfig = {
  kind: "add",
  alias: "addImageGalleryPhotos",
  elementType: ElementTypes.ImageGallery,
  schema: addImageGalleryPhotosSchema,
  handler: (deps, args) => {
    log.tools("addImageGalleryPhotos input %o", args);
    const {
      containerId,
      insertIndex,
      imageDescription: _unresolvedDescription,
      ...props
    } = args;

    const galleryId = containerIdSchema.safeParse(containerId);
    if (!galleryId.success) {
      return { success: false, error: galleryId.error.message };
    }
    const position = insertIndexSchema.safeParse(insertIndex);
    if (!position.success) {
      return { success: false, error: position.error.message };
    }
    const photos = addImageGalleryPhotosSchema.safeParse(props);
    if (!photos.success) {
      return { success: false, error: photos.error.message };
    }

    const found = deps.pageRepository.getElementById(galleryId.data);
    if (!found.success || found.data === undefined) {
      return {
        success: false,
        error: found.error ?? `Element "${galleryId.data}" not found`
      };
    }
    if (found.data.type !== ElementTypes.ImageGallery) {
      return {
        success: false,
        error: `Element "${galleryId.data}" is a ${found.data.type}, not an ImageGallery: pass the gallery's id as containerId.`
      };
    }
    const gallery = joinedGallerySchema.safeParse({
      ...galleryDefaults,
      ...found.data.value
    });
    if (!gallery.success) {
      return { success: false, error: gallery.error.message };
    }

    const joining = joiningFields(gallery.data);
    const newImages = Array.from(
      { length: photos.data.imageCount },
      (_, index) => {
        const image = createGalleryImage(photos.data.imageSrcs?.[index]);
        return { ...image, value: { ...image.value, ...joining } };
      }
    );
    const { items } = gallery.data;
    const at = Math.min(position.data ?? items.length, items.length);

    const result = deps.pageRepository.updateElement({
      elementId: galleryId.data,
      elementType: ElementTypes.ImageGallery,
      changes: {
        items: [...items.slice(0, at), ...newImages, ...items.slice(at)]
      }
    });
    log.tools("addImageGalleryPhotos output %o", result);
    return result;
  }
};

export const updateImageGalleryConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateImageGallery",
  elementType: ElementTypes.ImageGallery,
  schema: imageGalleryPropsSchema,
  defaults: withImageGalleryDefaults
};
