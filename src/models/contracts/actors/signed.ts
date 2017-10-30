import { Contract, IContract, Key } from '../contract';
import { BaseActor, IBaseActor } from './base';

@Contract.DataContext.register("SignedActor", [BaseActor])
export class SignedActor extends Contract<IBaseActor> implements IBaseActor {
    public name: string;
    public publicKeys: string[];
}