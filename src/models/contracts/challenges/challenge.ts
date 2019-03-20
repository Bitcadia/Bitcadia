import { Contract, IContract, Key } from '../contract';
import { IBaseUser } from '../users/base';
import { IBaseChallenge } from './base';

@Contract.DataContext.register("Challenge")
@Contract.DataContext.entityProperties<Challenge>({ actor: true })
export class Challenge extends Contract<IBaseChallenge> implements IBaseChallenge {
  public actor: IBaseUser;
  constructor(entity: IBaseChallenge) {
    super(entity);
  }
}
