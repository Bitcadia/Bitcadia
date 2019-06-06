import { Contract } from '../contract';
import { DataContext } from '../dataContext';
import { IBaseUser } from '../users/base';
import { IBaseClaim } from './base';

@DataContext.register()
@DataContext.entityProperties<IBaseClaim>({ actor: true })
export class Claim extends Contract<IBaseClaim> implements IBaseClaim {
  public static contractName = "Claim";
  public title: string;
  public content: string;
  public actor: IBaseUser;
}
