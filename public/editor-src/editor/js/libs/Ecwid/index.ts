import { isFunction } from "es-toolkit";
import { uniqueId } from "es-toolkit/compat";
import { ReplaySubject, Subject } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import {
  ContentRoutes,
  EcwidConfig,
  FooterRoutes
} from "visual/libs/Ecwid/types/EcwidConfig";
import * as EcwidWidget from "visual/libs/Ecwid/types/EcwidWidget";
import { Literal } from "visual/utils/types/Literal";
import { EcwidCartCheckoutStep } from "../../editorComponents/Ecwid/EcwidCart/types/Value";
import {
  EcwidCategoryId,
  EcwidProductId,
  EcwidStoreId
} from "../../global/Ecwid/types";
import { Address, AddressData, EmailData } from "./types/Customer";
import { SearchArgs } from "./types/EcwidWidget";
import { PageType } from "./types/PageType";
import {
  convertEcwidWidget,
  replaceContentLink,
  replaceFooterLink
} from "./utils";

// there is a bug with "onPageLoaded" event in My Account component
// "onPageLoaded" is triggered faster than render is finished
// because we are doing a hacky way to replace links with observer, we need to make sure than we don't have infinite loop
let triedTimes = 0;
let linksWasChanged = false;

const myAccountRedirects = (baseUrl: string) => {
  const node = document.querySelector<HTMLElement>(
    ".ec-store__account-page .ec-footer"
  );

  if (node && node.children.length > 0) {
    replaceFooterLink(node, ".footer__link--my-account", `${baseUrl}/account`);
    replaceFooterLink(
      node,
      ".footer__link--favorites",
      `${baseUrl}/account/favorites`
    );
    replaceFooterLink(node, ".footer__link--track-order", `${baseUrl}/account`);
    replaceFooterLink(node, ".footer__link--shopping-cart", `${baseUrl}/cart`);
    replaceFooterLink(node, ".footer__link--all-products", `${baseUrl}/search`);

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
        window.location.replace("/cart");
        e.stopPropagation();
      });

      linksWasChanged = true;
    }
  }
};

const observerCallback = (
  componentType: "myAccount" | "shoppingBag",
  baseUrl: string
) => {
  if (linksWasChanged || triedTimes >= 10) {
    return true;
  }

  switch (componentType) {
    case "myAccount": {
      myAccountRedirects(baseUrl);
      break;
    }
    case "shoppingBag": {
      shoppingBagRedirects();
      break;
    }
  }

  triedTimes++;
};

const observer = (
  componentType: "myAccount" | "shoppingBag",
  baseUrl: string
) => new MutationObserver(() => observerCallback(componentType, baseUrl));

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
          slugsWithoutIds?: boolean;
        };
      };
    };
  }
}

export type EcwidPageSlug =
  | "cart"
  | "account"
  | "product"
  | "account/favorites"
  | "CATEGORY"
  | "search"
  | EcwidCartCheckoutStep.Address
  | EcwidCartCheckoutStep.Shipping
  | EcwidCartCheckoutStep.Payment;

declare function ecwid_onBodyDone(): void;

declare const Ecwid: {
  init: VoidFunction;
  destroy?: VoidFunction;
  OnAPILoaded: {
    add: (fn: VoidFunction) => void;
  };
  OnPageLoad: {
    add: (fn: (page: PageType) => void | boolean) => void;
  };
  OnPageLoaded: {
    add: (fn: (page: PageType) => void | boolean) => void;
  };
  OnCartChanged: {
    add: (fn: (cart: unknown) => void | boolean) => void;
  };
  OnPageSwitch: {
    add: (fn: (page: PageType) => void | boolean) => void;
  };
  openPage: (
    page: EcwidPageSlug,
    payload?: Record<string, string | number>
  ) => void;
  Cart: {
    addProduct: (id: Literal) => void;
    clear: VoidFunction;
    setAddress: (
      address: Address,
      successCb?: VoidFunction,
      errorCb?: VoidFunction
    ) => void;
    setCustomerEmail: (
      email: string,
      successCb?: VoidFunction,
      errorCb?: VoidFunction
    ) => void;
  };
  refreshConfig?: VoidFunction;
};

const getDefaultConfig = (baseUrl: string): Partial<EcwidConfig> => ({
  redirect: {
    fromFooter: [
      {
        route: `${baseUrl}/account`,
        selector: ".footer__link--my-account"
      },
      {
        route: `${baseUrl}/account`,
        selector: ".footer__link--track-order"
      },
      {
        route: `${baseUrl}/account/favorites`,
        selector: ".footer__link--favorites"
      },
      {
        route: `${baseUrl}/cart`,
        selector: ".footer__link--shopping-cart"
      },
      {
        route: `${baseUrl}/search`,
        selector: ".footer__link--all-products"
      },
      {
        route: `${baseUrl}/search`,
        selector:
          ".ec-cart__body-inner .ec-confirmation .ec-confirmation__body .ec-link"
      }
    ],
    fromContent: [
      {
        route: `${baseUrl}/cart`,
        selector: ".details-product-purchase__checkout"
      },
      {
        route: `${baseUrl}/account/favorites`,
        selector: ".favorite-product__button-view"
      },
      {
        route: "/",
        selector: ".ec-cart--empty .form-control.form-control--done"
      }
    ]
  }
});

const getFooterRoutes = (baseUrl: string) => ({
  [`${baseUrl}/account`]: `${baseUrl}/account`,
  [`${baseUrl}/account/favorites`]: `${baseUrl}/account/favorites`,
  [`${baseUrl}/cart`]: `${baseUrl}/cart`,
  [`${baseUrl}/search`]: `${baseUrl}/search`
});

const getContentRoutes = (baseUrl: string) => ({
  [`${baseUrl}/cart`]: `${baseUrl}/cart`,
  [`${baseUrl}/thank-you`]: `${baseUrl}/thank-you`,
  [`${baseUrl}/account/favorites`]: `${baseUrl}/account/favorites`,
  "/": "/"
});

export class EcwidService {
  private $load: ReplaySubject<void>;
  private $widgets: Subject<EcwidWidget.EcwidWidget>;
  private config: EcwidConfig;
  private wasPrefetched = false;

  private constructor(
    public readonly storeId: EcwidStoreId,
    config: EcwidConfig
  ) {
    this.$load = new ReplaySubject();
    this.$widgets = new Subject();
    this.config = { ...getDefaultConfig(config.baseUrl ?? ""), ...config };

    window.ec = window.ec || {};
    window.ec.config = window.ec.config || {};
    window.ec.config.storefrontUrls = window.ec.config.storefrontUrls || {};

    window.ec.config.storefrontUrls.cleanUrls = true;
    window.ec.config.storefrontUrls.slugsWithoutIds = true;
    window.ec.config.baseUrl = this.config.baseUrl || "/";

    window.ec.storefront = { ...window.ec.storefront, ...config };

    this.$load
      .pipe(
        withLatestFrom(this.$widgets),
        map(([, b]) => b)
      )
      .subscribe((widget) => {
        requestAnimationFrame(() => {
          Ecwid.openPage(widget.type, widget.args);

          const fn = widget?.onPageLoad;
          if (isFunction(fn)) {
            fn();
          }
        });
      });

    this.$widgets.subscribe((widget) => {
      try {
        if (typeof Ecwid !== "undefined") {
          requestAnimationFrame(() => {
            Ecwid.openPage(widget.type, widget.args);
          });
        }
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.error(e);
        }
      }
    });
  }

  prefetchScriptsForCart() {
    const steps = [
      EcwidCartCheckoutStep.Payment,
      EcwidCartCheckoutStep.Address,
      EcwidCartCheckoutStep.Shipping,
      EcwidCartCheckoutStep.Cart
    ];

    steps.forEach((step) => {
      requestAnimationFrame(() => {
        Ecwid.openPage(step, {});
      });
    });
  }

  public loadScripts(config?: { node?: HTMLElement; callback?: VoidFunction }) {
    const { node, callback } = config ?? {};

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

          if (!this.wasPrefetched && this.config.prefetchScripts) {
            this.prefetchScriptsForCart();
            this.wasPrefetched = true;
          }

          callback?.();
        });

        Ecwid.OnPageLoaded.add(() => {
          if (typeof this.config.onPageLoaded === "function") {
            this.config.onPageLoaded();
          }

          if (this.config.redirect && node) {
            this.changeRedirectLinks(node);
          }

          window.dispatchEvent(new Event("resize"));

          if (Array.isArray(this.config.onPageLoadCallbacks)) {
            this.config.onPageLoadCallbacks.forEach((cb) => {
              if (typeof cb === "function") {
                cb();
              }
            });
          }
        });

        Ecwid.OnCartChanged.add(() => {
          if (this.config.redirect && node) {
            this.changeRedirectLinks(node);
          }
        });
      };
      document.body.append(script);
    } else {
      if (typeof Ecwid !== "undefined" && typeof Ecwid.init === "function") {
        Ecwid.init();
        callback?.();
      }
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
    this.loadScripts({ node });
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

  public product(
    id: EcwidProductId,
    node: HTMLElement,
    config?: { clearPrevious?: boolean }
  ) {
    const el = this.setId(node);

    if (config && config.clearPrevious) {
      this.clearWidget(node);
    }

    this.openPage(EcwidWidget.product(el.id, id), node);
  }

  public clearWidget(node: HTMLElement) {
    // INFO: we need this method to clear HTML when we initialize the same widget with different content
    // because this destroy method not working: https://api-docs.ecwid.com/reference/delayed-store-init#dynamic-embedding-of-ecwid-storefront-widget
    node.innerHTML = "";
  }

  public cart(
    node: HTMLElement,
    step?: EcwidCartCheckoutStep,
    config?: { clearPrevious?: boolean; onPageLoad?: VoidFunction }
  ) {
    const onPageLoad = config?.onPageLoad;

    const el = this.setId(node);

    if (config && config.clearPrevious) {
      this.clearWidget(node);
    }

    this.openPage(EcwidWidget.cart(el.id, step, onPageLoad), node);
  }

  public favorites(node: HTMLElement): void {
    const el = this.setId(node);

    this.openPage(EcwidWidget.favorites(el.id), node);
  }

  public search(node: HTMLElement, args?: SearchArgs): void {
    const el = this.setId(node);

    this.openPage(EcwidWidget.search(el.id, args), node);
  }

  public shoppingCart(node?: HTMLElement) {
    this.loadScripts({ node });
    this.$load.subscribe(() => {
      Ecwid.init();

      if (node) {
        observer("shoppingBag", this.config.baseUrl ?? "").observe(node, {
          attributes: true,
          subtree: true
        });
      }
    });
  }

  public myAccount(node: HTMLElement) {
    const el = this.setId(node);
    this.openPage(EcwidWidget.myAccount(el.id), node);

    if (this.config.redirect) {
      observer("myAccount", this.config.baseUrl ?? "").observe(node, {
        attributes: true,
        subtree: true
      });
    }
  }

  public updateConfig(config: EcwidConfig) {
    this.config = config;
    window.ec = window.ec ?? {};
    window.ec.storefront = { ...window.ec?.storefront, ...config };

    Ecwid.refreshConfig?.();
  }

  public addToCart(id: Literal) {
    Ecwid.Cart.addProduct(id);
  }

  public clearCart() {
    Ecwid.Cart.clear();
  }

  public setEmail(data: EmailData): void {
    const { email, successCb, errorCb } = data ?? {};

    Ecwid.Cart.setCustomerEmail(email, successCb, errorCb);
  }

  public setAddress(data?: AddressData): void {
    const { address: _address, successCb, errorCb } = data ?? {};

    const address = _address ?? {
      name: "John Doe",
      companyName: "Glass",
      street: "5th Ave",
      city: "New York",
      countryName: "United States",
      postalCode: "10002",
      stateOrProvinceCode: "NY",
      phone: "+1 234 567 89 00"
    };

    Ecwid.Cart.setAddress(address, successCb, errorCb);
  }

  private changeRedirectLinks(node: HTMLElement) {
    if (this.config.redirect) {
      const baseUrl = this.config.baseUrl ?? "";
      const contentRoutes = getContentRoutes(baseUrl);
      const footerRoutes = getFooterRoutes(baseUrl);

      if (this.config.redirect.fromContent) {
        requestAnimationFrame(() => {
          this.config.redirect?.fromContent.forEach(({ route, selector }) => {
            replaceContentLink(
              node,
              selector,
              contentRoutes[route as ContentRoutes]
            );
          });
        });
      }

      if (this.config.redirect.fromFooter) {
        requestAnimationFrame(() => {
          this.config.redirect?.fromFooter.forEach(({ route, selector }) => {
            replaceFooterLink(
              node,
              selector,
              footerRoutes[route as FooterRoutes]
            );
          });
        });
      }
    }
  }

  getConfig(): EcwidConfig {
    return this.config;
  }
}
