declare module "*.json"
{
}

declare module "text!*"
{
  const value: string;
  export = value;
}
