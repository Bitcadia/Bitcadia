import { Contract, IContract } from './contract';
import { DataContext, IRegistry, IContractCtor } from './dataContext';
import { Container } from 'aurelia-dependency-injection';
import { expect } from 'chai';
import _ from 'lodash';
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

@DataContext.register()
class Test extends Contract<ITest> implements ITest {
  public static contractName = "Test";
  public property: string;
}

@DataContext.register([Test])
@DataContext.entityProperties<ISubTest>({
  blammo: true,
  stuffs: [true]
})
class SubTest extends Contract<ISubTest> implements ISubTest {
  public static contractName = "SubTest";
  public property: string;
  public blammo: ITest;
  public stuffs: ITest[];
}

@DataContext.register([Test])
@DataContext.entityProperties<IArrSubTest>({ other: [{ hello: true }] })
class ArrSubTest extends Contract<IArrSubTest> implements IArrSubTest {
  public static contractName = "ArrSubTest";
  public property: string;
  public other: ITestItem[];
}
const container = new Container();
container.registerInstance(DataContext, container.invoke(DataContext));

before(() => indexedDB.deleteDatabase("_pouch_Cart"));
after(() => indexedDB.deleteDatabase("_pouch_Cart"));
describe('The Contract', async () => {
  const dataContext: DataContext = await container.get(DataContext);
  const registry: { [id: string]: IRegistry; } = dataContext['registryStringMap'];
  it('Registers itself', () => {
    expect(registry["Test"].contractConstructor).to.equal(Test);
    expect(registry["Test"].roles).to.members(["Test"]);
  });
  it('Initializes', () => {
    const test = new Test(container.get(DataContext), { _id: "cool", signatures: [], property: "Thing", roles: null });
    expect(test.roles).to.contain("Test");
    expect(test.property).to.equal("Thing");
  });
  it('Fails to Register', () => {
    try {
      @DataContext.register()
      class Test2 extends Contract<ITest> implements ITest {
        public static contractName = "Test";
        public property: string;
      }
    }
    catch (err) {
      expect(err.message).to.equal(`A contract has already registered the name Test`);
    }
  });
});

describe("The DataContext", async function () {
  const dataContext: DataContext = container.get(DataContext);
  it('Loads a contract', async () => {
    const test1 = new Test(dataContext, {
      _id: "test1",
      property: "subThing"
    });
    const subTest1 = new SubTest(dataContext, {
      _id: "subTest1",
      property: "thing",
      blammo: test1,
      stuffs: [test1]
    });
    const arrSubTest1 = new ArrSubTest(dataContext, {
      _id: "arrSubTest1",
      property: "arrThing",
      other: [{ hello: test1 }, { hello: subTest1 }]
    });

    await dataContext.getInstance("Cart").put(test1);
    await dataContext.getInstance("Cart").put(subTest1);
    await dataContext.getInstance("Cart").put(arrSubTest1);

    const value = await dataContext.getInstance("Cart").get("arrSubTest1");
    const arrSubTest = value as ArrSubTest;
    const subTest = arrSubTest.other[1].hello as SubTest;
    const test = subTest.blammo as Test;
    const otherTest = subTest.stuffs[0] as Test;
    expect(subTest.constructor).to.equal(SubTest);
    expect(test.constructor).to.equal(Test).and.to.equal(otherTest.constructor);
    expect(arrSubTest.constructor).to.equal(ArrSubTest);
  });
});
