declare module "*.json"
{
  const value: object | any[];
  export = value;
}
declare module "text!*"
{
  const value: string;
  export = value;
}
