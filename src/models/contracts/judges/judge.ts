import { Contract, IContract, Key } from '../contract';
import { IBaseUser } from '../users/base';
import { IBaseJudge } from './base';
import { IBaseFederation } from "../federations/base";

@Contract.DataContext.register("Judge", [])
@Contract.DataContext.entityProperties<IBaseJudge>({
  actor: true,
  federation: true,
  appealJudges: [true]
})
export class Judge extends Contract<IBaseJudge> implements IBaseJudge {
  public actor: IBaseUser;
  public appealJudges: IBaseJudge[];
  public federation: IBaseFederation;
  constructor(entity: IBaseJudge) {
    super(entity);
  }
}
