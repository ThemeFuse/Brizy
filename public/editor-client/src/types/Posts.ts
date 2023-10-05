import { Response } from "./Response";

type OrderBy = {
  id: string;
  title: string;
};

type PostSources = {
  sources: { id: string; title: string; orderBy: OrderBy[] }[];
};

export interface Posts {
  handler: (res: Response<PostSources>, rej: Response<string>) => void;
}
