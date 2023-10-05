export interface Page {
  id: string;
  data: Record<string, unknown>;
  dataVersion: number;
  status: "draft" | "publish";
}
