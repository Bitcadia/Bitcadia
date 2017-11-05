import { Contract, IContract } from '../models/contracts/contract';
import { Question } from "../models/contracts/questions/question";
import { IBaseQuestion } from "../models/contracts/questions/base";

export class Cart {
    public contracts: IBaseQuestion[] = [];
    constructor() {
        this.load();
    }

    public load() {
        Contract.DataContext.getInstance().allDocs({
            include_docs: true,
            attachments: true
        }).then((results) => {
            this.contracts = results.rows.map((item) => <any>item.doc as IBaseQuestion)
                .filter(ref => ~ref.roles.indexOf("Question"));
        });
    }

    public refresh() {
        var cart = this;
        return () => {
            cart.load();
        }
    }
}