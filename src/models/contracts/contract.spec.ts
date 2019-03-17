import { Contract, IContract } from './contract';
import { expect } from 'chai';
import _ from 'lodash';
import * as Q from 'bluebird';
export interface ITest extends IContract {
  property: string;
}
export interface ISubTest extends ITest {
  test: ITest;
  tests: ITest[];
}
export interface IArrSubTest extends ITest {
  tests: ITestItem[];
}
export interface ITestItem {
  test: ITest;
}

@Contract.DataContext.register("Test")
class Test extends Contract<ITest> implements ITest {
  public property: string;
}

@Contract.DataContext.register("SubTest", [Test])
@Contract.DataContext.entityProperty<SubTest>("test")
@Contract.DataContext.entityProperty<SubTest>("tests").ArrPluck("")
class SubTest extends Contract<ISubTest> implements ISubTest {
  public property: string;
  public test: ITest;
  public tests: ITest[];
}

@Contract.DataContext.register("ArrSubTest", [Test])
@Contract.DataContext.entityProperty<ArrSubTest>("tests").ArrPluck<ITestItem>("test")
class ArrSubTest extends Contract<IArrSubTest> implements IArrSubTest {
  public property: string;
  public tests: ITestItem[];
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
  before(() => {
    const test1 = new Test({
      _id: "test1",
      property: "subThing"
    });
    const subTest1 = new SubTest({
      _id: "subTest1",
      property: "thing",
      test: test1,
      tests: [test1]
    });
    const arrSubTest1 = new ArrSubTest({
      _id: "arrSubTest1",
      property: "arrThing",
      tests: [{ test: test1 }, { test: subTest1 }]
    });
    return Q.Promise.all([Contract.DataContext.getInstance().destroy()]).timeout(1000).catch(() => { }).then(() => {
      Contract.DataContext.instance = null;
      return Q.Promise.all([
        Contract.DataContext.getInstance().put(test1),
        Contract.DataContext.getInstance().put(subTest1),
        Contract.DataContext.getInstance().put(arrSubTest1)
      ]);
    }).timeout(500).catch(() => { });
  });
  it('Loads a contract', () => {
    return Contract.DataContext.getInstance().get("arrSubTest1").then((value: IContract) => {
      const arrSubTest = value as ArrSubTest;
      const subTest = arrSubTest.tests[1].test as SubTest;
      const test = subTest.test as Test;
      const test1 = subTest.tests[0] as Test;
      expect(subTest.constructor).to.equal(SubTest);
      expect(test.constructor).to.equal(Test).and.to.equal(test1.constructor);
      expect(arrSubTest.constructor).to.equal(ArrSubTest);
    });
  });
});
