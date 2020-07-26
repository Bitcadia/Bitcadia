import { Clear } from './clear';
import { CurrentUser } from '../../users/current';
import { DialogService } from 'aurelia-dialog';
import { autoinject } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";

@autoinject
export class Logout {
  public password = null;
  public errors = [];
  constructor(
    public dialogController: DialogController,
    public dialogService: DialogService,
    private currentUser: CurrentUser) {
    dialogController.settings.lock = false;
    dialogController.settings.centerHorizontalOnly = true;
  }

  public clear() {
    this.dialogService.open({ viewModel: Clear })
      .whenClosed((result) => {
        if (!result.wasCancelled) this.dialogController.cancel();
      });
  }

  public logout() {
    this.currentUser.decryptedUser = null;
    this.dialogController.ok();
  }
}
