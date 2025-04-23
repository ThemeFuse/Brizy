import { Response } from "@/types/Response";

export interface MenuSimple {
  count: number;
  description: string;
  filter: string;
  name: string;
  parent: number;
  slug: string;
  taxonomy: string;
  term_group: number;
  term_id: number;
  term_taxonomy_id: number;
}

export interface MenusTemplate {
  handler: (res: Response<MenuSimple[]>, rej: Response<string>) => void;
}
