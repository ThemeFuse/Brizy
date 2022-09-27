import { ReplaySubject, Subject } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { uniqueId } from "underscore";
import {
  ContentRoutes,
  EcwidConfig,
  FooterRoutes,
  RedirectConfig
} from "visual/libs/Ecwid/types/EcwidConfig";
import * as EcwidWidget from "visual/libs/Ecwid/types/EcwidWidget";
import {
  convertEcwidWidget,
  replaceContentLink,
  replaceFooterLink
} from "visual/libs/Ecwid/utils";
import {
  EcwidCategoryId,
  EcwidProductId,
  EcwidStoreId
} from "../../global/Ecwid";
import { PageType } from "./types/PageType";

// there is a bug with "onPageLoaded" event in My Account component
// "onPageLoaded" is triggered faster than render is finished
// because we are doing a hacky way to replace links with observer, we need to make sure than we don't have infinite loop
let triedTimes = 0;
let linksWasChanged = false;

const myAccountRedirects = () => {
  const node = document.querySelector<HTMLElement>(
    ".ec-store__account-page .ec-footer"
  );

  if (node && node.children.length > 0) {
    replaceFooterLink(node, ".footer__link--my-account", "/shop/my-account");
    replaceFooterLink(
      node,
      ".footer__link--favorites",
      "/my-account/favorites"
    );
    replaceFooterLink(node, ".footer__link--track-order", "/shop/track-orders");
    replaceFooterLink(node, ".footer__link--shopping-cart", "/shop/cart");

    linksWasChanged = true;
  }
};

const shoppingBagRedirects = () => {
  const node = document.querySelector<HTMLElement>(
    ".ec-minicart .ec-minicart__body"
  );
  if (node && node.parentNode) {
    const clone = node.cloneNode(true);

    node.parentNode.replaceChild(clone, node);

    if (clone) {
      clone.addEventListener("click", (e) => {
        window.location.replace("/shop/cart");
        e.stopPropagation();
      });

      linksWasChanged = true;
    }
  }
};

const observerCallback = (componentType: "myAccount" | "shoppingBag") => {
  if (linksWasChanged || triedTimes >= 10) {
    return true;
  }

  switch (componentType) {
    case "myAccount": {
      myAccountRedirects();
      break;
    }
    case "shoppingBag": {
      shoppingBagRedirects();
      break;
    }
  }

  triedTimes++;
};

const observer = (componentType: "myAccount" | "shoppingBag") =>
  new MutationObserver(() => observerCallback(componentType));

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
      storefront?: EcwidConfig;
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
  OnPageLoaded: {
    add: (fn: (page: PageType) => void | boolean) => void;
  };
  OnPageSwitch: {
    add: (fn: (page: PageType) => void | boolean) => void;
  };
  openPage: (
    page: EcwidPageSlug,
    payload?: Record<string, string | number>
  ) => void;
  refreshConfig?: () => void;
  resizeProductBrowser?: VoidFunction;
};

const defaultConfig: RedirectConfig = {
  redirect: {
    fromFooter: {
      "/shop/my-account": ".footer__link--my-account",
      "/shop/track-orders": ".footer__link--track-order",
      "/my-account/favorites": ".footer__link--favorites",
      "/shop/cart": ".footer__link--shopping-cart"
    },
    fromContent: {
      "/shop/cart": ".details-product-purchase__checkout",
      "/shop/checkout": ".ec-cart__button--checkout",
      "/my-account/thank-you": ".ec-form .form-control--done"
    }
  }
};

const footerRoutes: {
  [k in FooterRoutes]: string;
} = {
  "/shop/my-account": "/shop/my-account",
  "/shop/track-orders": "/shop/track-orders",
  "/my-account/favorites": "/my-account/favorites",
  "/shop/cart": "/shop/cart"
};

const contentRoutes: {
  [k in ContentRoutes]: string;
} = {
  "/shop/cart": "/shop/cart",
  "/shop/checkout": "/shop/checkout",
  "/my-account/thank-you": "/my-account/thank-you"
};

export class EcwidService {
  private $load: ReplaySubject<void>;
  private $widgets: Subject<EcwidWidget.EcwidWidget>;
  private config: EcwidConfig;

  private constructor(
    public readonly storeId: EcwidStoreId,
    config: EcwidConfig
  ) {
    this.$load = new ReplaySubject();
    this.$widgets = new Subject();
    this.config = { ...defaultConfig, ...config };

    window.ec = window.ec || {};
    window.ec.config = window.ec.config || {};
    window.ec.config.storefrontUrls = window.ec.config.storefrontUrls || {};

    window.ec.config.storefrontUrls.cleanUrls = true;
    window.ec.config.baseUrl = "/";

    window.ec.storefront = { ...window.ec.storefront, ...config };

    this.$load
      .pipe(
        withLatestFrom(this.$widgets),
        map(([, b]) => b)
      )
      .subscribe((widget) => Ecwid.openPage(widget.type, widget.args));
  }

  private loadScripts(node?: HTMLElement) {
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

        Ecwid.OnPageLoaded.add(() => {
          if (typeof this.config.onPageLoaded === "function") {
            this.config.onPageLoaded();
          }

          if (this.config.redirect && node) {
            this.changeRedirectLinks(node);
          }

          if (Ecwid && Ecwid.resizeProductBrowser) {
            Ecwid.resizeProductBrowser();
          }
        });
      };
      document.body.append(script);
    } else {
      typeof ecwid_onBodyDone === "function" && ecwid_onBodyDone();
    }
  }

  private static instances = new Map<EcwidStoreId, EcwidService>();

  public static init(storeId: EcwidStoreId, config: EcwidConfig): EcwidService {
    if (EcwidService.instances.has(storeId)) {
      return EcwidService.instances.get(storeId) as EcwidService;
    }

    const instance = new EcwidService(storeId, config);

    EcwidService.instances.set(storeId, instance);

    return instance;
  }

  private openPage(widget: EcwidWidget.EcwidWidget, node: HTMLElement) {
    this.addWidget(widget);
    this.loadScripts(node);
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

  public products(node: HTMLElement) {
    const el = this.setId(node);
    this.openPage(EcwidWidget.products(el.id, 0 as EcwidCategoryId), node);
  }

  public product(id: EcwidProductId, node: HTMLElement) {
    const el = this.setId(node);
    this.openPage(EcwidWidget.product(el.id, id), node);
  }

  public cart(node: HTMLElement) {
    const el = this.setId(node);

    this.openPage(EcwidWidget.cart(el.id), node);
  }

  public shoppingCart(node?: HTMLElement) {
    this.loadScripts(node);
    this.$load.subscribe(() => {
      Ecwid.init();

      if (node) {
        observer("shoppingBag").observe(node, {
          attributes: true,
          subtree: true
        });
      }
    });
  }

  public myAccount(node: HTMLElement) {
    const el = this.setId(node);
    this.openPage(EcwidWidget.myAccount(el.id), node);

    observer("myAccount").observe(node, {
      attributes: true,
      subtree: true
    });
  }

  public updateConfig(config: EcwidConfig) {
    this.config = config;
    window.ec = window.ec ?? {};
    window.ec.storefront = { ...window.ec?.storefront, ...config };

    Ecwid.refreshConfig?.();
  }

  private changeRedirectLinks(node: HTMLElement) {
    if (this.config.redirect) {
      if (this.config.redirect.fromContent) {
        Object.entries(this.config.redirect.fromContent).forEach(
          ([route, selector]) => {
            replaceContentLink(
              node,
              selector,
              contentRoutes[route as ContentRoutes]
            );
          }
        );
      }

      if (this.config.redirect.fromFooter) {
        Object.entries(this.config.redirect.fromFooter).forEach(
          ([route, selector]) => {
            replaceFooterLink(
              node,
              selector,
              footerRoutes[route as FooterRoutes]
            );
          }
        );
      }
    }
  }

  getConfig(): EcwidConfig {
    return this.config;
  }
}
