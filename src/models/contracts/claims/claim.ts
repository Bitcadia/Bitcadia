import { Contract, IContract, Key } from '../contract';
import { IBaseActor } from '../actors/base';
import { IBaseClaim } from './base';

@Contract.DataContext.register("Claim")
@Contract.DataContext.entityProperty<Claim>("actor")
export class Claim extends Contract<IBaseClaim> implements IBaseClaim {
    public actor: IBaseActor;
    constructor(entity: IBaseClaim) {
        super(entity);
    }
}