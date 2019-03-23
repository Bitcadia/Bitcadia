import { IContract } from './../../models/contracts/contract';
import { expect } from 'chai';
import { StageComponent, ComponentTester } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { configure } from "../../main";

import { User } from '../../models/contracts/users/user';
import { IBaseUser } from '../../models/contracts/users/base';
import { waitUntil } from '../../test/unit/util';

describe('Element "contract"', function () {
  this.timeout(10000);
  let component: ComponentTester;

  beforeEach(() => {
    component = StageComponent
      .withResources('resources/elements/contract')
      .inView(`<contract class="contract" contract.bind="contract" type.bind="edit?'edit':'view'"></contract>`);
    return component.bootstrap((bs) => configure(bs, false));
  });

  it('should bind to view template', async () => {
    const user = new User({
      _id: "",
      seed: ""
    }) as IBaseUser;

    await component.boundTo({
      contract: { entity: user },
      edit: false
    }).create(bootstrap);

    const el = await component.waitForElement("compose");
    expect(el.getAttributeNames())
      .to
      .be
      .deep
      .equal(["view.bind", "model.bind", "class", "au-target-id"]);
  });

  it('should bind to edit template', async () => {
    const user = new User({
      _id: "",
      seed: ""
    }) as IBaseUser;

    await component.boundTo({
      contract: { entity: user },
      edit: true
    }).create(bootstrap);

    const el = await component.waitForElement("compose");
    expect(el.getAttributeNames())
      .to
      .be
      .deep
      .equal(["view.bind", "view-model.bind", "model.bind", "class", "au-target-id"]);
    const inputEl: NodeListOf<HTMLInputElement> = await component.waitForElements("input") as NodeListOf<HTMLInputElement>;
    expect(inputEl).to.exist;
    inputEl[1].value = "Thing";
    inputEl[0].value = "OtherThing";
    const buttonEl: HTMLButtonElement = await component.waitForElement("button") as HTMLButtonElement;
    const textEl: HTMLButtonElement = await component.waitForElement("textarea") as HTMLButtonElement;
    buttonEl.dispatchEvent(new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    }));
    inputEl[0].dispatchEvent(new Event('input'));
    inputEl[1].dispatchEvent(new Event('input'));
    expect(await waitUntil(() => user.seed !== "" && textEl.value === user.seed)).to.be.true;
    expect((user as any).password).to.equal("Thing");
    expect((user as any).passwordRepeat).to.equal("OtherThing");
  });

  afterEach(() => {
    component.dispose();
  });
});
