import { Contract, IContract } from '../../../src/models/contracts/contract';
import { expect } from 'chai';
import _ from 'lodash';
export interface ITest extends IContract {
    property: string;
}
export interface ISubTest extends ITest {
    subProperty: ITest;
}

@Contract.DataContext.register("Test")
class Test<T extends ITest> extends Contract<T> implements ITest {
    public property: string;
}

@Contract.DataContext.register("SubTest")
@Contract.DataContext.entityProperty("subProperty")
class SubTest extends Test<ISubTest> implements ISubTest {
    public property: string;
    public subProperty: ITest;
}
describe('The Contract', () => {
    var registry: { [id: string]: Contract.IRegistry; } = (<any>Contract.DataContext).registry
    it('Registers itself', () => {
        expect((<any>Test).contractName).to.equal("Test");
        expect(registry["Test"].contractConstructor).to.equal(Test);
        expect(registry["Test"].subRegistry["SubTest"].contractConstructor).to.equal(SubTest);
        expect(registry["Test"].subRegistry["SubTest"].transformProperties).to.contain("subProperty");
        expect(registry["Test"].roles).to.members(["Test"]);
        expect(registry["Test"].subRegistry["SubTest"].roles).to.members(["Test", "SubTest"]);
    });
    it('Initializes', () => {
        var test = new Test({ _id: "cool", signatures: [], property: "Thing", roles: null });
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
            expect(err.message).to.equal(`A contract has already registered the name Test`)
        }
    });
});

describe("The DataContext", () => {
    before(() => {
        var test = new Test<ITest>({ _id: "test1", property: "subThing" });
        var subTest1 = new SubTest({ _id: "subTest1", property: "thing", subProperty: test });
        return Contract.DataContext.getInstance().destroy().then(() => {
            Contract.DataContext.instance = null;
            return Contract.DataContext.getInstance().put(test).then(() =>
                Contract.DataContext.getInstance().put(subTest1)
            );
        });
    });
    it('Loads a contract', (done) => {
        Contract.DataContext.getInstance().get("subTest1").then((value: IContract) => {
            var subTest: SubTest = <any>value;
            var test: Test<ITest> = subTest.subProperty as Test<ITest>;
            expect(subTest.constructor).to.equal(SubTest);
            expect(test.constructor).to.equal(Test);
            done();
        })
    });
});