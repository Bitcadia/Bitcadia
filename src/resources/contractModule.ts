import { User } from '../models/contracts/users/user';
import { Contract, IContract } from '../models/contracts/contract';
import { Claim } from "../models/contracts/claims/claim";
import { Challenge } from "../models/contracts/challenges/challenge";
import { Judge } from "../models/contracts/judges/judge";
import { Citation } from "../models/contracts/citations/citation";
import { Federation } from "../models/contracts/federations/federation";
import { Question } from "../models/contracts/questions/question";
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
    private addView(contract: Function, moduleId: string, model: string, viewType: string) {
        var map = this.map.get(viewType);
        map = map || this.map.set(viewType, map = new Map()) && map;
        map.set(Contract.DataContext.getRegistry(contract).roles.join('.'), [moduleId, model]);
    }
    public static getView(contract: IContract, viewType: string): [string, string] {
        var map = this.instance.map.get(viewType);
        var module = map && map.get(contract.roles.join('.'));
        var arr = module[0].split('.html');
        arr[0] += '.' + viewType;
        return [arr.join('.html'), module[1] && `${module[1]}.${viewType}`];
    }
    private constructor() {
        this.addView(User, "users/user.html", null, "edit");
        this.addView(Judge, "judges/judge.html", "judges/judge", "edit");
        this.addView(Claim, "claims/claim.html", "claims/claim", "edit");
        this.addView(Challenge, "challenges/challenge.html", "challenges/challenge", "edit");
        this.addView(Citation, "citations/citation.html", "citations/citation", "edit");
        this.addView(Federation, "federations/federation.html", "federations/federation", "edit");
        this.addView(Question, "questions/question.html", "questions/question", "edit");

        this.addView(User, "users/user.html", null, "view");
        this.addView(Claim, "claims/claim.html", null, "view");
        this.addView(Judge, "judges/judge.html", null, "view");
        this.addView(Challenge, "challenges/challenge.html", null, "view");
        this.addView(Citation, "citations/citation.html", null, "view");
        this.addView(Federation, "federations/federation.html", null, "view");
        this.addView(Question, "questions/question.html", "questions/question", "view");
    }
    private map: Map<string, Map<string, [string, string]>> = new Map();
}