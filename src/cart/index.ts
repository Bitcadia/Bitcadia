import { Contract, IContract } from '../models/contracts/contract';

export class Cart {
    public contracts:IContract[]=[];
    constructor(){
        Contract.DataContext.getInstance().allDocs().then((results)=>{
            this.contracts=results.rows.map((item)=>item.doc);
        })
    }
}