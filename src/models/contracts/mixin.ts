import { Contract, IContract } from "./contract";
export function Mixin<T extends Contract, I extends IContract>(baseCtors: Contract.ContractConstructor<T, I>[]) {
    return (derivedCtor: Contract.ContractConstructor<T, I>) => {
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    }
}