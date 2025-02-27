import { Response } from "../types/Response";

export interface Terms {
  getTerms: (
    res: Response<
      {
        name: string;
        term_id: number;
        slug: string;
      }[]
    >,
    rej: Response<string>,
    taxonomy: string
  ) => void;
  getTermsBy: (
    res: Response<
      {
        term_id: number;
        name: string;
        taxonomy: string;
        taxonomy_name: string;
      }[]
    >,
    rej: Response<string>,
    data: GetTermsByProps
  ) => void;
}

export interface GetTermsByProps {
  include?: [string, string][];
  search?: string;
  abortSignal?: AbortSignal;
}
