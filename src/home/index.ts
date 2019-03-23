import { customElement, autoinject, computedFrom } from 'aurelia-framework';
import { DialogService, DialogOpenPromise, DialogCancellableOpenResult } from 'aurelia-dialog';
import { CurrentUser, GetCurrentUser } from '../users/current';
import { Router } from 'aurelia-router';
import { LogIn } from '../resources/prompts/log-in';

const contactsJson: any[] = [].map((item) => {
  item.json = JSON.stringify(item);
  return item;
});

interface Contacts {
  "id": number;
  "first_name": string;
  "last_name": string;
  "email": string;
  "country": string;
  "modified": string;
  "vip": boolean;
  "json": string;
}
@customElement('log-in-out')
@autoinject()
export class Index {
  static dialogPromise: DialogOpenPromise<DialogCancellableOpenResult>;
  public filterString: string;
  public currentUser = CurrentUser;

  @computedFrom("currentUser.user")
  public get hasUser(): boolean {
    return !!this.currentUser.user;
  }
  @computedFrom("currentUser.decryptedUser")
  public get hasDecryptedUser(): boolean {
    return !!this.currentUser.decryptedUser;
  }
  @computedFrom("currentUser.decryptedUser.setup")
  public get hasSetupUser(): boolean {
    return this.hasDecryptedUser && !!this.currentUser.decryptedUser.setup;
  }

  constructor(public dialogService: DialogService, public router: Router) { }

  @computedFrom("filterString", "currentUser.decryptedUser")
  public get contacts(): Contacts[] {
    if (!this.filterString) {
      return contactsJson;
    }
    const tokens = this.filterString.split(" ");
    return contactsJson.filter((item) => this.filter(item, tokens));
  }

  public filter(item: Contacts, tokens: string[]) {
    return tokens.every((token) => item.json.includes(token));
  }

  public attached() {
    return GetCurrentUser().then((user) => {
      if (Index.dialogPromise) {
        return Index.dialogPromise;
      }
      if (this.hasUser && !this.hasDecryptedUser) {
        Index.dialogPromise = this.dialogService.open({ viewModel: LogIn });
        return Index.dialogPromise.then((result) => (Index.dialogPromise = null) || result);
      }
      if (!this.hasUser) {
        return this.router.navigateToRoute("createUser");
      }
      if (this.hasDecryptedUser && !this.hasSetupUser) {
        return this.router.navigateToRoute("setup");
      }
      return user as any;
    });
  }
}
