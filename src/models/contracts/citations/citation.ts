import { Contract, IContract, Key } from '../contract';
import { IBaseUser } from '../users/base';
import { IBaseCitation } from './base';

@Contract.DataContext.register("Citation")
@Contract.DataContext.entityProperty<Citation>("actor")
export class Citation extends Contract<IBaseCitation> implements IBaseCitation {
    public actor: IBaseUser;
    constructor(entity: IBaseCitation) {
        super(entity);
    }
}