import { Contract, IContract, Key } from '../contract';
import { IBaseActor } from '../actors/base';
import { IBaseCitation } from './base';

@Contract.DataContext.register("Citation")
@Contract.DataContext.entityProperty<Citation>("actor")
export class Citation extends Contract<IBaseCitation> implements IBaseCitation {
    public actor: IBaseActor;
    constructor(entity: IBaseCitation) {
        super(entity);
    }
}