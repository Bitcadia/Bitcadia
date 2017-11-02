import { Contract, IContract, Key } from '../contract';
import { IBaseActor } from '../actors/base';
import { IBaseFederation } from './base';

@Contract.DataContext.register("Federation")
@Contract.DataContext.entityProperty<Federation>("actor")
export class Federation extends Contract<IBaseFederation> implements IBaseFederation {
    public actor: IBaseActor;
    constructor(entity: IBaseFederation) {
        super(entity);
    }
}