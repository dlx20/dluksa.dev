// True when the link points at the current page or one of its subpages
export const isActivePath = (pathName: string, url: string) =>
  pathName === url || (url !== "/" && pathName.startsWith(`${url}/`));
