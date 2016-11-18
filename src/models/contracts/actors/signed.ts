import { Contract, IContract, Key } from '../contract';
import { IBaseActor } from './base';


@Contract.DataContext.register("SignedActor")
export class SignedActor extends Contract<IBaseActor> implements IBaseActor {
    public name: string;
    public publicKeys: string[];
}