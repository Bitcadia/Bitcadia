import { DataContext } from '../dataContext';
import { Contract } from '../contract';
import { IBaseUser } from '../users/base';
import { IBaseFederation } from './base';

@DataContext.register()
@DataContext.entityProperties<Federation>({ actor: true })
export class Federation extends Contract<IBaseFederation> implements IBaseFederation {
  public static contractName = "Federation";
  public actor: IBaseUser;
}
