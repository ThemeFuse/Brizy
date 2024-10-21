import { Output } from "@/types/utils";

export interface Page {
  id: string;
  data: Record<string, unknown>;
  dataVersion: number;
  status: "draft" | "publish";
  compiled?: Output;
  dependencies?: Record<string, unknown>;
}
