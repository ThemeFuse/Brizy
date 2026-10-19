import { z } from "zod";
import { createBrizyToolHandlers } from "visual/ai/adapters/tool-registry";
import type {
  AddElementParams,
  IPageRepository
} from "visual/ai/application/interfaces/i-page-repository";
import type { IProjectRepository } from "visual/ai/application/interfaces/i-project-repository";
import { SharedStore } from "visual/plugins/SharedStore";

jest.mock("visual/ai/utils/logger", () => ({
  log: { tools: jest.fn(), repository: jest.fn() }
}));

class FakePageRepository implements IPageRepository {
  getPageStructure = jest.fn();
  addBlock = jest.fn();
  removeBlock = jest.fn();
  moveBlock = jest.fn();
  duplicateBlock = jest.fn();
  clearPage = jest.fn();
  insertTemplate = jest.fn();
  getElementById = jest.fn();
  searchElements = jest.fn();
  addElement = jest.fn((_params: AddElementParams) => ({
    success: true,
    data: {
      elementId: "gallery-wrap",
      childElementId: "gallery-1",
      containerId: "col-1",
      insertedAt: 0
    }
  }));
  removeElement = jest.fn();
  updateElement = jest.fn();
  updateColumn = jest.fn();
  duplicateElement = jest.fn();
  moveElement = jest.fn();
  updateRichText = jest.fn();
  getAvailableIcons = jest.fn();
  getAvailableMenus = jest.fn();
  isPro = jest.fn();
  setPageStatus = jest.fn();
  undo = jest.fn();
}

class FakeProjectRepository implements IProjectRepository {
  getProjectStyles = jest.fn();
  changeStyle = jest.fn();
  addStyle = jest.fn();
  updateStyle = jest.fn();
  duplicateStyle = jest.fn();
  getProjectFonts = jest.fn();
  getGoogleFonts = jest.fn();
  addFont = jest.fn();
  deleteFont = jest.fn();
  changeDefaultFont = jest.fn();
  fontExists = jest.fn(() => true);
}

const setup = () => {
  const pageRepository = new FakePageRepository();
  const handlers = createBrizyToolHandlers(
    pageRepository,
    new FakeProjectRepository(),
    new SharedStore()
  );

  return {
    handlers,
    addElement: pageRepository.addElement,
    getElementById: pageRepository.getElementById,
    updateElement: pageRepository.updateElement
  };
};

const emptySlot = {
  type: "Image",
  value: { _id: expect.any(String), _styles: ["image"] }
};

const photoSlot = (imageSrc: string) => ({
  type: "Image",
  value: {
    _id: expect.any(String),
    _styles: ["image"],
    imageSrc,
    imageType: "external"
  }
});

const carA = "https://images.unsplash.com/car-a.jpg";
const carB = "https://images.unsplash.com/car-b.jpg";
const carC = "https://images.unsplash.com/car-c.jpg";

const addedSlotsSchema = z.object({
  initialProperties: z.object({
    items: z.array(z.object({ value: z.object({ _id: z.string() }) }))
  })
});

describe("addImageGallery", () => {
  it.each([
    {
      case: "starts with one empty slot for a count of one",
      args: { imageCount: 1 },
      initialProperties: { items: [emptySlot] }
    },
    {
      case: "starts with five empty slots for a count of five",
      args: { imageCount: 5 },
      initialProperties: { items: Array.from({ length: 5 }, () => emptySlot) }
    },
    {
      case: "shows the backend's photo in every slot",
      args: { imageCount: 3, imageSrcs: [carA, carB, carC] },
      initialProperties: {
        items: [photoSlot(carA), photoSlot(carB), photoSlot(carC)]
      }
    },
    {
      case: "leaves the slots the backend found no photo for empty",
      args: { imageCount: 3, imageSrcs: [carA] },
      initialProperties: { items: [photoSlot(carA), emptySlot, emptySlot] }
    },
    {
      case: "leaves the slots empty for a description the backend did not resolve",
      args: { imageCount: 2, imageDescription: "sports car" },
      initialProperties: { items: [emptySlot, emptySlot] }
    }
  ])("$case", ({ args, initialProperties }) => {
    const { handlers, addElement } = setup();

    const result = handlers.addImageGallery({ containerId: "col-1", ...args });

    expect(result).toMatchObject({ success: true });
    expect(addElement).toHaveBeenCalledWith({
      containerId: "col-1",
      elementType: "ImageGallery",
      insertIndex: undefined,
      initialProperties
    });
  });

  it("gives every slot its own id", () => {
    const { handlers, addElement } = setup();

    handlers.addImageGallery({ containerId: "col-1", imageCount: 5 });

    const { initialProperties } = addedSlotsSchema.parse(
      addElement.mock.calls[0][0]
    );
    const ids = initialProperties.items.map((item) => item.value._id);
    expect(new Set(ids).size).toBe(5);
  });

  it.each([
    { case: "none", imageCount: undefined },
    { case: "zero", imageCount: 0 },
    { case: "more than thirty", imageCount: 31 },
    { case: "a fraction", imageCount: 2.5 }
  ])("rejects a count of $case and adds nothing", ({ imageCount }) => {
    const { handlers, addElement } = setup();

    const result = handlers.addImageGallery({
      containerId: "col-1",
      imageCount
    });

    expect(result).toMatchObject({ success: false });
    expect(addElement).not.toHaveBeenCalled();
  });

  it("rejects a photo that is not a URL and adds nothing", () => {
    const { handlers, addElement } = setup();

    const result = handlers.addImageGallery({
      containerId: "col-1",
      imageCount: 1,
      imageSrcs: ["sports car"]
    });

    expect(result).toMatchObject({ success: false });
    expect(addElement).not.toHaveBeenCalled();
  });
});

describe("addImage", () => {
  it("drops a description the backend did not resolve", () => {
    const { handlers, addElement } = setup();

    handlers.addImage({ containerId: "col-1", imageDescription: "turtle" });

    expect(addElement).toHaveBeenCalledWith({
      containerId: "col-1",
      elementType: "Image",
      insertIndex: undefined,
      initialProperties: {}
    });
  });
});

const oldA = { type: "Image", value: { _id: "old-a", imageSrc: carA } };
const oldB = { type: "Image", value: { _id: "old-b", imageSrc: carB } };

const galleryFound = (value: Record<string, unknown>) => ({
  success: true,
  data: {
    id: "gallery-1",
    type: "ImageGallery",
    path: [],
    value: { _id: "gallery-1", items: [oldA, oldB], ...value }
  }
});

// A photo joining a default gallery: masonry, lightbox off.
const joined = (imageSrc: string) => ({
  type: "Image",
  value: {
    _id: expect.any(String),
    _styles: ["image"],
    imageSrc,
    imageType: "external",
    linkType: "external",
    linkLightBox: "off",
    sizeType: "custom"
  }
});

describe("addImageGalleryPhotos", () => {
  it.each([
    {
      case: "appends the backend's photos after the gallery's own",
      gallery: {},
      args: { imageCount: 2, imageSrcs: [carC, carA] },
      items: [oldA, oldB, joined(carC), joined(carA)]
    },
    {
      case: "puts the photos at the position asked for",
      gallery: {},
      args: { imageCount: 1, imageSrcs: [carC], insertIndex: 1 },
      items: [oldA, joined(carC), oldB]
    },
    {
      case: "adds empty slots when the backend sent no photo",
      gallery: {},
      args: { imageCount: 1 },
      items: [
        oldA,
        oldB,
        {
          type: "Image",
          value: {
            _id: expect.any(String),
            _styles: ["image"],
            linkType: "external",
            linkLightBox: "off",
            sizeType: "custom"
          }
        }
      ]
    },
    {
      case: "copies a justified gallery's lightbox and sizing",
      gallery: { layout: "justified", lightBox: "on" },
      args: { imageCount: 1, imageSrcs: [carC] },
      items: [
        oldA,
        oldB,
        {
          type: "Image",
          value: {
            ...joined(carC).value,
            linkType: "lightBox",
            linkLightBox: "on",
            sizeType: "original"
          }
        }
      ]
    },
    {
      case: "copies a big-image gallery's heights",
      gallery: {
        layout: "bigImage",
        bigImageImagesHeight: 300,
        tabletBigImageImagesHeight: 200,
        mobileBigImageImagesHeight: 100
      },
      args: { imageCount: 1, imageSrcs: [carC] },
      items: [
        oldA,
        oldB,
        {
          type: "Image",
          value: {
            ...joined(carC).value,
            height: 300,
            heightSuffix: "px",
            tabletHeight: 200,
            tabletHeightSuffix: "px",
            mobileHeight: 100,
            mobileHeightSuffix: "px"
          }
        }
      ]
    }
  ])("$case", ({ gallery, args, items }) => {
    const { handlers, getElementById, updateElement } = setup();
    getElementById.mockReturnValue(galleryFound(gallery));
    updateElement.mockReturnValue({ success: true });

    const result = handlers.addImageGalleryPhotos({
      containerId: "gallery-1",
      ...args
    });

    expect(result).toMatchObject({ success: true });
    expect(updateElement).toHaveBeenCalledWith({
      elementId: "gallery-1",
      elementType: "ImageGallery",
      changes: { items }
    });
  });

  it.each([
    {
      case: "an element that is not a gallery",
      found: {
        success: true,
        data: { id: "col-1", type: "Column", path: [], value: {} }
      },
      args: { imageCount: 1 }
    },
    {
      case: "a gallery that is not on the page",
      found: { success: false, error: "not found" },
      args: { imageCount: 1 }
    },
    {
      case: "a call without a count",
      found: galleryFound({}),
      args: {}
    }
  ])("rejects $case and changes nothing", ({ found, args }) => {
    const { handlers, getElementById, updateElement } = setup();
    getElementById.mockReturnValue(found);

    const result = handlers.addImageGalleryPhotos({
      containerId: "gallery-1",
      ...args
    });

    expect(result).toMatchObject({ success: false });
    expect(updateElement).not.toHaveBeenCalled();
  });
});
