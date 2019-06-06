import { DataContext } from "../../models/contracts/dataContext";
import { IBaseUser } from "../../models/contracts/users/base";

export class Cart {
  public contracts: IBaseUser[] = [];

  constructor(private dataContext: DataContext) {
    this.load();
  }

  public load() {
    this.dataContext.getInstance("Cart").allDocs({
      include_docs: true,
      attachments: true
    }).then((results) => {
      this.contracts = results.rows.map((item) => <any>item.doc as IBaseUser)
        .filter((ref) => ~ref.roles.indexOf("User"));
    });
  }

  public refresh() {
    const cart = this;
    return () => {
      cart.load();
    };
  }
}
