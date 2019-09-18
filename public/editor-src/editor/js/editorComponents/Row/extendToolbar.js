import { toolbarReverseColumns } from "visual/utils/toolbar";

export function getItems({ v, device }) {
  return [
    toolbarReverseColumns({ v, device, devices: "responsive", state: "normal" })
  ];
}
