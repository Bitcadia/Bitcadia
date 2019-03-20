import { Contract, IContract, Key } from '../contract';
import { IBaseUser } from '../users/base';
import { IBaseFederation } from './base';

@Contract.DataContext.register("Federation")
@Contract.DataContext.entityProperties<Federation>({ actor: true })
export class Federation extends Contract<IBaseFederation> implements IBaseFederation {
  public actor: IBaseUser;
  constructor(entity: IBaseFederation) {
    super(entity);
  }
}
