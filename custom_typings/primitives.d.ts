declare interface StringMap<T> {
  [x: string]: T;
}
type Primitive = number | string | boolean | null | undefined;
declare interface StringMapPrimitive {
  [x: string]: Primitive | StringMapPrimitive;
  [y: number]: Primitive | StringMapPrimitive;
}
type FilterProperties<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never
};
type AllowedProperties<Base, Condition> = FilterProperties<Base, Condition>[keyof Base];
type SubType<Base, Condition> = Pick<Base, AllowedProperties<Base, Condition>>;
