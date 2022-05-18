import { uniqueId } from "underscore";
import { Subject, ReplaySubject } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import {
  EcwidCategoryId,
  EcwidProductId,
  EcwidStoreId
} from "../../global/Ecwid";
import { PageType } from "./types/PageType";
import * as EcwidWidget from "visual/libs/Ecwid/types/EcwidWidget";
import { convertEcwidWidget } from "visual/libs/Ecwid/utils";

declare global {
  interface Window {
    _xnext_initialization_scripts?: Array<{
      widgetType: "ProductBrowser";
      id: string;
      arg: string[];
    }>;
    ecwid_script_defer: boolean;
    ecwid_dynamic_widgets: boolean;
    ec?: {
      config?: {
        baseUrl?: string;
        storefrontUrls?: {
          cleanUrls?: boolean;
        };
      };
    };
  }
}

export type EcwidPageSlug = "cart" | "account" | "product" | "CATEGORY";

declare function ecwid_onBodyDone(): void;

declare const Ecwid: {
  init: () => void;
  destroy?: () => void;
  OnAPILoaded: {
    add: (fn: () => void) => void;
  };
  OnPageLoad: {
    add: (fn: (page: PageType) => void | boolean) => void;
  };
  OnPageSwitch: {
    add: (fn: (page: PageType) => void | boolean) => void;
  };
  openPage: (
    page: EcwidPageSlug,
    payload?: Record<string, string | number>
  ) => void;
};

export class EcwidService {
  private $load: ReplaySubject<void>;
  private $widgets: Subject<EcwidWidget.EcwidWidget>;

  private constructor(public readonly storeId: EcwidStoreId) {
    this.$load = new ReplaySubject();
    this.$widgets = new Subject();

    window.ec = window.ec || {};
    window.ec.config = window.ec.config || {};
    window.ec.config.storefrontUrls = window.ec.config.storefrontUrls || {};

    window.ec.config.storefrontUrls.cleanUrls = true;
    window.ec.config.baseUrl = "/";

    this.$load
      .pipe(
        withLatestFrom(this.$widgets),
        map(([, b]) => b)
      )
      .subscribe(widget => Ecwid.openPage(widget.type, widget.args));

    this.overwritePageSwitch();
  }

  private loadScripts() {
    if (!document.getElementById("ecwid-script")) {
      window.ecwid_script_defer = true;
      window.ecwid_dynamic_widgets = true;

      const script = document.createElement("script");

      script.id = `ecwid-script`;
      script.src = `https://app.ecwid.com/script.js?${this.storeId}&data_platform=code`;
      script.type = "text/javascript";
      script.onload = () => {
        Ecwid.OnAPILoaded.add(() => {
          this.$load.next();
        });
      };
      document.body.append(script);
    } else {
      typeof ecwid_onBodyDone === "function" && ecwid_onBodyDone();
    }
  }

  private static instances = new Map<EcwidStoreId, EcwidService>();

  public static init(storeId: EcwidStoreId): EcwidService {
    if (EcwidService.instances.has(storeId)) {
      return EcwidService.instances.get(storeId) as EcwidService;
    }

    const instance = new EcwidService(storeId);

    EcwidService.instances.set(storeId, instance);

    return instance;
  }

  private openPage(widget: EcwidWidget.EcwidWidget) {
    this.addWidget(widget);
    this.loadScripts();
    this.$widgets.next(widget);
  }

  private setId(node: HTMLElement): HTMLElement {
    const id = node.id || uniqueId("ecwid-widget-");

    if (!node.id) {
      node.id = id;
    }

    return node;
  }

  private addWidget(widget: EcwidWidget.EcwidWidget): void {
    const widgets = [convertEcwidWidget(widget)];

    typeof Ecwid !== "undefined" && Ecwid.destroy && Ecwid.destroy();

    window._xnext_initialization_scripts = widgets;
  }

  private overwritePageSwitch() {
    this.$load.subscribe(() => {
      Ecwid.OnAPILoaded.add(function() {
        Ecwid.OnPageSwitch.add((page): boolean => {
          switch (page.type) {
            case "CART": {
              location.href = "/cart";
              return false;
            }
            case "ADDRESS_BOOK":
            case "ACCOUNT_ROOT": {
              location.href = "/my-account";
              return false;
            }
            case "CATEGORY": {
              if (page.categoryId) {
                location.href = `/products/category/${page.categoryId}`;
              } else {
                location.href = `/products`;
              }
              return false;
            }
            case "PRODUCT": {
              location.href = `/products/${page.productId}`;
              return false;
            }
            case "SEARCH": {
              location.href = `/products/?search=${page.keywords}`;
              return false;
            }
            case "SIGN_IN":
            case "CHECKOUT_ADDRESS":
            case "CHECKOUT_PAYMENT_DETAILS":
            case "FAVORITES":
            case "ORDER_CONFIRMATION":
            case "TERMS":
              return true;
          }
        });
      });
    });
  }

  public products(node: HTMLElement) {
    const el = this.setId(node);
    this.openPage(EcwidWidget.products(el.id, 0 as EcwidCategoryId));
  }

  public product(id: EcwidProductId, node: HTMLElement) {
    const el = this.setId(node);
    this.openPage(EcwidWidget.product(el.id, id));
  }

  public cart(node: HTMLElement) {
    const el = this.setId(node);

    this.openPage(EcwidWidget.cart(el.id));
  }

  public shoppingCart() {
    this.loadScripts();
    this.$load.subscribe(() => {
      Ecwid.init();
    });
  }

  public myAccount(node: HTMLElement) {
    const el = this.setId(node);
    this.openPage(EcwidWidget.myAccount(el.id));
  }
}
