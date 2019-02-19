import { Contract, IContract, Key } from '../contract';
import { IBaseUser } from '../users/base';
import { IBaseClaim } from './base';

@Contract.DataContext.register("Claim")
@Contract.DataContext.entityProperty<IBaseClaim>("actor")
export class Claim extends Contract<IBaseClaim> implements IBaseClaim {
  public title: string;
  public content: string;
  public actor: IBaseUser;
  constructor(entity: IBaseClaim) {
    super(entity);
  }
}
