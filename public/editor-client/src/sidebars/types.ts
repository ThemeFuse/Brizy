import { Response } from "../types/Response";

export interface Sidebars {
  getSidebars: (res: Response<Sidebar[]>, rej: Response<string>) => void;
}

export interface Sidebar {
  id: string;
  title: string;
}
