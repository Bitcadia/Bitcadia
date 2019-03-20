import { IContract } from './../../models/contracts/contract';
import { expect } from 'chai';
import { StageComponent, ComponentTester } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { waitUntil } from '../../test/unit/util';
import { User } from '../../../scripts/models/contracts/users/user';
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
  });

  it('should bind to view template', (done) => {
    const user = new User() as IBaseUser;
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
    component.boundTo(model = {
      contract: {
        roles: ["Thing"],
        name: "",
        entity: {}
      },
      edit: true
    }).create(bootstrap).then(() => {
      model.contract.name = "SomeName";
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
