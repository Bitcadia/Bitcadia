import { Contract, IContract } from '../contract';
import { IBaseUser } from '../users/base';
import { IBaseQuestion } from '../questions/base';

export interface IBaseClaim extends Contract {
    actor: IBaseUser;
    question: IBaseQuestion;
    title: string;
    content: string;
}