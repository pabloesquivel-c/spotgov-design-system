export type BreadcrumbItem = {
  label: string;
  href: string;
};

export type BreadcrumbItemWithMenu = BreadcrumbItem & {
  items?: BreadcrumbItem[];
};
