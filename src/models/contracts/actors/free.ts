import { Contract, IContract } from '../contract';
import { IBaseActor } from './base';

@Contract.DataContext.register("FreeActor")
export class FreeActor extends Contract<IBaseActor> implements IBaseActor {
    public name: string;
}