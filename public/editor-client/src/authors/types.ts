import { Response } from "../types/Response";

export interface Authors {
  getAuthors: (
    res: Response<string>,
    rej: Response<string>,
    props: GetAuthorsProps
  ) => void;
}

export interface GetAuthorsProps {
  include?: string[];
  search?: string;
  abortSignal?: AbortSignal;
}
