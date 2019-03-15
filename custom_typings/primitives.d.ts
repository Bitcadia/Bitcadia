declare interface StringMap<T> {
  [x: string]: T;
}
type Primitive = number | string | boolean | null | undefined;
declare interface StringMapPrimitive {
  [x: string]: Primitive | StringMapPrimitive;
  [y: number]: Primitive | StringMapPrimitive;
}