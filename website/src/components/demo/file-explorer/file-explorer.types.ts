type CatalogItem = {
  name: string;
  closed?: boolean;
  children: (Folder | JsFile)[];
  isSelected?: boolean;
};

export type Folder = CatalogItem & { closed: boolean; };

export type JsFile = CatalogItem & { isJsFile: true; };