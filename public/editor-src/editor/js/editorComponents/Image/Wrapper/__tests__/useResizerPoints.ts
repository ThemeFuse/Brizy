import { transformRestrictions } from "visual/component/BoxResizer/transforms";
import type { Point } from "visual/component/BoxResizer/types";
import type { EditorComponentContextValue } from "visual/editorComponents/EditorComponent/EditorComponentContext";
import { SizeType } from "visual/global/Config/types/configs/common";
import { ComponentTypes } from "visual/providers/EditorComponentProvider/ComponentTypes";
import { Sheet } from "visual/providers/StyleProvider/Sheet";
import type { DeviceMode } from "visual/types";
import { ImageType } from "visual/utils/image/types";
import type { Meta, V } from "../../types";
import useResizerPoints from "../useResizerPoints";

const corners: Point[] = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
const all: Point[] = [
  "topLeft",
  "topCenter",
  "topRight",
  "centerLeft",
  "centerRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight"
];

const image: V = {
  className: "",
  zoom: 100,
  width: 400,
  height: 100,
  tabletWidth: 300,
  tabletHeight: 100,
  mobileWidth: 200,
  mobileHeight: 100,
  imageWidth: 400,
  imageHeight: 225,
  widthSuffix: "px",
  heightSuffix: "%",
  imageSrc: "https://example.com/photo.jpg",
  imageFileName: "photo.jpg",
  imageExtension: "jpg",
  imagePopulation: "",
  sizeType: SizeType.custom,
  imageType: ImageType.Internal,
  alt: "",
  size: 100,
  sizeSuffix: "%",
  tabletSize: 100,
  mobileSize: 100,
  positionY: 50,
  positionX: 50,
  offsetX: 0,
  offsetY: 0,
  linkType: "external",
  linkAnchor: "",
  linkToSlide: 1,
  linkExternalBlank: "off",
  linkExternalRel: "off",
  linkLightBox: "off",
  showOriginalImage: "off",
  linkExternalType: "linkExternal",
  linkPopup: "",
  linkUpload: "",
  hoverImageSrc: "",
  hoverImageWidth: 0,
  hoverImageHeight: 0,
  hoverPositionX: 50,
  hoverPositionY: 50,
  hoverHeight: 100,
  hoverImageExtension: "",
  hoverImage: "",
  hoverImageFileName: "",
  hoverImagePopulation: "",
  tabletWidthSuffix: "px",
  tabletHeightSuffix: "%",
  mobileWidthSuffix: "px",
  mobileHeightSuffix: "%",
  tooltipOffset: 10,
  tooltipText: "",
  tooltipTriggerClick: "off",
  tooltipPlacement: "top",
  customCSS: "",
  enableLazyLoad: "on",
  enableFetchPriority: "off"
};

const meta: Meta = {
  desktopW: 1170,
  tabletW: 768,
  mobileW: 430,
  gallery: { inGallery: false },
  _dc: {}
};

const context: EditorComponentContextValue = {
  dynamicContent: { itemId: "", config: undefined },
  sheet: new Sheet(),
  componentTypes: new ComponentTypes()
};

interface Case {
  case: string;
  value: Partial<V>;
  device: DeviceMode;
  key: "width" | "size";
  points: Point[];
  out: { min: number; max: number };
}

describe("useResizerPoints", () => {
  it.each<Case>([
    {
      case: "an external image with a custom px width",
      value: { imageType: ImageType.External },
      device: "desktop",
      key: "width",
      points: corners,
      out: { min: 5, max: 1170 }
    },
    {
      case: "an external image with a custom px width",
      value: { imageType: ImageType.External },
      device: "tablet",
      key: "width",
      points: corners,
      out: { min: 5, max: 768 }
    },
    {
      case: "an external image with a custom px width",
      value: { imageType: ImageType.External },
      device: "mobile",
      key: "width",
      points: corners,
      out: { min: 5, max: 430 }
    },
    {
      case: "an Unsplash image with a custom px width",
      value: { imageType: ImageType.Unsplash },
      device: "desktop",
      key: "width",
      points: corners,
      out: { min: 5, max: 1170 }
    },
    {
      case: "an external image with a custom % width",
      value: { imageType: ImageType.External, width: 45, widthSuffix: "%" },
      device: "desktop",
      key: "width",
      points: corners,
      out: { min: 5, max: 100 }
    },
    {
      case: "an external image at its original size",
      value: { imageType: ImageType.External, sizeType: SizeType.original },
      device: "desktop",
      key: "size",
      points: corners,
      out: { min: 5, max: 100 }
    },
    {
      case: "a media library image with a custom px width",
      value: {},
      device: "desktop",
      key: "width",
      points: all,
      out: { min: 5, max: 1170 }
    }
  ])(
    "limits the $key of $case on $device",
    ({ value, device, key, points, out }) => {
      const v = { ...image, ...value };

      const resizer = useResizerPoints({
        v,
        meta,
        gallery: undefined,
        context
      });

      expect(resizer.points).toEqual(points);
      // the limits BoxResizer clamps a drag to
      expect(
        transformRestrictions(v, device, resizer.restrictions)[key]
      ).toEqual(out);
    }
  );
});
