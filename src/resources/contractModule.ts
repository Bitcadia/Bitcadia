import { SignedActor } from '../models/contracts/actors/signed';
import { FreeActor } from '../models/contracts/actors/free';
import { Contract, IContract } from '../models/contracts/contract';
import { Claim } from "../models/contracts/claims/claim";
import { Challenge } from "../models/contracts/challenges/challenge";
import { Referee } from "../models/contracts/referees/referee";
/**
 * ContractModule
 */
@ContractModule.register()
export class ContractModule {
    public static instance: ContractModule;
    static register() {
        return (constructor: Function) => {
            ContractModule.instance = new ContractModule();
        }
    }
    private addView(contract: Function, moduleId: string, model:string, viewType: string) {
        var map = this.map.get(viewType);
        map = map || this.map.set(viewType,map=new Map()) && map;
        map.set(Contract.DataContext.getRegistry(contract).roles.join('.'), [moduleId,model]);
    }
    public static getView(contract: IContract, viewType: string):[string,string] {
        var map = this.instance.map.get(viewType);
        var module = map && map.get(contract.roles.join('.'));
        var arr = module[0].split('.html');
        arr[0]+='.'+viewType;
        return [arr.join('.html'), module[1] && `${module[1]}.${viewType}`];
    }
    private constructor() {
        this.addView(FreeActor, "users/free-actor.html", null, "edit");
        this.addView(SignedActor, "users/signed-actor.html", null, "edit");
        this.addView(Referee, "referees/referee.html", "referees/referee", "edit");
        this.addView(Claim, "claims/claim.html", "claims/claim", "edit");
        this.addView(Challenge, "challenges/challenge.html", "challenges/challenge", "edit");
        this.addView(FreeActor, "users/free-actor.html", null, "view");
        this.addView(SignedActor, "users/signed-actor.html", null, "view");
        this.addView(Claim, "claims/claim.html", null, "view");
        this.addView(Referee, "referees/referee.html", null, "view");
        this.addView(Challenge, "challenges/challenge.html", null, "view");
    }
    private map: Map<string, Map<string,[string,string]>> = new Map();
}