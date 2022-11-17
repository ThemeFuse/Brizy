import { Extensions } from "visual/component/Options/types/dev/ImageUpload/Types";
import { checkValue } from "visual/utils/checkValue";

export function int(a: string): number {
  return parseInt(a, 10);
}

export function outerHeight(node: HTMLElement): number | undefined {
  let height = node.clientHeight;
  const computedStyle = node.ownerDocument.defaultView?.getComputedStyle(node);
  if (computedStyle) {
    height += int(computedStyle.borderTopWidth);
    height += int(computedStyle.borderBottomWidth);
    return height;
  }
  return undefined;
}

export function outerWidth(node: HTMLElement): number | undefined {
  let width = node.clientWidth;
  const computedStyle = node.ownerDocument.defaultView?.getComputedStyle(node);
  if (computedStyle) {
    width += int(computedStyle.borderLeftWidth);
    width += int(computedStyle.borderRightWidth);
    return width;
  }

  return undefined;
}

export const getExtensionsMessage = (arr: Extensions[]): string => {
  const _arr = arr.map((el) => el.toUpperCase());
  const lastElement = _arr[_arr.length - 1];

  if (!lastElement) {
    return "";
  }

  const withoutLast = _arr.slice(0, _arr.length - 1);
  return withoutLast.join(", ").concat(" or ", lastElement);
};

export const getExtension = checkValue<Extensions>([
  "gif",
  "jpeg",
  "jpg",
  "png",
  "svg"
]);

export const isValidExtension = (
  extension: string | undefined,
  acceptedExtensions: Extensions[]
): boolean => {
  const _extension = getExtension(extension);
  return _extension ? acceptedExtensions.includes(_extension) : false;
};
