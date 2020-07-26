import { IContract } from '../models/contracts/contract';
import { DataContext } from '../models/contracts/dataContext';
import { autoinject } from 'aurelia-framework';

@autoinject
export class Cart {
  public contracts: IContract[] = [];
  constructor(private context: DataContext) {
    this.load();
  }

  public load() {
    this.context.getInstance("Cart").allDocs({
      include_docs: true,
      attachments: true
    }).then((results) => {
      this.contracts = results.rows.map((item) => item.doc);
    });
  }

  public refresh() {
    const cart = this;
    return () => {
      cart.load();
    };
  }
}
