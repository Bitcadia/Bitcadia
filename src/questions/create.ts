import { ContractModule } from '../resources/contractModule';
import { Contract } from "../models/contracts/contract";
import { bindable, computedFrom } from 'aurelia-framework';
import { FreeActor } from '../models/contracts/actors/free';
import { SignedActor } from '../models/contracts/actors/signed';
import { IBaseQuestion } from '../models/contracts/questions/base'
import { IBaseActor } from '../models/contracts/actors/base'
import { Question } from '../models/contracts/questions/question';

interface QuestionSelection {
    factory: () => IBaseQuestion,
    instance?: IBaseQuestion,
    displayName: string
}
export class Create {
    @computedFrom('contract._id')
    get contractType(): string {
        return (this.contract && this.contract._id) ? 'view' : 'edit';
    }
    public contract = new Question(null);
    public QuestionDropDownOptions: QuestionSelection[];

    public addNew() {
        var create = this;
        return () => {
            create.contract = new Question(null);
        }
    }
}