interface Block {
  type: string;
  value: {
    _id?: string;
    items?: Array<Block>;
    // biome-ignore lint: migrated from eslint
    [key: string]: any;
  };
}

export interface Page {
  id: string;
  data: {
    items: Array<Block>;
  };
  status?: "draft" | "publish";
  dataVersion?: number;
}
