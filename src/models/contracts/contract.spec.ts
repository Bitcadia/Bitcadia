import { Contract, IContract } from './contract';
import { expect } from 'chai';
import _ from 'lodash';
import * as Q from 'bluebird';
export interface ITest extends IContract {
  property: string;
}
export interface ISubTest extends ITest {
  blammo: ITest;
  stuffs: ITest[];
}
export interface IArrSubTest extends ITest {
  other: ITestItem[];
}
export interface ITestItem {
  hello: ITest;
}

@Contract.DataContext.register("Test")
class Test extends Contract<ITest> implements ITest {
  public property: string;
}

@Contract.DataContext.register("SubTest", [Test])
@Contract.DataContext.entityProperties<ISubTest>({
  blammo: true,
  stuffs: [true]
})
class SubTest extends Contract<ISubTest> implements ISubTest {
  public property: string;
  public blammo: ITest;
  public stuffs: ITest[];
}

@Contract.DataContext.register("ArrSubTest", [Test])
@Contract.DataContext.entityProperties<IArrSubTest>({ other: [{ hello: true }] })
class ArrSubTest extends Contract<IArrSubTest> implements IArrSubTest {
  public property: string;
  public other: ITestItem[];
}
describe('The Contract', () => {
  const registry: { [id: string]: Contract.IRegistry; } = (<any>Contract.DataContext).registryStringMap;
  it('Registers itself', () => {
    expect((<any>Test).contractName).to.equal("Test");
    expect(registry["Test"].contractConstructor).to.equal(Test);
    expect(registry["Test"].roles).to.members(["Test"]);
  });
  it('Initializes', () => {
    const test = new Test({ _id: "cool", signatures: [], property: "Thing", roles: null });
    expect(test.roles).to.contain("Test");
    expect(test.property).to.equal("Thing");
  });
  it('Fails to Register', () => {
    try {
      @Contract.DataContext.register("Test")
      class Test2 extends Contract<ITest> implements ITest {
        public property: string;
      }
    }
    catch (err) {
      expect(err.message).to.equal(`A contract has already registered the name Test`);
    }
  });
});

describe("The DataContext", function () {
  it('Loads a contract', () => {
    const test1 = new Test({
      _id: "test1",
      property: "subThing"
    });
    const subTest1 = new SubTest({
      _id: "subTest1",
      property: "thing",
      blammo: test1,
      stuffs: [test1]
    });
    const arrSubTest1 = new ArrSubTest({
      _id: "arrSubTest1",
      property: "arrThing",
      other: [{ hello: test1 }, { hello: subTest1 }]
    });
    return Q.Promise.all([Contract.DataContext.getInstance().destroy()]).timeout(1000).catch(() => { }).then(() => {
      Contract.DataContext.instance = null;
      return Contract.DataContext.getInstance().put(test1).then(() =>
        Contract.DataContext.getInstance().put(subTest1)).then(() =>
          Contract.DataContext.getInstance().put(arrSubTest1));
    }).timeout(1000).then(() => {
      return Contract.DataContext.getInstance().get("arrSubTest1").then((value: IContract) => {
        const arrSubTest = value as ArrSubTest;
        const subTest = arrSubTest.other[1].hello as SubTest;
        const test = subTest.blammo as Test;
        const test1 = subTest.stuffs[0] as Test;
        expect(subTest.constructor).to.equal(SubTest);
        expect(test.constructor).to.equal(Test).and.to.equal(test1.constructor);
        expect(arrSubTest.constructor).to.equal(ArrSubTest);
      });
    });
  });
});
