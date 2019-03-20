import { Challenge } from './../models/contracts/challenges/challenge';
import { Claim } from './../models/contracts/claims/claim';
import { Federation } from '../models/contracts/federations/federation';
import { Judge } from './../models/contracts/judges/judge';
import { User } from '../models/contracts/users/user';
import { Contract, IContract } from '../models/contracts/contract';

export const enum ViewType {
  edit = "edit",
  view = "view"
}
/**
 * ContractModule
 */
@ContractModule.register()
export class ContractModule {
  public static instance: ContractModule;
  static register() {
    return (constructor: Function) => {
      ContractModule.instance = new ContractModule();
    };
  }

  private addView(contract: Function, moduleId: string, model: string, viewType: ViewType) {
    let map = this.map.get(viewType);
    map = map || this.map.set(viewType, map = new Map()) && map;
    map.set(Contract.DataContext.getRegistry(contract).roles.join('.'), [moduleId, model]);
  }

  public static getView(contract: IContract, viewType: ViewType): [string, string] {
    const map = this.instance.map.get(viewType);
    const module = map && map.get(contract.roles.join('.'));
    const arr = module[0].split('.html');
    arr[0] += `.${viewType}`;
    return [arr.join('.html'), module[1] && `${module[1]}.${viewType}`];
  }

  private constructor() {
    this.addView(User, "users/user.html", "users/user", ViewType.edit);
    this.addView(Judge, "judges/judge.html", "judges/judge", ViewType.edit);
    this.addView(Claim, "claims/claim.html", "claims/claim", ViewType.edit);
    this.addView(Challenge, "challenges/challenge.html", "challenges/challenge", ViewType.edit);
    this.addView(Federation, "federations/federation.html", "federations/federation", ViewType.edit);

    this.addView(User, "users/user.html", null, ViewType.view);
    this.addView(Claim, "claims/claim.html", null, ViewType.view);
    this.addView(Judge, "judges/judge.html", null, ViewType.view);
    this.addView(Challenge, "challenges/challenge.html", null, ViewType.view);
    this.addView(Federation, "federations/federation.html", null, ViewType.view);
  }
  private map: Map<string, Map<string, [string, string]>> = new Map();
}
