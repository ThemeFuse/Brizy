import { toolbarReverseColumns } from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  return [];
}

export function getItemsForTablet(v) {
  const device = "tablet";

  return [toolbarReverseColumns({ v, device })];
}

export function getItemsForMobile(v) {
  const device = "mobile";

  return [toolbarReverseColumns({ v, device })];
}
