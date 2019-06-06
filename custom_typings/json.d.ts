declare module "*.json"
{
}

declare module "text!*"
{
  const value: string;
  export = value;
}
declare module "*.css"
{
  const value: string;
  export = value;
}
declare module "*.html"
{
  const value: string;
  export = value;
}
