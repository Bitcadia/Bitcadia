import { IContract } from './../../models/contracts/contract';
import { expect } from 'chai';
import { StageComponent, ComponentTester } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { configure } from "../../main";

import { User } from '../../models/contracts/users/user';
import { IBaseUser } from '../../models/contracts/users/base';

describe('Element "contract"', () => {

  let component: ComponentTester;
  let model: {
    contract: {
      entity: IContract
    },
    edit: boolean;
  };

  beforeEach(() => {
    component = StageComponent
      .withResources('resources/elements/contract')
      .inView(`<contract class="contract" contract.bind="contract" type.bind="edit?'edit':'view'"></contract>`);
    return component.bootstrap((bs) => configure(bs, false));
  });

  it('should bind to view template', (done) => {
    const user = new User({
      _id: "",
      seed: ""
    }) as IBaseUser;
    component.boundTo(model = {
      contract: { entity: user },
      edit: false
    }).create(bootstrap).then(() => {
      return component.waitForElement("compose");
    }).then((el) => {
      expect(el.getAttributeNames())
        .to
        .be
        .deep
        .equal(["view.bind", "model.bind", "class", "au-target-id"]);
      done();
    });
  });

  it('should bind to edit template', (done) => {
    const user = new User({
      _id: "",
      seed: ""
    }) as IBaseUser;
    component.boundTo(model = {
      contract: { entity: user },
      edit: false
    }).create(bootstrap).then(() => {
      model.contract.entity._id = "SomeName";
      return component.waitForElement("compose");
    }).then((el) => {
      expect(el.getAttributeNames())
        .to
        .be
        .deep
        .equal(["view.bind", "model.bind", "class", "au-target-id"]);
      done();
    });
  });

  afterEach(() => {
    component.dispose();
  });
});
