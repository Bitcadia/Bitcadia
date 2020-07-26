import { Contract } from '../contract';
import { DataContext } from '../dataContext';
import { IBaseUser } from '../users/base';
import { IBaseChallenge } from './base';

@DataContext.register()
@DataContext.entityProperties<Challenge>({ actor: true })
export class Challenge extends Contract<IBaseChallenge> implements IBaseChallenge {
  public static contractName = "Challenge";
  public actor: IBaseUser;
}
