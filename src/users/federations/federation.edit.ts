import { DataContext } from "../../models/contracts/dataContext";
import { IBaseChallenge } from "../../models/contracts/challenges/base";
import { autoinject } from "aurelia-framework";
import { Judge } from "models/contracts/judges/judge";

@autoinject
export class ViewModel {
  public contract: IBaseChallenge;
  public actorOptions: Judge[];
  constructor(private dataContext: DataContext) { }

  public async activate(model) {
    const results = await this.dataContext.getContracts<Judge>(Judge, "Cart");
    this.actorOptions = results;
    this.contract = model;
  }
}
