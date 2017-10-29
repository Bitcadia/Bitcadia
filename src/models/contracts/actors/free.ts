import { Contract, IContract } from '../contract';
import { BaseActor, IBaseActor } from './base';

@Contract.DataContext.register("FreeActor", [BaseActor])
export class FreeActor extends Contract<IBaseActor> implements IBaseActor {
    public name: string;
}