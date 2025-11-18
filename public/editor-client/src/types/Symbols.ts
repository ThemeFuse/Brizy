interface CommonSymbolProps {
  uid: string;
  label: string;
  className: string;
  version: number;
  linkedSymbolId?: string;
}

export interface CSSSymbol extends CommonSymbolProps {
  type: string;
  model: {
    vd: Record<string, unknown>;
    vs: Record<string, unknown>;
    v: Record<string, unknown>;
  };
  compiledData: string;
}

export interface APISymbol extends CommonSymbolProps {
  componentTarget: string;
  data: string;
  compiledStyles: string;
}
