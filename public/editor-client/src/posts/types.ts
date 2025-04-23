import { Response } from "../types/Response";

export interface Posts {
  getPosts: (
    res: Response<{ ID: number; title: string; permalink: string }[]>,
    rej: Response<string>,
    data: GetPostsProps
  ) => void;
  getPostTaxonomies: (
    res: Response<
      {
        name: string;
        label: string;
        public: boolean;
        hierarchical: boolean;
        labels: { name: string; singular_name: string };
      }[]
    >,
    rej: Response<string>,
    data: GetPostTaxonomiesProps
  ) => void;
}

export interface GetPostsProps {
  search?: string;
  include?: string[];
  postType?: string[];
  excludePostType?: string[];
  abortSignal?: AbortSignal;
}

export interface GetPostTaxonomiesProps {
  taxonomy: string;
  abortSignal?: AbortSignal;
}
