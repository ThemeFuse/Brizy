import type { IGlobalBlockRepository } from "visual/ai/application/interfaces/i-global-block-repository";
import type { MenuData } from "visual/global/Config/types/configs/ConfigCommon";
import type { ReduxState } from "visual/redux/types";
import type { EditorMenuItem, MenuAction, SiteConfig } from "../EditorSite";
import { createEditorSite } from "../EditorSite";

const PROJECT_ID = 4531003;
const PAGE_IRI = "/collection_items/220466";

const deployed: SiteConfig = { project: { id: PROJECT_ID } };

/** The chat package's hand-over for one entry. */
const handedOver = (
  overrides: Partial<EditorMenuItem> = {}
): EditorMenuItem => ({
  uid: "appended-uid",
  title: "About",
  slug: "about",
  pageId: PAGE_IRI,
  isCurrent: false,
  ...overrides
});

/** An entry as `config.menuData` already holds it. */
const configItem = (id: string): MenuData["items"][number] => ({
  type: "MenuItem",
  value: {
    id,
    title: "Home",
    url: "/",
    target: "",
    items: [],
    megaMenuItems: [],
    attrTitle: "",
    classes: [],
    liClasses: [],
    current: true,
    editorUrl: `/projects/${PROJECT_ID}/editor/page/220312`
  }
});

interface Harness {
  site: ReturnType<typeof createEditorSite>;
  /** Every action the port dispatched, in order. */
  dispatched: MenuAction[];
}

const harness = (menuData: MenuData[], config: SiteConfig): Harness => {
  const dispatched: MenuAction[] = [];

  const globalBlocks: IGlobalBlockRepository = {
    isSupported: () => true,
    list: () => [],
    create: async () => ({ uid: "gb-1" }),
    delete: async () => undefined
  };

  // Only `menuData` is read, through `menuDataSelector` — the rest of the
  // store never reaches this port.
  const state = { menuData } as unknown as ReduxState;

  const site = createEditorSite(
    () => state,
    (action: MenuAction) => {
      dispatched.push(action);
      return action;
    },
    globalBlocks,
    config
  );

  return { site, dispatched };
};

/** The entries an add/update action carries; a remove carries none. */
const itemsOf = (action: MenuAction): MenuData["items"] =>
  "items" in action.payload ? action.payload.items : [];

/** The `editorUrl` the port built for a single handed-over entry. */
const urlFor = (item: EditorMenuItem, config: SiteConfig): unknown => {
  const { site, dispatched } = harness([], config);

  site.addMenu("main-uid", "mainMenu", [item]);

  return itemsOf(dispatched[0])[0].value.editorUrl;
};

describe("createEditorSite editorUrl", () => {
  const NODE_ENV = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = NODE_ENV;
  });

  it.each([
    {
      case: "a collection-item IRI",
      pageId: PAGE_IRI,
      out: `/projects/${PROJECT_ID}/editor/page/220466`
    },
    {
      case: "a plain numeric id",
      pageId: "220466",
      out: `/projects/${PROJECT_ID}/editor/page/220466`
    },
    // An empty editorUrl disables the item's "edit page" toolbar button, which
    // beats sending the parent window somewhere wrong.
    { case: "an id with no numeric tail", pageId: "/menus/abc", out: "" }
  ])("builds the deployed url from $case", ({ pageId, out }) => {
    expect(urlFor(handedOver({ pageId }), deployed)).toBe(out);
  });

  // The dev server routes /editor/:mode/:id with no project segment and reads
  // pro off the query — see backend/server.js.
  it.each([
    { case: "free", config: deployed, out: "/editor/page/220466" },
    {
      case: "pro",
      config: { ...deployed, pro: { urls: { assets: "/static/pro" } } },
      out: "/editor/page/220466?pro=true"
    }
  ])("drops the project segment in development, $case", ({ config, out }) => {
    process.env.NODE_ENV = "development";

    expect(urlFor(handedOver(), config)).toBe(out);
  });

  it("still reports no url in development when the page id cannot be read", () => {
    process.env.NODE_ENV = "development";

    expect(urlFor(handedOver({ pageId: "/menus/abc" }), deployed)).toBe("");
  });
});

describe("createEditorSite.addMenuItems", () => {
  const existing = (): MenuData[] => [
    { id: "main-uid", name: "mainMenu", items: [configItem("item-1")] }
  ];

  it("appends after the entries the editor already holds", () => {
    const { site, dispatched } = harness(existing(), deployed);

    site.addMenuItems("main-uid", [handedOver()]);

    expect(dispatched).toHaveLength(1);
    expect(itemsOf(dispatched[0])).toEqual([
      // The existing entry is carried over untouched, url and all.
      configItem("item-1"),
      {
        type: "MenuItem",
        value: {
          id: "appended-uid",
          title: "About",
          url: "/about",
          target: "",
          items: [],
          megaMenuItems: [],
          attrTitle: "",
          classes: [],
          liClasses: [],
          current: false,
          editorUrl: `/projects/${PROJECT_ID}/editor/page/220466`
        }
      }
    ]);
  });

  it.each([
    { case: "a menu the editor does not hold", menuUid: "unknown", items: 1 },
    { case: "no entries to append", menuUid: "main-uid", items: 0 }
  ])("dispatches nothing for $case", ({ menuUid, items }) => {
    const { site, dispatched } = harness(existing(), deployed);

    site.addMenuItems(
      menuUid,
      Array.from({ length: items }, () => handedOver())
    );

    expect(dispatched).toHaveLength(0);
  });
});
