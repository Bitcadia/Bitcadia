import { Contract, IContract } from '../contract';
import { IBaseActor } from '../actors/base';
import { IBaseQuestion } from '../questions/base';

export interface IBaseClaim extends Contract {
    actor: IBaseActor;
    question: IBaseQuestion;
    title: string;
    content: string;
}