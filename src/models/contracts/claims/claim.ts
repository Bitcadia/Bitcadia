import { Contract, IContract, Key } from '../contract';
import { IBaseUser } from '../users/base';
import { IBaseClaim } from './base';

@Contract.DataContext.register("Claim")
@Contract.DataContext.entityProperties<IBaseClaim>({ actor: true })
export class Claim extends Contract<IBaseClaim> implements IBaseClaim {
  public title: string;
  public content: string;
  public actor: IBaseUser;
  constructor(entity: IBaseClaim) {
    super(entity);
  }
}
