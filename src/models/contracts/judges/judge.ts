import { DataContext } from '../dataContext';
import { Contract } from '../contract';
import { IBaseUser } from '../users/base';
import { IBaseJudge } from './base';
import { IBaseFederation } from "../federations/base";

@DataContext.register()
@DataContext.entityProperties<IBaseJudge>({
  actor: true,
  federation: true,
  appealJudges: [true]
})
export class Judge extends Contract<IBaseJudge> implements IBaseJudge {
  public static contractName = "Judge";
  public actor: IBaseUser;
  public appealJudges: IBaseJudge[];
  public federation: IBaseFederation;
}
