import { User } from './../models/contracts/users/user';
import { Router } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { CurrentUser, GetCurrentUser } from './current';
import { Contract } from '../models/contracts/contract';

@autoinject
export class Create {
  constructor(public router: Router) {
  }

  public activate() {
    return GetCurrentUser().then(() => {
      if (!CurrentUser.decryptedUser || CurrentUser.decryptedUser.paid) {
        this.router.navigate("home")
      }
    });
  }

  public purchase() {
    CurrentUser.decryptedUser.paid = true;
    Contract.DataContext.getInstance().put(CurrentUser.decryptedUser).then(
      (val) => {
        Contract.DataContext.getInstance().get<User>(val.id).then((val) => {
          CurrentUser.decryptedUser = val;
          CurrentUser.user = val;
          this.router.navigate("home");
        })
      }
    );
  }
}
