export interface Page {
  id: string;
  data: {
    items: Array<Record<string, string>>;
  };
  status?: "draft" | "publish";
  dataVersion?: number;
}
