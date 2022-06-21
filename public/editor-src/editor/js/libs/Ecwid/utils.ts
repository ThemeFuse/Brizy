import { EcwidWidget } from "./types/EcwidWidget";

export function convertEcwidWidget(
  widget: EcwidWidget
): { widgetType: "ProductBrowser"; id: string; arg: string[] } {
  switch (widget.type) {
    case "cart":
    case "account":
      return {
        id: widget.id,
        widgetType: "ProductBrowser",
        arg: [`id=${widget.id}`]
      };
    case "product":
      return {
        id: widget.id,
        widgetType: "ProductBrowser",
        arg: [`id=${widget.id}`, `productId=${widget.args.id}`]
      };
    case "CATEGORY":
      return {
        id: widget.id,
        widgetType: "ProductBrowser",
        arg: [`id=${widget.id}`, `categoryId=${widget.args.categoryId}`]
      };
  }
}
