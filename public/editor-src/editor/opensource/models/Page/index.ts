interface Block {
  type: string;
  value: {
    _id?: string;
    items?: Array<Block>;
    // eslint-disable-next-line
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
